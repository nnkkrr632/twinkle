import { computed, reactive } from '#imports'
import { collection, doc, FieldValue, getFirestore, serverTimestamp, writeBatch, increment } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { ref as storageRef, uploadBytes } from 'firebase/storage'
import { TweetDraft } from '~/composables/types'
import { useAuthByGoogleAccount } from '@/composables/auth'
import { getRandomString } from '@/utils/myLibrary'

export const useCreateTweet = () => {
    console.log('useCreateTweet開始。')
    const db = getFirestore()
    const storage = getStorage()

    // ユーザー入力による部分
    const tweetDraft: TweetDraft = reactive({
        body: '',
        images: [],
        imagePreviewUrls: [],
    })

    // inputタグはクリックするごとに画像ファイルを上書きするので、一度アップされた画像を退避しておきマージする
    const selectImages = (event) => {
        console.log('onImageUploaded発動')
        console.log('tweetDraft.imagesの現状確認↓')
        console.log(tweetDraft.images)
        tweetDraft.images = [...tweetDraft.images, ...event.target.files]
        // 先頭の4件に限定する
        tweetDraft.images = tweetDraft.images.splice(0, 4)
        console.log('tweetDraft.imagesをマージしたあと↓')
        console.log(tweetDraft.images)
        tweetDraft.imagePreviewUrls = []
        for (const image of tweetDraft.images) {
            tweetDraft.imagePreviewUrls.push(URL.createObjectURL(image))
        }
        console.log('imagePreviewUrlsできた？↓')
        console.log(tweetDraft.imagePreviewUrls)
    }

    const deselectImage = (index: number) => {
        console.log('deselectImageよばれた')
        tweetDraft.images.splice(index, 1)
        console.log(tweetDraft.images)
        tweetDraft.imagePreviewUrls.splice(index, 1)
        console.log(tweetDraft.imagePreviewUrls)
    }

    const isValidTweet = computed(() => {
        console.log('コンピューテッドのisValidTweet発動')
        if (tweetDraft.images.length) {
            return tweetDraft.images.length < 5 && tweetDraft.body.length < 11
        }
        return tweetDraft.body.length > 0 && tweetDraft.body.length < 11
    })

    const uploadTweetImages = async () => {
        console.log('uploadTweetImages開始')

        const imageFullPaths: string[] = []
        for (const image of tweetDraft.images) {
            const imageRef = storageRef(storage, `tweet-images/${getRandomString()}`)
            try {
                console.log('アップロードトライ！response↓')
                const response = await uploadBytes(imageRef, image)
                console.log()
                console.log(response.metadata)
                console.log(response.ref)
                console.log('フルパスが取りたい！')
                console.log(imageRef.fullPath)
                imageFullPaths.push(imageRef.fullPath)
            } catch (e) {
                console.error(e)
            }
        }
        // 全部の画像をアップロードしたら
        console.log('imageFullPaths')
        console.log(imageFullPaths)
        return imageFullPaths
    }

    // tweetsコレクションとuserコレクションのmyTweetsサブコレクションに保存
    const tweet = async () => {
        console.log('tweet()開始')

        const { user } = useAuthByGoogleAccount()

        if (!user.value) {
            console.log('ログインしていないのでツイートすることができません')
            alert('ログインしていないのでツイートすることができません')
            return
        }
        console.log('ここまで来てるのはログインしているということ')
        console.log('user.value↓')
        console.log(user.value)

        const userPublicDocument = 'userPublicDocumentV1'
        const tweetPublicDocument = 'tweetPublicDocumentV1'

        try {
            // 先に画像をアップロード firestore側に画像のフルパスを保存する必要があるから
            let imageFullPaths: string[] = []
            if (tweetDraft.images.length) {
                imageFullPaths = await uploadTweetImages()
            }

            // バッチ書き込み
            // @link https://cloud.google.com/firestore/docs/manage-data/transactions?hl=ja#batched-writes
            // writeBatch では addDocが存在しないためbatch.setで書き換え
            // @link https://blog.ojisan.io/firebase-batch-add-v9/
            const batch = writeBatch(db)

            // tweets/xxx/public/tweetPublicDocumentV1
            const tweetsColRef = collection(db, 'tweets')
            const tweetId = doc(tweetsColRef).id
            console.log('tweetId：' + tweetId)
            const tweetPublicDocRef = doc(db, 'tweets', tweetId, 'public', tweetPublicDocument)
            batch.set(tweetPublicDocRef, {
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                tweetDocId: tweetId,
                body: tweetDraft.body,
                imageFullPaths: imageFullPaths,
                likesCount: 0,
                retweetsCount: 0,
                userInfo: {
                    displayName: user.value.displayName,
                    iconImageFullPath: user.value.iconImageFullPath,
                    slug: user.value.slug,
                    description: user.value.description,
                    followingsCount: user.value.followingsCount,
                    followersCount: user.value.followersCount,
                    userType: user.value.userType,
                },
            })

            // users/uid/public/userPublicDocumentV1
            const userDocRef = doc(db, 'users', user.value.uid, 'public', userPublicDocument)
            batch.update(userDocRef, { tweetsCount: increment(1) })

            // users/uid/public/userPublicDocumentV1/myTweets
            const myTweetsColRef = collection(db, 'users', user.value.uid, 'public', userPublicDocument, 'myTweets')
            const myTweetDocId = doc(myTweetsColRef).id
            console.log('myTweetDocId：' + myTweetDocId)
            const myTweetDocRef = doc(
                db,
                'users',
                user.value.uid,
                'public',
                userPublicDocument,
                'myTweets',
                myTweetDocId
            )
            batch.set(myTweetDocRef, {
                // tweetsコレクション側のslugを持たせる。
                tweetPublicDocRef: tweetPublicDocRef,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })

            await batch.commit()
        } catch (e) {
            console.log('■■tweets()でエラー発生。コンソールデバッグ↓')
            console.debug(e)
        }
    }
    return { tweetDraft, deselectImage, selectImages, isValidTweet, tweet }
}
