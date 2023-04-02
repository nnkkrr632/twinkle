import { onMounted } from '#imports'
import { getDoc, DocumentReference, DocumentData, collection, getFirestore, getDocs, query, orderBy } from 'firebase/firestore'
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
            const retouchedTweets = await retouchTweets(tweets)
            console.log('レタッチドツイートs↓')
            console.log(retouchedTweets)
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
                // tweets/xxx/public/tweetPublicDocumentV1ドキュメントから取得。配下のサブコレクションはretouchTweetに任せる
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

    const retouchTweets = async (tweets: FirestoreTweet[]) => {
        // console.log('TweetSelect()のretouchTweets開始。複数形！')

        const retouchedTweets: Tweet[] = []
        for (const tweet of tweets) {
            const retouchedTweet = await retouchTweet(tweet)
            retouchedTweets.push(retouchedTweet)
        }
        return retouchedTweets
    }

    // サブコレクションからいいねやリツイートの情報を取得
    // + 表示用にデータ成形
    const retouchTweet = async (tweet: FirestoreTweet) => {
        console.log('retouchTweet開始。')
        tweet.formattedCreatedAt = getReadableDate(tweet.createdAt.toDate())

        // tweet.likeUserSlugsを生成
        const likeUsersColRef = collection(getFirestore(), 'tweets', tweet.tweetDocId, 'public', 'tweetPublicDocumentV1', 'likeUsersSubCollection')
        const likeUsersQuery = query(likeUsersColRef, orderBy('createdAt', 'desc'))
        const likeUsersQuerySnapshot= await getDocs(likeUsersQuery)
        tweet.likeUserSlugs = likeUsersQuerySnapshot.docs.map((likeUserQueryDocSnapshot) => {
            console.log('ここはretouchTweet()で各ツイートをいいねしている人を取得しているところ。userSlug↓')
            console.log(likeUserQueryDocSnapshot.id)
            return likeUserQueryDocSnapshot.id
        })
        // tweet.retweetUserSlugsを生成
        const retweetUsersColRef = collection(getFirestore(), 'tweets', tweet.tweetDocId, 'public', 'tweetPublicDocumentV1', 'retweetUsersSubCollection')
        const retweetUsersQuery = query(retweetUsersColRef, orderBy('createdAt', 'desc'))
        const retweetUsersQuerySnapshot= await getDocs(retweetUsersQuery)
        tweet.retweetUserSlugs = retweetUsersQuerySnapshot.docs.map((retweetUserQueryDocSnapshot) => {
            console.log('ここはretouchTweet()で各ツイートをいいねしている人を取得しているところ。userSlug↓')
            console.log(retweetUserQueryDocSnapshot.id)
            return retweetUserQueryDocSnapshot.id
        })
        // ツイートがリツイートの場合、オリジナルツイートを取得
        if(tweet.tweetType === 'retweet') {
            console.log('リツイート用にオリジナルツイート取得')
            if(tweet.originalTweetPublicDocRef) {
                const originalTweets = await getRetouchedTweets([tweet.originalTweetPublicDocRef])
                // ↓これがないと500エラー
                // Maximum call stack size exceeded
                // Cannot stringify arbitrary non-POJOs DocumentReference
                delete tweet.originalTweetPublicDocRef
    
                console.log('■■originalTweets↓')
                console.log(originalTweets)
                if(originalTweets) {
                    tweet.originalTweet = originalTweets[0]
                }
                console.log('オリジナルツイートが埋め込まれたtweet↓')
                console.log(tweet)
                console.log('tweet.originalTweet↓')
                console.log(tweet.originalTweet)
                console.log('tweet.originalTweet.userInfo↓')
                console.log(tweet.originalTweet.userInfo)
            }
        }
        

        console.log('■■retouchTweetがリターンするtweet↓')
        console.log(tweet)
        return tweet as Tweet
    }

    return { getRetouchedTweets }
}
