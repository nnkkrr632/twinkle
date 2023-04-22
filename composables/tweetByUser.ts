// 明示しないとVSCodeに波線が引かれる

import { useRoute, useAsyncData, computed } from '#imports'
import {
    getFirestore,
    Timestamp,
    collection,
    query,
    getDocs,
    orderBy,
    limit,
    where,
} from 'firebase/firestore'
import { useTweetSelect } from '@/composables/tweetSelect'
import { useUserSelect } from '@/composables/userSelect'

// ユーザープロフィール
export const useTweetsByUser = () => {
    // MySubCollectionから本人のツイート一覧 or いいねしたツイート一覧を取得
    const getTweetDocIds = async (uid: string, oldestCreatedAt: Timestamp | null = null) => {
        // URL(= route)で取得先のコレクションを判断
        const route = useRoute()
        const targetSubCollection = route.name === 'userSlug-likes' ? 'myLikeTweetsSubCollection' : 'myTweetsSubCollection'
        const colRef = collection(getFirestore(), 'users', uid, targetSubCollection)

        let tweetsQuery = query(colRef, orderBy('createdAt', 'desc'), limit(10))
        if (oldestCreatedAt) {
            tweetsQuery = query(
                colRef,
                where('createdAt', '<', oldestCreatedAt),
                orderBy('createdAt', 'desc'),
                limit(10)
            )
        }
        try {
            const tweetsQuerySnapshot = await getDocs(tweetsQuery)
            if (tweetsQuerySnapshot.empty) {
                return null
            }
            const tweetDocIds = tweetsQuerySnapshot.docs.map((tweetQueryDocSnapshot) => {
                return tweetQueryDocSnapshot.get('tweetDocId') as string
            })
            return tweetDocIds
        } catch (error) {
            console.debug('useTweetsByUser()のgetTweetDocIds()でエラー発生')
            console.error(error)
        }
    }

    // これが本体
    const { data: tweets, error: errorAtUseTweetsByUser } = useAsyncData(async () => {
        const route = useRoute()
        const userSlug = route.params.userSlug
        if (typeof userSlug !== 'string') {
            return
        }

        try {
            const { resolveUidFromUserSlug } = useUserSelect()
            const uid = await resolveUidFromUserSlug(userSlug)
            if (!uid) {
                return []
            }

            const tweetDocIds = await getTweetDocIds(uid)
            if (!tweetDocIds) {
                return []
            }

            const { getRetouchedTweets } = useTweetSelect()
            const retouchedTweets = await getRetouchedTweets(tweetDocIds)
            return retouchedTweets
        } catch (error) {
            console.debug('useTweetsByUser()のtweetsのuseAsyncData()でエラー発生')
            console.error(error)
        }
    })

    const allImageUrls = computed(() => {
        return tweets.value?.flatMap((tweet) => tweet.imageUrls) ?? []
    })

    const addOldTweets = async () => {
        const route = useRoute()
        const userSlug = route.params.userSlug
        if (typeof userSlug !== 'string') {
            return
        }

        try {
            const { resolveUidFromUserSlug } = useUserSelect()
            const uid = await resolveUidFromUserSlug(userSlug)
            if (!uid) {
                return
            }
            // addする以前にツイートがそもそも0件
            if (tweets.value?.length === 0) { return }

            // ツイートの参照を取得
            const currentOldestCreatedAt = tweets.value?.[tweets.value.length - 1].createdAt ?? null
            const tweetDocIds = await getTweetDocIds(uid, currentOldestCreatedAt)
            if (!tweetDocIds) {
                return
            }
            const { getRetouchedTweets } = useTweetSelect()
            const retouchedTweets = await getRetouchedTweets(tweetDocIds)
            if (tweets.value?.length && retouchedTweets) {
                tweets.value = [...tweets.value, ...retouchedTweets]
            }
        } catch (error) {
            console.debug('useTweetsByUser()のaddOldTweets()でエラー発生')
            console.error(error)
        }
    }

    return { tweets, errorAtUseTweetsByUser, allImageUrls, addOldTweets, getTweetDocIds }
}
