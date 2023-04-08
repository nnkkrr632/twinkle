import { doc, getFirestore, serverTimestamp, writeBatch } from 'firebase/firestore'
import { useAuthByGoogleAccount } from '@/composables/auth'

export const useLike = () => {
    const { me } = useAuthByGoogleAccount()
    
    const storeLike = async (tweetDocId: string) => {
        console.log('storeLike開始')
        if (!me.value) {
            alert('ログインしていないのでいいねをすることができません')
            return
        }
        const db = getFirestore()
        const batch = writeBatch(db)

        try {
            // users/uid/myLikeTweetsSubCollection
            const myLikeTweetDocRef = doc(
                db,
                'users',
                me.value.uid,
                'myLikeTweetsSubCollection',
                tweetDocId
            )
            const tweetDocRef = doc(db, 'tweets', tweetDocId)
            batch.set(myLikeTweetDocRef, {
                tweetDocRef: tweetDocRef,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
            // tweets/xxx/likeUsersSubCollection/user.slug
            const likeUserDocRef = doc(
                db,
                'tweets',
                tweetDocId,
                'likeUsersSubCollection',
                me.value.slug
            )
            batch.set(likeUserDocRef, {
                userInfo: {
                    slug: me.value.slug,
                    displayName: me.value.displayName,
                    description: me.value.description,
                    iconImageUrl: me.value.iconImageUrl,
                    userType: me.value.userType,
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })

            await batch.commit()
        } catch (error) {
            console.debug('storeLike()でエラー発生')
            console.debug(error)
        }
    }

    const destroyLike = async (tweetDocId: string) => {
        console.log('destroyLike開始')
        if (!me.value) {
            alert('ログインしていないのでいいねを取り消すことができません')
            return
        }
        const db = getFirestore()
        const batch = writeBatch(db)

        try {
            // users/uid/myLikeTweetsSubCollection
            const myLikeTweetDocRef = doc(
                db,
                'users',
                me.value.uid,
                'myLikeTweetsSubCollection',
                tweetDocId
            )
            batch.delete(myLikeTweetDocRef)
            // tweets/xxx/likeUsersSubCollection/user.slug
            const likeUserDocRef = doc(
                db,
                'tweets',
                tweetDocId,
                'likeUsersSubCollection',
                me.value.slug
            )
            batch.delete(likeUserDocRef)

            await batch.commit()
        } catch (error) {
            console.debug('destroyLike()でエラー発生')
            console.debug(error)
        }
    }

    return { storeLike, destroyLike }
}
