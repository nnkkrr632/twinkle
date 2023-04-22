import { doc, getFirestore, serverTimestamp, writeBatch } from 'firebase/firestore'
import { useTweetSelect } from '@/composables/tweetSelect'
import { useAuthByGoogleAccount } from '@/composables/auth'


export const useLike = () => {
    const { me } = useAuthByGoogleAccount()

    const storeLike = async (tweetDocId: string) => {
        console.log('storeLike開始')
        if (!me.value) {
            alert('ログインしていないのでいいねをすることができません')
            return false
        }

        const { doesTweetExists } = useTweetSelect()
        const exists = await doesTweetExists(tweetDocId)
        if(!exists) { 
            console.log('ツイートIDが存在しない分岐入った')
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
            console.debug('storeLike()でエラー発生')
            console.debug(error)
            return false
        }
    }

    const destroyLike = async (tweetDocId: string) => {
        console.log('destroyLike開始')
        if (!me.value) {
            alert('ログインしていないのでいいねを取り消すことができません')
            return false
        }

        const { doesTweetExists } = useTweetSelect()
        const exists = await doesTweetExists(tweetDocId)
        if(!exists) { 
            console.log('ツイートIDが存在しない分岐入った')
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
            console.debug('destroyLike()でエラー発生')
            console.debug(error)
            return false
        }
    }

    return { storeLike, destroyLike }
}
