import { doc, getFirestore, collection, getDocs, where, query, deleteDoc } from '@firebase/firestore'
import { useStorage } from '@/composables/storage'
import { useAuthByGoogleAccount } from '@/composables/auth'
import { useTweetDelete } from '@/composables/tweetDelete'
import { useLike } from '@/composables/tweetLike'
import { useRetweet } from '@/composables/retweet'

export const useAccountDelete = () => {
    const { me, deleteMe } = useAuthByGoogleAccount()
    const deleteAccount = async () => {
        if (!me.value) {
            alert('ログインしていないので退会できません。')
            return false
        }

        const db = getFirestore()
        const { deleteTweet } = useTweetDelete()
        const { destroyLike } = useLike()
        const { destroyRetweet } = useRetweet()
        const { deleteImage } = useStorage()

        try {
            const myTweetsColRef = collection(db, 'users', me.value.uid, 'myTweetsSubCollection')
            const myTweetsQuery = query(myTweetsColRef, where('type', '==', 'normal'))
            const myTweetsQuerySnapshot = await getDocs(myTweetsQuery)
            const tweetDocIds: string[] = []
            myTweetsQuerySnapshot.forEach((queryDocSnapshot) => {
                tweetDocIds.push(queryDocSnapshot.id)
            })
            for (const tweetDocId of tweetDocIds) {
                console.log('deleteTweetのforループ。delete対象のtweetDocId↓')
                console.log(tweetDocId)
                await deleteTweet(tweetDocId)
            }

            // リツイートを全削除
            const myRetweetsQuery = query(myTweetsColRef, where('type', '==', 'retweet'))
            const myRetweetsQuerySnapshot = await getDocs(myRetweetsQuery)
            const retweetInfos: { tweetDocId: string; originalTweetDocId: string }[] = []
            myRetweetsQuerySnapshot.forEach((queryDocSnapshot) => {
                retweetInfos.push({
                    tweetDocId: queryDocSnapshot.get('tweetDocId') as string,
                    originalTweetDocId: queryDocSnapshot.get('originalTweetDocId') as string,
                })
            })
            for (const retweetInfo of retweetInfos) {
                console.log('deleteTweetのforループ。delete対象のretweetInfo↓')
                console.log(retweetInfo)
                await destroyRetweet(retweetInfo.tweetDocId, retweetInfo.originalTweetDocId)
            }

            // いいねを全削除
            const myLikeTweetsColRef = collection(db, 'users', me.value.uid, 'myLikeTweetsSubCollection')
            const myLikeTweetsSnapshot = await getDocs(myLikeTweetsColRef)
            const likeTweetDocIds: string[] = []
            myLikeTweetsSnapshot.forEach((myLikeTweetQueryDocSnapshot) => {
                likeTweetDocIds.push(myLikeTweetQueryDocSnapshot.id)
            })
            for (const tweetDocId of likeTweetDocIds) {
                console.log('destroyLikeのforループ。対象のtweetDocId↓')
                console.log(tweetDocId)
                await destroyLike(tweetDocId)
            }

            // プロフィールの画像削除
            if (me.value.headerImageFullPath) {
                await deleteImage(me.value.headerImageFullPath)
            }
            if (me.value.iconImageFullPath) {
                await deleteImage(me.value.iconImageFullPath)
            }

            const myUserDocRef = doc(db, 'users', me.value.uid)
            await deleteDoc(myUserDocRef)

            //Firebase Authアカウントを削除
            await deleteMe()
            // 最後に全削除成功を知らせる return true
            return true
        } catch (error) {
            console.log('deleteAccountでエラー発生')
            console.debug(error)
            return false
        }
        // ツイートを全削除
    }

    return { deleteAccount }
}
