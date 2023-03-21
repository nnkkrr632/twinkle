// 明示しないとVSCodeに波線が引かれる

import { useRoute, useAsyncData, useNuxtApp } from '#imports'
import { getFirestore } from 'firebase/firestore'
import { collection, query, getDocs, DocumentReference, orderBy, limit, where } from 'firebase/firestore'
import { useTweetSelect } from '@/composables/tweetSelect'
import { useUserSelect } from '@/composables/userSelect'

import { Tweet } from '@/composables/types'

// ユーザープロフィール
export const useTweetsByUser = () => {
    console.log('useTweetsByUser()開始。')
    const db = getFirestore()

    const { getRetouchedTweets } = useTweetSelect()
    const { resolveUidFromUserSlug } = useUserSelect()

    const getTweetDocRefs = async (uid: string) => {
        console.log('selectByUser.tsのgetTweetDocRefs()開始')

        const myTweetsColRef = collection(db, 'users', uid, 'public', 'userPublicDocumentV1', 'myTweets')
        const tweetsQuery = query(myTweetsColRef, orderBy('createdAt', 'desc'), limit(30))
        try {
            const tweetsQuerySnapshot = await getDocs(tweetsQuery)
            const tweetDocRefs = tweetsQuerySnapshot.docs.map((tweetQueryDocSnapshot) => {
                return tweetQueryDocSnapshot.get('tweetPublicDocRef') as DocumentReference
            })

            return tweetDocRefs
        } catch (e) {
            console.log('selectByUser.tsのgetTweetDocRefs()でエラー発生。コンソールデバッグ↓')
            console.debug(e)
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
            const uid = await resolveUidFromUserSlug(userSlug)
            console.log('useAsyncDataでuidとれてる？↓')
            console.log(uid)
            // ツイートの参照を取得
            const tweetDocRefs = await getTweetDocRefs(uid)
            console.log('useAsyncDataでtweetDocRefsとれてる？↓')
            console.log(tweetDocRefs)

            if (!tweetDocRefs) {
                return
            }
            const retouchedTweets = await getRetouchedTweets(tweetDocRefs)
            console.log('useAsyncDataでretouchedTweetsとれてる？↓')
            console.log(retouchedTweets)
            return retouchedTweets as Tweet[]
        } catch (e) {
            console.log('■■プロフィール詳細でUserごとのツイートを集めるuseAsyncDataでエラー発生。コンソールデバッグ↓')
            console.debug(e)
        }
    })

    // myTweetsコレクションから直接とるやり方
    // const getUserTweets = async (userSlug: string) => {

    //     const tweetColRef = collection(db, 'users', userSlug, 'public', 'userPublicDocumentV1', 'myTweets')
    //     const tweetsQuery = query(tweetColRef, orderBy('createdAt', 'desc'), limit(30))
    //     try {
    //         const tweetsQuerySnapshot = await getDocs(tweetsQuery)
    //         const tweets = tweetsQuerySnapshot.docs.map((tweetQueryDocSnapshot) => {
    //             const data = tweetQueryDocSnapshot.data()
    //             console.log('dataとれてる？↓')
    //             console.log(data)
    //             return data
    //         })
    //         return tweets
    //     } catch (e) {
    //         console.log('■■getUserTweetsでエラー発生。コンソールデバッグ↓')
    //         console.debug(e)
    //     }
    // }

    return { tweets, errorAtUseTweetsByUser, resolveUidFromUserSlug }
}
