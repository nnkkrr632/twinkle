import { useAuthByGoogleAccount } from '@/composables/auth'
import { useTweetDelete } from '@/composables/tweetDelete'
import { Tweet } from '@/composables/types'
import { getFirestore, writeBatch, collection, serverTimestamp, doc } from 'firebase/firestore'

export const useRetweet = () => {
    console.log('■■useRetweet開始。')

    // リツイートはツイート作成と似ている。type=retweetでツイートを作成し、オリジナルツイートのDocRefを入力。
    const storeRetweet = async (originalTweetDocId: string) => {
        console.log('retweet開始')
        const { me } = useAuthByGoogleAccount()
        if (!me.value) {
            alert('ログインしていないのでリツイートをすることができません')
            return
        }

        const db = getFirestore()
        const batch = writeBatch(db)
        try {
            // ツイート作成(type:retweet) tweets/xxx
            const tweetsColRef = collection(db, 'tweets')
            const tweetDocId = doc(tweetsColRef).id
            console.log('tweetDocId：' + tweetDocId)
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
                    slug: me.value.slug,
                    displayName: me.value.displayName,
                    description: me.value.description,
                    iconImageUrl: me.value.iconImageUrl,
                    userType: me.value.userType,
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
            console.debug('storeRetweetでエラー発生')
            console.debug(error)
        }
    }

    const destroyRetweet = async (tweetDocId: string, originalTweetDocId: string) => {
        console.log('destroyRetweet開始')
        const { me } = useAuthByGoogleAccount()
        if (!me.value) {
            alert('ログインしていないのでリツイートを取り消すことができません')
            return
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
        } catch (error) {
            console.debug('destroyRetweetでエラー発生')
            console.debug(error)
        }
    }

    return { storeRetweet, destroyRetweet }
}
