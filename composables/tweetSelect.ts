import { onMounted } from '#imports'
import { getDoc, DocumentReference, DocumentData } from 'firebase/firestore'
import { getReadableDate } from '~/utils/myLibrary'
import { useAuthByGoogleAccount } from '@/composables/auth'
import type { FirestoreTweet, Tweet } from './types'

// ツイート取得
export const useTweetSelect = () => {    
    const getRetouchedTweets = async (tweetDocRefs: DocumentReference[]) => {
        try {
            const tweets = await getTweets(tweetDocRefs)
            if (!tweets) {
                return
            }
            const retouchedTweets = retouchTweets(tweets)
            return retouchedTweets
        } catch (error) {
            console.error('■■TweetSelectのgetRetouchedTweets()でエラー発生。コンソールでバッグ↓')
            console.debug(error)
        }
    }

    // 以下プライベートメソッド

    // tweetsコレクションのDocref[]をforEachで全取得
    const getTweets = async (tweetDocRefs: DocumentReference[]) => {
        // console.log('getTweets()開始')
        const tweets: FirestoreTweet[] = []
        try {
            for (const tweetDocRef of tweetDocRefs) {
                const tweetDocSnapshot = await getDoc(tweetDocRef)
                // DocumentData|undefined をプロパティ指定するため型付け
                const tweet = tweetDocSnapshot.data() as FirestoreTweet | undefined
                if (!tweet) {
                    continue
                }
                tweets.push(tweet)
            }
            // console.log('取得したレタッチ前tweets↓')
            // console.log(tweets)
            return tweets
        } catch (error) {
            console.log('■■TweetSelectのgetTweets()でエラー発生。コンソールデバッグ↓')
            console.debug(error)
        }
    }

    const retouchTweets = (tweets: FirestoreTweet[]) => {
        // console.log('TweetSelect()のretouchTweets開始。複数形！')

        const retouchedTweets: Tweet[] = []
        for (const tweet of tweets) {
            const retouchedTweet = retouchTweet(tweet)
            retouchedTweets.push(retouchedTweet)
        }
        return retouchedTweets
    }

    // 表示用に加工
    const retouchTweet = (tweet: FirestoreTweet) => {
        tweet.formattedCreatedAt = getReadableDate(tweet.createdAt.toDate())
        return tweet as Tweet
    }

    return { getRetouchedTweets }
}
