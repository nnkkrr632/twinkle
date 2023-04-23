import { useAsyncData } from '#imports'
import { getFirestore, Timestamp, collection, query, getDocs, orderBy, limit, where } from 'firebase/firestore'
import { useTweetSelect } from '@/composables/tweetSelect'

export const useTweetsByAll = () => {
    const getTweetDocIds = async (oldestCreatedAt: Timestamp | null = null) => {
        const tweetsCollection = collection(getFirestore(), 'tweets')
        let tweetsQuery = query(tweetsCollection, orderBy('createdAt', 'desc'), limit(15))
        if (oldestCreatedAt) {
            tweetsQuery = query(
                tweetsCollection,
                where('createdAt', '<', oldestCreatedAt),
                orderBy('createdAt', 'desc'),
                limit(15)
            )
        }
        try {
            const tweetsQuerySnapshot = await getDocs(tweetsQuery)
            if (tweetsQuerySnapshot.empty) {
                return null
            }
            const tweetDocIds = tweetsQuerySnapshot.docs.map((tweetQueryDocSnapshot) => {
                return tweetQueryDocSnapshot.id
            })
            return tweetDocIds
        } catch (error) {
            console.debug('useTweetsByAll()のgetTweetDocIds()でエラー発生')
            console.error(error)
        }
    }

    // これが本体
    const { data: tweets, error: errorAtUseTweetsByUser } = useAsyncData(async () => {
        try {
            const tweetDocIds = await getTweetDocIds()
            if (!tweetDocIds) {
                return
            }
            const { getRetouchedTweets } = useTweetSelect()
            const retouchedTweets = await getRetouchedTweets(tweetDocIds)
            return retouchedTweets
        } catch (error) {
            console.debug('useTweetsByAlluseAsyncDataでエラー発生。コンソールデバッグ↓')
            console.error(error)
        }
    })

    const addOldTweets = async () => {
        try {
            if (tweets.value?.length === 0) {
                return
            }

            const currentOldestCreatedAt = tweets.value?.[tweets.value.length - 1].createdAt ?? null
            const tweetDocIds = await getTweetDocIds(currentOldestCreatedAt)
            if (!tweetDocIds) {
                return
            }
            const { getRetouchedTweets } = useTweetSelect()
            const retouchedTweets = await getRetouchedTweets(tweetDocIds)
            if (tweets.value?.length && retouchedTweets) {
                tweets.value = [...tweets.value, ...retouchedTweets]
            }
        } catch (error) {
            console.debug('ホームのaddOldTweetsでエラー発生。コンソールデバッグ↓')
            console.error(error)
        }
    }

    return { tweets, errorAtUseTweetsByUser, addOldTweets }
}
