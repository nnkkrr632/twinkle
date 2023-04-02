import { computed, reactive } from '#imports'
import { collection, doc, getFirestore, serverTimestamp, writeBatch, increment } from 'firebase/firestore'
import type { Tweet } from '@/composables/types'
import { useAuthByGoogleAccount } from '@/composables/auth'

export const useLike = () => {
    console.log('■■useLikes()開始。')
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
            // users/uid/public/userPublicDocumentV1/myLikeTweetsSubCollection
            const myLikeTweetDocRef = doc(
                db,
                'users',
                me.value.uid,
                'public',
                'userPublicDocumentV1',
                'myLikeTweetsSubCollection',
                tweetDocId
            )
            const tweetPublicDocRef = doc(db, 'tweets', tweetDocId, 'public', 'tweetPublicDocumentV1')
            batch.set(myLikeTweetDocRef, {
                tweetPublicDocRef: tweetPublicDocRef,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
            // tweets/xxx/public/tweetPublicDocumentV1/likeUsersSubCollection/user.slug
            const likeUserDocRef = doc(
                db,
                'tweets',
                tweetDocId,
                'public',
                'tweetPublicDocumentV1',
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
            // users/uid/public/userPublicDocumentV1/myLikeTweetsSubCollection
            const myLikeTweetDocRef = doc(
                db,
                'users',
                me.value.uid,
                'public',
                'userPublicDocumentV1',
                'myLikeTweetsSubCollection',
                tweetDocId
            )
            batch.delete(myLikeTweetDocRef)
            // tweets/xxx/public/tweetPublicDocumentV1/likeUsersSubCollection/user.slug
            const likeUserDocRef = doc(
                db,
                'tweets',
                tweetDocId,
                'public',
                'tweetPublicDocumentV1',
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
