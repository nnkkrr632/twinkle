import { computed, reactive } from '#imports'
import { collection, doc, getFirestore, serverTimestamp, writeBatch } from 'firebase/firestore'
import { TweetDraft } from '@/composables/types'
import { useAuthByGoogleAccount } from '@/composables/auth'
import { useStorage } from '@/composables/storage'

export const useCreateTweet = () => {
    const tweetDraft: TweetDraft = reactive({
        body: '',
        images: [],
        imageUrls: [],
        imageFullPaths: [],
        imagePreviewUrls: [],
    })

    // inputタグはクリックするごとに画像ファイルを上書きするので、一度アップされた画像を退避しておきマージする
    const selectImages = (event) => {
        tweetDraft.images = [...tweetDraft.images, ...event.target.files]
        // 先頭の4件に限定する
        tweetDraft.images = tweetDraft.images.splice(0, 4)
        tweetDraft.imagePreviewUrls = []
        for (const image of tweetDraft.images) {
            tweetDraft.imagePreviewUrls.push(URL.createObjectURL(image))
        }
    }

    const deselectImage = (index: number) => {
        tweetDraft.images.splice(index, 1)
        tweetDraft.imagePreviewUrls.splice(index, 1)
    }

    const maxTextCount = 100
    const isValidTweet = computed(() => {
        if (tweetDraft.images.length) {
            return tweetDraft.images.length < 5 && tweetDraft.body.length <= maxTextCount
        }
        return tweetDraft.body.length > 0 && tweetDraft.body.length <= maxTextCount
    })

    const uploadTweetImages = async () => {
        const { me } = useAuthByGoogleAccount()
        if (!me.value) {
            alert('ログインしていないので画像をアップロードすることができません。')
            return
        }
        const { uploadPublicImage } = useStorage()

        for (const image of tweetDraft.images) {
            const { imageFullPath, imageUrl } = await uploadPublicImage(`tweet-images/${me.value.uid}`, image)
            tweetDraft.imageFullPaths.push(imageFullPath)
            tweetDraft.imageUrls.push(imageUrl)
        }
    }

    const clearTweetDraft = () => {
        tweetDraft.body = ''
        tweetDraft.images = []
        tweetDraft.imageUrls = []
        tweetDraft.imageFullPaths = []
        tweetDraft.imagePreviewUrls = []
    }

    // tweetsコレクションとuserコレクションのmyTweetsサブコレクションに保存
    const tweet = async () => {
        const { me } = useAuthByGoogleAccount()
        if (!me.value) {
            alert('ログインしていないのでツイートすることができません。')
            return
        }
        
        try {
            // 先に画像をアップロード firestore側に画像のフルパスを保存する必要があるから
            if (tweetDraft.images.length) {
                await uploadTweetImages()
            }

            // バッチ書き込み
            // @link https://cloud.google.com/firestore/docs/manage-data/transactions?hl=ja#batched-writes
            // writeBatch では addDocが存在しないためbatch.setで書き換え
            // @link https://blog.ojisan.io/firebase-batch-add-v9/
            const db = getFirestore()
            const batch = writeBatch(db)

            // tweets/xxx/
            const tweetsColRef = collection(db, 'tweets')
            const tweetDocId = doc(tweetsColRef).id
            const tweetDocRef = doc(db, 'tweets', tweetDocId)
            batch.set(tweetDocRef, {
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                tweetDocId: tweetDocId,
                body: tweetDraft.body,
                imageFullPaths: tweetDraft.imageFullPaths,
                imageUrls: tweetDraft.imageUrls,
                type: 'normal',
                userInfo: {
                    uid: me.value.uid,
                    slug: me.value.slug,
                    displayName: me.value.displayName,
                    description: me.value.description,
                    iconImageUrl: me.value.iconImageUrl,
                    type: me.value.type,
                },
            })

            // users/uid/myTweetsSubCollection/xxx
            // ドキュメントIDにtweetsコレクションドキュメントID(tweet/xxx)を流用する
            const myTweetDocRef = doc(db, 'users', me.value.uid, 'myTweetsSubCollection', tweetDocId)
            batch.set(myTweetDocRef, {
                // tweetsコレクション側のslugを持たせる。
                // 個人ごとツイートで時系列順に表示できるようcreatedAtを持たせる。
                tweetDocId: tweetDocId,
                type: 'normal',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })

            await batch.commit()
            clearTweetDraft()
        } catch (error) {
            console.debug('useCreateTweet()のtweets()でエラー発生')
            console.error(error)
        }
    }
    return { tweetDraft, deselectImage, selectImages, isValidTweet, maxTextCount, tweet }
}
