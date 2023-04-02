import { useAuthByGoogleAccount } from '@/composables/auth'
import { useTweetDelete } from '@/composables/tweetDelete'
import { Tweet } from '@/composables/types'
import { getFirestore, writeBatch, collection, serverTimestamp, doc } from 'firebase/firestore'

export const useRetweet = () => {
    console.log('■■useRetweet開始。')

    // リツイートはツイート作成と似ている。type=retweetでツイートを作成し、オリジナルツイートのDocRefを入力。
    const storeRetweet = async (originalTweetDocId: string) => {
      console.log('retweet開始')
      const { me } = useAuthByGoogleAccount()
      if (!me.value) {
        alert('ログインしていないのでリツイートをすることができません')
        return
      }

      const db = getFirestore()
      const batch = writeBatch(db)
      try {
        // ツイート作成(type:retweet) tweets/xxx/public/tweetPublicDocumentV1
        const tweetsColRef = collection(db, 'tweets')
        const tweetDocId = doc(tweetsColRef).id
        console.log('tweetDocId：' + tweetDocId)
        const tweetPublicDocRef = doc(db, 'tweets', tweetDocId, 'public', 'tweetPublicDocumentV1')
        const originalTweetPublicDocRef = doc(db, 'tweets', originalTweetDocId, 'public', 'tweetPublicDocumentV1')
        batch.set(tweetPublicDocRef, {
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            tweetDocId: tweetDocId,
            body: '',
            imageFullPaths: [],
            imageUrls: [],
            tweetType: 'retweet',
            userInfo: {
                slug: me.value.slug,
                displayName: me.value.displayName,
                description: me.value.description,
                iconImageUrl: me.value.iconImageUrl,
                followingsCount: me.value.followingsCount,
                followersCount: me.value.followersCount,
                userType: me.value.userType,
            },
            originalTweetPublicDocRef: originalTweetPublicDocRef
        })
        
        // users/uid/public/userPublicDocumentV1/myTweets
        // ドキュメントIDにtweetsコレクションドキュメントID(tweet/xxx)を流用する
        const myTweetDocRef = doc(db, 'users', me.value.uid, 'public', 'userPublicDocumentV1', 'myTweets', tweetDocId)
        batch.set(myTweetDocRef, {
            // tweetsコレクション側のslugを持たせる。
            // 個人ごとツイートで時系列順に表示できるようcreatedAtを持たせる。
            tweetPublicDocRef: tweetPublicDocRef,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        })

        // オリジナルツイートのリツイートしたユーザーサブコレクションにuser.slugを追加
        // tweets/yyy/public/tweetPublicDocumentV1/retweetUsersSubCollection
        const retweetUserDocRef = doc(
            db,
            'tweets',
            originalTweetDocId,
            'public',
            'tweetPublicDocumentV1',
            'retweetUsersSubCollection',
            me.value.slug
        )
        batch.set(retweetUserDocRef, {
            userInfo: {
                slug: me.value.slug,
                displayName: me.value.displayName,
                description: me.value.description,
                iconImageUrl: me.value.iconImageUrl,
                userType: me.value.userType,
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        })

        await batch.commit()
      } catch (error) {
        console.debug('storeRetweetでエラー発生')
        console.debug(error)
      }
}

    const destroyRetweet = async (tweetDocId: string, originalTweetDocId: string) => {
      console.log('destroyRetweet開始')
      const { me } = useAuthByGoogleAccount()
      if (!me.value) {
        alert('ログインしていないのでリツイートを取り消すことができません')
        return
      }

      // リツイート取り消しはツイート削除のようなものなので流用できる
      const { deleteTweet } = useTweetDelete()
      await deleteTweet(tweetDocId)

      const db = getFirestore()
      const batch = writeBatch(db)
      try {
        // tweets/yyy/public/tweetPublicDocumentV1/retweetUsersSubCollection/user.slug
        const retweetUserDocRef = doc(
            db,
            'tweets',
            originalTweetDocId,
            'public',
            'tweetPublicDocumentV1',
            'retweetUsersSubCollection',
            me.value.slug
        )
        batch.delete(retweetUserDocRef)

        await batch.commit()
      } catch (error) {
        console.debug('destroyRetweetでエラー発生')
        console.debug(error)
      }
}

return { storeRetweet, destroyRetweet }
}