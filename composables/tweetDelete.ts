import { doc, getFirestore, writeBatch, collection, getDocs, query } from 'firebase/firestore'
import { useAuthByGoogleAccount } from '@/composables/auth'
import { useStorage } from '@/composables/storage'
import { useTweetSelect } from '@/composables/tweetSelect'

// ツイート削除
export const useTweetDelete = () => {

  const deleteTweet = async (tweetDocId: string) => {
    const db = getFirestore()
    const batch = writeBatch(db)
    const { getRetouchedTweets } = useTweetSelect()
    const { deleteImage } = useStorage()
    const { me } = useAuthByGoogleAccount()

    if(!me.value) {
      alert('ログインしていません。')
      return
    }

    console.log('deleteTweet入った。tweetDocId↓')
    console.log(tweetDocId)
    const tweetDocRef = doc(db, 'tweets', tweetDocId)
    const tweet = await getRetouchedTweets([tweetDocRef])
    if (!tweet) {
      alert('削除対象のツイートが存在しません。')
      return
    }

    // 画像の削除
    const imageFullPaths = tweet[0].imageFullPaths
    for (const imageFullPath of imageFullPaths) {
      console.log('画像削除のループ。削除するimageFullPath↓')
      console.log(imageFullPath)
      await deleteImage(imageFullPath)
    }

    try {
      // 親ドキュメントを削除してもサブコレクションは削除されない。個別に削除する
      // ※ writebatchの500 制限を考慮していない。
      
      // tweetsコレクション側
      batch.delete(tweetDocRef)
      // tweets/xxx/retweetUsersSubCollection
      const retweetUsersSubCollectionColRef = collection(db, 'tweets', tweetDocId, 'retweetUsersSubCollection')
      const retweetUsersColSnapshot = await getDocs(retweetUsersSubCollectionColRef)
      retweetUsersColSnapshot.forEach(queryDocSnapshot => {
        const docRef = queryDocSnapshot.ref
        batch.delete(docRef)
      })
      // tweets/xxx/likeUsersSubCollection
      const likeUsersSubCollectionColRef = collection(db, 'tweets', tweetDocId, 'likeUsersSubCollection')
      const likeUsersColSnapshot = await getDocs(likeUsersSubCollectionColRef)
      likeUsersColSnapshot.forEach(queryDocSnapshot => {
        const docRef = queryDocSnapshot.ref
        batch.delete(docRef)
      })
      // batch.delete(retweetUsersSubCollectionDocRef)
      // usersコレクション側
      const myTweetDocRef = doc(db, 'users', me.value.uid, 'myTweetsSubCollection', tweetDocId)
      batch.delete(myTweetDocRef)
      await batch.commit()
    } catch (error) {
      console.log('deleteTweetでエラー発生')
      console.debug(error)
    }
  }

  return { deleteTweet }
}