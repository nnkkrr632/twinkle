import { useAsyncData } from '#imports'
import { getFirestore, Timestamp, collection, query, getDocs, orderBy, limit, where } from 'firebase/firestore'
import { useTweetSelect } from '@/composables/tweetSelect'

export const useTweetsByAll = () => {
    const getTweetDocIds = async (oldestCreatedAt: Timestamp | null = null) => {
        const tweetsCollection = collection(getFirestore(), 'tweets')
        console.log('tweetsCollection↓')
        console.log(tweetsCollection)
        let tweetsQuery = query(tweetsCollection, orderBy('createdAt', 'desc'), limit(5))
        if (oldestCreatedAt) {
            tweetsQuery = query(
                tweetsCollection,
                where('createdAt', '<', oldestCreatedAt),
                orderBy('createdAt', 'desc'),
                limit(5)
            )
        }
        try {
            const tweetsQuerySnapshot = await getDocs(tweetsQuery)
            console.log('tweetsQuerySnapshot↓')
            console.log(tweetsQuerySnapshot)
            if (tweetsQuerySnapshot.empty) {
                return null
            }
            const tweetDocIds = tweetsQuerySnapshot.docs.map((tweetQueryDocSnapshot) => {
                return tweetQueryDocSnapshot.id
            })
            return tweetDocIds
        } catch (error) {
            console.log('useTweetsByAllのgetTweetDocIds()でエラー発生。コンソールデバッグ↓')
            console.debug(error)
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
            console.log('useAsyncDataでretouchedTweetsとれてる？↓')
            console.log(retouchedTweets)
            return retouchedTweets
        } catch (error) {
            console.log('ホームのuseAsyncDataでエラー発生。コンソールデバッグ↓')
            console.debug(error)
        }
    })

    const addOldTweets = async () => {
        console.log('■■addOldTweets開始')

        try {
            if (tweets.value?.length === 0) {
                return []
            }

            const currentOldestCreatedAt = tweets.value?.[tweets.value.length - 1].createdAt ?? null
            console.log('■■最遅時間とれてる？↓')
            console.log(currentOldestCreatedAt)
            const tweetDocIds = await getTweetDocIds(currentOldestCreatedAt)
            console.log('まだtweetDocIdsある？↓')
            console.log(tweetDocIds)
            if (!tweetDocIds) {
                return
            }
            const { getRetouchedTweets } = useTweetSelect()
            const retouchedTweets = await getRetouchedTweets(tweetDocIds)
            if (tweets.value?.length && retouchedTweets) {
                tweets.value = [...tweets.value, ...retouchedTweets]
            }
        } catch (error) {
            console.log('ホームのaddOldTweetsでエラー発生。コンソールデバッグ↓')
            console.debug(error)
        }
    }

    return { tweets, errorAtUseTweetsByUser, addOldTweets }
}
