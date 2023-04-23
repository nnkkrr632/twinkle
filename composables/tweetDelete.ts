import { useRoute } from '#imports'
import { doc, getFirestore, writeBatch } from 'firebase/firestore'
import { useAuthByGoogleAccount } from '@/composables/auth'
import { useStorage } from '@/composables/storage'
import { useTweetSelect } from '@/composables/tweetSelect'

// ツイート削除
export const useTweetDelete = () => {
    const deleteTweet = async (tweetDocId: string) => {
        const db = getFirestore()
        const batch = writeBatch(db)
        const { getRetouchedTweets, doesTweetExists } = useTweetSelect()
        const { deleteImage } = useStorage()
        const { me } = useAuthByGoogleAccount()

        if (!me.value) {
            alert('ログインしていません。')
            return false
        }

        const exists = await doesTweetExists(tweetDocId)
        if(!exists) {
            // アカウント削除時(= ルート: settings/delete)は表示しない
            const route = useRoute()
            if(!route.path.includes('settings'))
            alert('ツイートが存在しません。既に削除されている可能性があります。\n画面の更新をお試しください。')
            return false
        }

        const tweet = await getRetouchedTweets([tweetDocId])
        if (!tweet) {
            // このifには入らない。型定義のため
            return false
        }

        // 画像の削除
        const imageFullPaths = tweet[0]?.imageFullPaths ?? []
        for (const imageFullPath of imageFullPaths) {
            await deleteImage(imageFullPath)
        }

        try {
            // tweetsコレクション側
            batch.delete(doc(db, 'tweets', tweetDocId))
            // セキュリティルールの都合上、(1)(2)の削除を辞める
            // (1)tweets/xxx/retweetUsersSubCollection (2)/tweets/xxx/likeUsersSubCollection
            // (1)(2)のサブコレクションに対するセキュリティルールを「自分のuserSlugのドキュメントだけを削除できる」にするため。
            // ↓を許可するセキュリティルールにすると、リツイートorいいね取り消しのときに他人のリツイートorいいねを取り消せてしまう
            // // tweets/xxx/retweetUsersSubCollection
            // const retweetUsersSubCollectionColRef = collection(db, 'tweets', tweetDocId, 'retweetUsersSubCollection')
            // const retweetUsersQuerySnapshot = await getDocs(retweetUsersSubCollectionColRef)
            // retweetUsersQuerySnapshot.forEach((queryDocSnapshot) => {
            //     const docRef = queryDocSnapshot.ref
            //     batch.delete(docRef)
            // })
            // // tweets/xxx/likeUsersSubCollection
            // const likeUsersSubCollectionColRef = collection(db, 'tweets', tweetDocId, 'likeUsersSubCollection')
            // const likeUsersColSnapshot = await getDocs(likeUsersSubCollectionColRef)
            // likeUsersColSnapshot.forEach((queryDocSnapshot) => {
            //     const docRef = queryDocSnapshot.ref
            //     batch.delete(docRef)
            // })
            // usersコレクション側
            const myTweetDocRef = doc(db, 'users', me.value.uid, 'myTweetsSubCollection', tweetDocId)
            batch.delete(myTweetDocRef)

            await batch.commit()
            return true
        } catch (error) {
            // console.debug('useTweetDelete()のdeleteTweet()でエラー発生')
            console.error(error)
            alert('何かしらの理由によりリツイートに失敗しました。')
            return false
        }
    }

    return { deleteTweet }
}
