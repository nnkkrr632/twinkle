import { useRoute } from '#imports'
import { doc, getFirestore, serverTimestamp, writeBatch, getDoc } from 'firebase/firestore'
import { useTweetSelect } from '@/composables/tweetSelect'
import { useAuthByGoogleAccount } from '@/composables/auth'


export const useLike = () => {
    const { me } = useAuthByGoogleAccount()

    const storeLike = async (tweetDocId: string) => {
        if (!me.value) {
            alert('いいねをするにはログインが必要です。')
            return false
        }

        const { doesTweetExists } = useTweetSelect()
        const exists = await doesTweetExists(tweetDocId)
        if (!exists) {
            // アカウント削除時(= ルート: settings/delete)は表示しない
            const route = useRoute()
            if(!route.path.includes('settings'))
            alert('ツイートが存在しません。既に削除されている可能性があります。\n画面の更新をお試しください。')
            return false
        }

        const isLiked = await isAlreadyLiked(tweetDocId)
        if(isLiked) {
            alert('既にツイートをいいねしています。画面の再読込をお試しください。')
            return false
        }

        const db = getFirestore()
        const batch = writeBatch(db)

        try {
            // users/uid/myLikeTweetsSubCollection
            const myLikeTweetDocRef = doc(db, 'users', me.value.uid, 'myLikeTweetsSubCollection', tweetDocId)
            batch.set(myLikeTweetDocRef, {
                tweetDocId: tweetDocId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
            // tweets/xxx/likeUsersSubCollection/user.slug
            const likeUserDocRef = doc(db, 'tweets', tweetDocId, 'likeUsersSubCollection', me.value.slug)
            batch.set(likeUserDocRef, {
                userInfo: {
                    uid: me.value.uid,
                    slug: me.value.slug,
                    displayName: me.value.displayName,
                    description: me.value.description,
                    iconImageUrl: me.value.iconImageUrl,
                    type: me.value.type,
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })

            await batch.commit()
            return true
        } catch (error) {
            console.debug('useLike()のstoreLike()でエラー発生')
            console.error(error)
            alert('何かしらの理由によりいいねに失敗しました。')
            return false
        }
    }

    const destroyLike = async (tweetDocId: string) => {
        if (!me.value) {
            alert('いいねを取り消すにはログインが必要です。')
            return false
        }

        const { doesTweetExists } = useTweetSelect()
        const exists = await doesTweetExists(tweetDocId)
        if (!exists) {
            // アカウント削除時(= ルート: settings/delete)は表示しない
            const route = useRoute()
            if(!route.path.includes('settings'))
            alert('ツイートが存在しません。既に削除されている可能性があります。\n画面の更新をお試しください。')
            return false
        }

        const isLiked = await isAlreadyLiked(tweetDocId)
        if(!isLiked) {
            alert('既にいいねを取り消してる可能性があります。画面の再読込をお試しください。')
            return false
        }

        const db = getFirestore()
        const batch = writeBatch(db)

        try {
            // users/uid/myLikeTweetsSubCollection
            const myLikeTweetDocRef = doc(db, 'users', me.value.uid, 'myLikeTweetsSubCollection', tweetDocId)
            batch.delete(myLikeTweetDocRef)
            // tweets/xxx/likeUsersSubCollection/user.slug
            const likeUserDocRef = doc(db, 'tweets', tweetDocId, 'likeUsersSubCollection', me.value.slug)
            batch.delete(likeUserDocRef)

            await batch.commit()
            return true
        } catch (error) {
            console.debug('useLike()のdestroyLike()でエラー発生')
            console.error(error)
            alert('何かしらの理由によりいいねの取り消しに失敗しました。')
            return false
        }
    }

    // 既にいいね済みかのバリデーション
    const isAlreadyLiked = async (tweetDocId: string) => {
        if (!me.value) {
            alert('ログインしていないのでいいね済みか判定できません。')
            return false
        }
        // users/uid/myLikeTweetsSubCollection
        const myLikeTweetDocRef = doc(getFirestore(), 'users', me.value.uid, 'myLikeTweetsSubCollection', tweetDocId)
        const myLikeTweetSnapshot = await getDoc(myLikeTweetDocRef)
        return myLikeTweetSnapshot.exists()
    }

    return { storeLike, destroyLike }
}
