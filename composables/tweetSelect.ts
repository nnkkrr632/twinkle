import { getDoc, getFirestore, doc, collection, getDocs, query, orderBy } from 'firebase/firestore'
import { getReadableDate } from '~/utils/helpers'
import type { FirestoreTweet, Tweet, Retweet } from './types'

// ツイート取得
export const useTweetSelect = () => {

    // ツイートが存在するか確認するバリデーション用メソッド
    const doesTweetExists = async (tweetDocId: string) => {
        const docRef = doc(getFirestore(), 'tweets', tweetDocId)
        const docSnapshot = await getDoc(docRef)
        return docSnapshot.exists()
    }

    const getRetouchedTweets = async (tweetDocIds: string[]) => {
        console.log('★★getRetouchedTweets。引数のtweetDocIds↓')
        console.log(tweetDocIds)
        try {
            const tweets = await getTweets(tweetDocIds)
            if (!tweets) {
                return
            }
            const retouchedTweets = await retouchTweets(tweets)
            return retouchedTweets
        } catch (error) {
            console.error('■■TweetSelectのgetRetouchedTweets()でエラー発生。コンソールでバッグ↓')
            console.debug(error)
        }
    }

    // 以下プライベートメソッド

    // firestore生のtweetsデータを取得
    const getTweets = async (tweetDocIds: string[]) => {
        const db = getFirestore()
        const tweets: FirestoreTweet[] = []
        try {
            for (const tweetDocId of tweetDocIds) {
                // tweets/xxxドキュメントから取得。配下のサブコレクションはretouchTweetに任せる
                const tweetDocSnapshot = await getDoc(doc(db, 'tweets', tweetDocId))
                // DocumentData|undefined をプロパティ指定するため型付け
                const tweet = tweetDocSnapshot.data() as FirestoreTweet | undefined
                if (!tweet) {
                    continue
                }
                tweets.push(tweet)
            }
            return tweets
        } catch (error) {
            console.log('■■TweetSelectのgetTweets()でエラー発生。コンソールデバッグ↓')
            console.debug(error)
        }
    }

    const retouchTweets = async (tweets: FirestoreTweet[]) => {
        const retouchedTweets: (Tweet | Retweet)[] = []
        for (const tweet of tweets) {
            const retouchedTweet = await retouchTweet(tweet)
            if (retouchedTweet) {
                retouchedTweets.push(retouchedTweet)
            }
        }
        return retouchedTweets
    }

    // サブコレクションからいいねやリツイートの情報を取得
    // + 表示用にデータ成形
    const retouchTweet = async (tweet: FirestoreTweet): Promise<Tweet | Retweet | null> => {
        console.log('retouchTweet開始。')
        tweet.formattedCreatedAt = getReadableDate(tweet.createdAt.toDate())

        // tweet.likeUserSlugsを生成
        const likeUsersColRef = collection(getFirestore(), 'tweets', tweet.tweetDocId, 'likeUsersSubCollection')
        const likeUsersQuery = query(likeUsersColRef, orderBy('createdAt', 'desc'))
        const likeUsersQuerySnapshot = await getDocs(likeUsersQuery)
        tweet.likeUserSlugs = likeUsersQuerySnapshot.docs.map((likeUserQueryDocSnapshot) => {
            console.log('ここはretouchTweet()で各ツイートをいいねしている人を取得しているところ。userSlug↓')
            console.log(likeUserQueryDocSnapshot.id)
            return likeUserQueryDocSnapshot.id
        })
        // tweet.retweetUserSlugsを生成
        const retweetUsersColRef = collection(getFirestore(), 'tweets', tweet.tweetDocId, 'retweetUsersSubCollection')
        const retweetUsersQuery = query(retweetUsersColRef, orderBy('createdAt', 'desc'))
        const retweetUsersQuerySnapshot = await getDocs(retweetUsersQuery)
        tweet.retweetUserSlugs = retweetUsersQuerySnapshot.docs.map((retweetUserQueryDocSnapshot) => {
            console.log('ここはretouchTweet()で各ツイートをいいねしている人を取得しているところ。userSlug↓')
            console.log(retweetUserQueryDocSnapshot.id)
            return retweetUserQueryDocSnapshot.id
        })

        if (tweet.type === 'normal') {
            return tweet as Tweet
        }
        // ツイートがリツイートの場合、オリジナルツイートを取得
        console.log('ここに残っているということはリツイート。tweet.type === retweet。')
        if (tweet.originalTweetDocId) {
            const originalTweets = await getRetouchedTweets([tweet.originalTweetDocId])
            console.log('■■originalTweets↓')
            console.log(originalTweets)
            if (originalTweets === undefined || originalTweets.length === 0) {
                // リツイート元が削除された場合
                console.log('リツイート元のオリジナルツイートが存在しない分岐入った')
                return null
            }
            tweet.originalTweet = originalTweets[0]
            console.log(
                'ここまで来てるのは、originalTweetが存在する。つまり元ツイートが削除されていないということ。tweet↓'
            )
            console.log(tweet)
            return tweet as Retweet
        }
        return null
    }

    return { getRetouchedTweets, doesTweetExists }
}
