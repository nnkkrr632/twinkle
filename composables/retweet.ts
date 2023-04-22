import { useAuthByGoogleAccount } from '@/composables/auth'
import { useTweetSelect } from '@/composables/tweetSelect'
import { useTweetDelete } from '@/composables/tweetDelete'
import { getFirestore, writeBatch, collection, serverTimestamp, doc } from 'firebase/firestore'

export const useRetweet = () => {

    // リツイートはツイート作成と似ている。type=retweetでツイートを作成し、オリジナルツイートのDocRefを入力。
    const storeRetweet = async (originalTweetDocId: string) => {
        const { me } = useAuthByGoogleAccount()
        if (!me.value) {
            alert('ログインしていないのでリツイートをすることができません')
            return false
        }

        const { doesTweetExists } = useTweetSelect()
        const exists = await doesTweetExists(originalTweetDocId)
        if(!exists) { 
            return false
        }

        const db = getFirestore()
        const batch = writeBatch(db)
        try {
            // ツイート作成(type:retweet) tweets/xxx
            const tweetsColRef = collection(db, 'tweets')
            const tweetDocId = doc(tweetsColRef).id
            const tweetDocRef = doc(db, 'tweets', tweetDocId)
            batch.set(tweetDocRef, {
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                tweetDocId: tweetDocId,
                body: '',
                imageFullPaths: [],
                imageUrls: [],
                type: 'retweet',
                userInfo: {
                    uid: me.value.uid,
                    slug: me.value.slug,
                    displayName: me.value.displayName,
                    description: me.value.description,
                    iconImageUrl: me.value.iconImageUrl,
                    type: me.value.type,
                },
                originalTweetDocId: originalTweetDocId,
            })

            // users/uid/myTweetsSubCollection
            const myTweetDocRef = doc(db, 'users', me.value.uid, 'myTweetsSubCollection', tweetDocId)
            batch.set(myTweetDocRef, {
                tweetDocId: tweetDocId,
                originalTweetDocId: originalTweetDocId,
                type: 'retweet',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })

            // オリジナルツイートのリツイートしたユーザーサブコレクションにuser.slugを追加
            // tweets/yyy/retweetUsersSubCollection
            const retweetUserDocRef = doc(db, 'tweets', originalTweetDocId, 'retweetUsersSubCollection', me.value.slug)
            batch.set(retweetUserDocRef, {
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
            console.debug('useRetweet()のstoreRetweet()でエラー発生')
            console.error(error)
            return false
        }
    }

    const destroyRetweet = async (tweetDocId: string, originalTweetDocId: string) => {
        const { me } = useAuthByGoogleAccount()
        if (!me.value) {
            alert('ログインしていないのでリツイートを取り消すことができません')
            return false
        }

        const { doesTweetExists } = useTweetSelect()
        const exists = await doesTweetExists(originalTweetDocId)
        if(!exists) { 
            return false
        }

        // リツイート取り消しはツイート削除のようなものなので流用できる
        // ただし、tweets/retweetUsersSubCollectionとlikeUsersSubCollectionは残る
        const { deleteTweet } = useTweetDelete()
        await deleteTweet(tweetDocId)

        const db = getFirestore()
        const batch = writeBatch(db)
        try {
            // tweets/yyy/retweetUsersSubCollection/user.slug
            const retweetUserDocRef = doc(db, 'tweets', originalTweetDocId, 'retweetUsersSubCollection', me.value.slug)
            batch.delete(retweetUserDocRef)

            await batch.commit()
            return true
        } catch (error) {
            console.debug('useRetweet()のdestroyRetweet()でエラー発生')
            console.error(error)
            return false
        }
    }

    return { storeRetweet, destroyRetweet }
}
