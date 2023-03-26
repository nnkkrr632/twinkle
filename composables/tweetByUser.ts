// 明示しないとVSCodeに波線が引かれる

import { useRoute, useAsyncData, useNuxtApp, computed } from '#imports'
import { getFirestore } from 'firebase/firestore'
import { collection, query, getDocs, DocumentReference, orderBy, limit, where } from 'firebase/firestore'
import { useTweetSelect } from '@/composables/tweetSelect'
import { useUserSelect } from '@/composables/userSelect'

// ユーザープロフィール
export const useTweetsByUser = () => {
    console.log('useTweetsByUser()開始。')

    const getTweetDocRefs = async (uid: string) => {
        console.log('selectByUser.tsのgetTweetDocRefs()開始')

        const myTweetsColRef = collection(getFirestore(), 'users', uid, 'public', 'userPublicDocumentV1', 'myTweets')
        const tweetsQuery = query(myTweetsColRef, orderBy('createdAt', 'desc'), limit(30))
        try {
            const tweetsQuerySnapshot = await getDocs(tweetsQuery)
            const tweetDocRefs = tweetsQuerySnapshot.docs.map((tweetQueryDocSnapshot) => {
                return tweetQueryDocSnapshot.get('tweetPublicDocRef') as DocumentReference
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
        if (typeof userSlug !== 'string') {
            return
        }

        try {
            const { resolveUidFromUserSlug } = useUserSelect()
            const uid = await resolveUidFromUserSlug(userSlug)
            if(!uid) {
                console.log('uidが見つかりません')
                return []
            }
            console.log('useAsyncDataでuidとれてる？↓')
            console.log(uid)
            // ツイートの参照を取得
            const tweetDocRefs = await getTweetDocRefs(uid)
            // console.log('useAsyncDataでtweetDocRefsとれてる？↓')
            // console.log(tweetDocRefs)
            
            if (!tweetDocRefs) {
                return
            }
            const { getRetouchedTweets } = useTweetSelect()
            const retouchedTweets = await getRetouchedTweets(tweetDocRefs)
            // console.log('useAsyncDataでretouchedTweetsとれてる？↓')
            // console.log(retouchedTweets)
            return retouchedTweets
        } catch (error) {
            console.log('■■プロフィール詳細でUserごとのツイートを集めるuseAsyncDataでエラー発生。コンソールデバッグ↓')
            console.debug(error)
        }
    })

    const allImageUrls = computed( () => {
        console.log('ここはuseTweetsByUser()直下。allImageUrlsのcomputed発火！')
        return tweets.value?.flatMap((tweet) => tweet.imageUrls) ?? [] })
    console.log('ここはuseTweetsByUser()直下。allImageUrls.value↓')
    console.log(allImageUrls.value)

    return { tweets, errorAtUseTweetsByUser, allImageUrls }
}
