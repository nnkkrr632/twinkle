// 明示しないとVSCodeに波線が引かれる

import { useRoute, useAsyncData, computed, useState } from '#imports'
import { getFirestore, Timestamp, collection, query, getDocs, DocumentReference, orderBy, limit, where } from 'firebase/firestore'
import { useTweetSelect } from '@/composables/tweetSelect'
import { useUserSelect } from '@/composables/userSelect'

// ユーザープロフィール
export const useTweetsByUser = () => {
    console.log('useTweetsByUser()開始。')

    const getTweetDocRefs = async (uid: string, oldestCreatedAt: Timestamp|null = null) => {
        console.log('selectByUser.tsのgetTweetDocRefs()開始')

        const myTweetsColRef = collection(getFirestore(), 'users', uid, 'myTweetsSubCollection')
        let tweetsQuery = query(myTweetsColRef, orderBy('createdAt', 'desc'), limit(5))
        if(oldestCreatedAt) {
            tweetsQuery = query(myTweetsColRef, where('createdAt', '<', oldestCreatedAt), orderBy('createdAt', 'desc'), limit(5))
        }
        try {
            const tweetsQuerySnapshot = await getDocs(tweetsQuery)
            if(tweetsQuerySnapshot.empty) {
                console.log('ドキュメントない分岐入ってる！！')
                return null
            }
            const tweetDocRefs = tweetsQuerySnapshot.docs.map((tweetQueryDocSnapshot) => {
                return tweetQueryDocSnapshot.get('tweetDocRef') as DocumentReference
            })
            return tweetDocRefs
        } catch (error) {
            console.log('selectByUser.tsのgetTweetDocRefs()でエラー発生。コンソールデバッグ↓')
            console.debug(error)
        }
    }

    // これが本体
    const { data: tweets, error: errorAtUseTweetsByUser } = useAsyncData(async () => {
        console.log('■■useTweetsByUser()のuseAsyncData()開始。')

        const route = useRoute()
        const userSlug = route.params.userSlug
        if (typeof userSlug !== 'string') { return }

        try {
            const { resolveUidFromUserSlug } = useUserSelect()
            const uid = await resolveUidFromUserSlug(userSlug)
            if(!uid) {
                console.log('uidが見つかりません')
                return []
            }

            // ツイートの参照を取得
            const tweetDocRefs = await getTweetDocRefs(uid)
            console.log('useAsyncDataでtweetDocRefsとれてる？↓')
            console.log(tweetDocRefs)
            
            if (!tweetDocRefs) {
                return
            }
            const { getRetouchedTweets } = useTweetSelect()
            const retouchedTweets = await getRetouchedTweets(tweetDocRefs)
            console.log('useAsyncDataでretouchedTweetsとれてる？↓')
            console.log(retouchedTweets)
            return retouchedTweets
        } catch (error) {
            console.log('■■プロフィール詳細でUserごとのツイートを集めるuseAsyncDataでエラー発生。コンソールデバッグ↓')
            console.debug(error)
        }
    })

    const allImageUrls = computed( () => {
        console.log('ここはuseTweetsByUser()直下。allImageUrlsのcomputed発火！')
        return tweets.value?.flatMap((tweet) => tweet.imageUrls) ?? []
    })

    const addOldTweets = async () => {
        console.log('■■addOldTweets開始')
        const route = useRoute()
        const userSlug = route.params.userSlug
        if (typeof userSlug !== 'string') { return }

        try {
            const { resolveUidFromUserSlug } = useUserSelect()
            const uid = await resolveUidFromUserSlug(userSlug)
            if(!uid) {
                console.log('uidが見つかりません')
                return []
            }
            
            // ツイートの参照を取得
            const currentOldestCreatedAt = tweets.value?.[tweets.value.length - 1].createdAt ?? null
            console.log('■■最遅時間とれてる？↓')
            console.log(currentOldestCreatedAt)
            const tweetDocRefs = await getTweetDocRefs(uid, currentOldestCreatedAt)
            console.log('まだtweetDocRefsある？↓')
            console.log(tweetDocRefs)
            if (!tweetDocRefs) { return }
            const { getRetouchedTweets } = useTweetSelect()
            const retouchedTweets = await getRetouchedTweets(tweetDocRefs)
            if(tweets.value?.length && retouchedTweets) {
                tweets.value = [...tweets.value, ...retouchedTweets]
            }
        } catch (error) {
            console.log('■■プロフィール詳細でUserごとのツイートを集めるuseAsyncDataでエラー発生。コンソールデバッグ↓')
            console.debug(error)
        }
    }

    return { tweets, errorAtUseTweetsByUser, allImageUrls, addOldTweets }
}
