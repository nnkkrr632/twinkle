import { getDoc, DocumentReference, DocumentData } from 'firebase/firestore'
import { getReadableDate } from '~/utils/myLibrary'

// ツイート取得
export const useTweetSelect = () => {

    const getRetouchedTweets = async (tweetDocRefs: DocumentReference[]) => {
        try {
            const tweets = await getTweets(tweetDocRefs)
            if (!tweets) {
                return
            }
            const retouchedTweets = await retouchTweets(tweets)
            return retouchedTweets
        } catch (e) {
            console.error('■■TweetSelectのgetRetouchedTweets()でエラー発生。コンソールでバッグ↓')
            console.debug(e)
        }
    }

    // 以下プライベートメソッド

    // tweetsコレクションのDocref[]をforEachで全取得
    const getTweets = async (tweetDocRefs: DocumentReference[]) => {
        // console.log('getTweets()開始')
        const tweets: DocumentData[] = []
        try {
            for (const tweetDocRef of tweetDocRefs) {
                const tweetDocSnapshot = await getDoc(tweetDocRef)
                const tweet = tweetDocSnapshot.data()
                if (!tweet) {
                    continue
                }
                tweets.push(tweet)
            }
            // console.log('取得したレタッチ前tweets↓')
            // console.log(tweets)
            return tweets
        } catch (e) {
            console.log('■■TweetSelectのgetTweets()でエラー発生。コンソールデバッグ↓')
            console.debug(e)
        }
    }

    const retouchTweets = async (tweets: DocumentData[]) => {
        // console.log('TweetSelect()のretouchTweets開始。複数形！')

        const retouchedTweets: DocumentData[] = []
        for (const tweet of tweets) {
            const retouchedTweet = await retouchTweet(tweet)
            if (!retouchedTweet) {
                continue
            }
            retouchedTweets.push(retouchedTweet)
        }
        return retouchedTweets
    }

    // 表示用に加工
    const retouchTweet = async (tweet: DocumentData) => {
        // console.log('select.tsのretouchTweet開始')
        // 日付の変換
        tweet.formattedCreatedAt = getReadableDate(tweet.createdAt.toDate())
        return tweet
    }

    return { getRetouchedTweets }
}
