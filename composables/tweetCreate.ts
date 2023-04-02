import { computed, reactive } from '#imports'
import { collection, doc, getFirestore, serverTimestamp, writeBatch, increment } from 'firebase/firestore'
import { TweetDraft } from '@/composables/types'
import { useAuthByGoogleAccount } from '@/composables/auth'
import { useStorage } from '@/composables/storage'

export const useCreateTweet = () => {
    console.log('useCreateTweet開始。')

    // ユーザー入力による部分
    const tweetDraft: TweetDraft = reactive({
        body: '',
        images: [],
        imageUrls: [],
        imageFullPaths: [],
        imagePreviewUrls: [],
    })

    // inputタグはクリックするごとに画像ファイルを上書きするので、一度アップされた画像を退避しておきマージする
    const selectImages = (event) => {
        console.log('selectImages発動')
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
        const { uploadPublicImage } = useStorage()

        for (const image of tweetDraft.images) {
            const { imageFullPath, imageUrl } = await uploadPublicImage('tweet-images', image)
            tweetDraft.imageFullPaths.push(imageFullPath)
            tweetDraft.imageUrls.push(imageUrl)
        }
    }

    // tweetsコレクションとuserコレクションのmyTweetsサブコレクションに保存
    const tweet = async () => {
        console.log('tweet()開始')

        const { me } = useAuthByGoogleAccount()

        if (!me.value) {
            alert('ログインしていないのでツイートすることができません')
            return
        }
        console.log('ここまで来てるのはログインしているということ')
        console.log('me.value↓')
        console.log(me.value)

        const db = getFirestore()
        const userPublicDocument = 'userPublicDocumentV1'
        const tweetPublicDocument = 'tweetPublicDocumentV1'

        try {
            // 先に画像をアップロード firestore側に画像のフルパスを保存する必要があるから
            if (tweetDraft.images.length) {
                await uploadTweetImages()
            }

            // バッチ書き込み
            // @link https://cloud.google.com/firestore/docs/manage-data/transactions?hl=ja#batched-writes
            // writeBatch では addDocが存在しないためbatch.setで書き換え
            // @link https://blog.ojisan.io/firebase-batch-add-v9/
            const batch = writeBatch(db)

            // tweets/xxx/public/tweetPublicDocumentV1
            const tweetsColRef = collection(db, 'tweets')
            const tweetDocId = doc(tweetsColRef).id
            console.log('tweetDocId' + tweetDocId)
            const tweetPublicDocRef = doc(db, 'tweets', tweetDocId, 'public', tweetPublicDocument)
            batch.set(tweetPublicDocRef, {
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                tweetDocId: tweetDocId,
                body: tweetDraft.body,
                imageFullPaths: tweetDraft.imageFullPaths,
                imageUrls: tweetDraft.imageUrls,
                tweetType: 'normal',
                userInfo: {
                    slug: me.value.slug,
                    displayName: me.value.displayName,
                    description: me.value.description,
                    iconImageUrl: me.value.iconImageUrl,
                    followingsCount: me.value.followingsCount,
                    followersCount: me.value.followersCount,
                    userType: me.value.userType,
                },
            })

            // users/uid/public/userPublicDocumentV1/myTweets
            // ドキュメントIDにtweetsコレクションドキュメントID(tweet/xxx)を流用する
            const myTweetDocRef = doc(db, 'users', me.value.uid, 'public', userPublicDocument, 'myTweets', tweetDocId)
            // const myTweetsColRef = collection(db, 'users', me.value.uid, 'public', userPublicDocument, 'myTweets')
            // const myTweetDocId = doc(myTweetsColRef).id
            // console.log('myTweetDocId：' + myTweetDocId)
            // const myTweetDocRef = doc(
            //     db,
            //     'users',
            //     me.value.uid,
            //     'public',
            //     userPublicDocument,
            //     'myTweets',
            //     myTweetDocId
            // )
            batch.set(myTweetDocRef, {
                // tweetsコレクション側のslugを持たせる。
                // 個人ごとツイートで時系列順に表示できるようcreatedAtを持たせる。
                tweetPublicDocRef: tweetPublicDocRef,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })

            await batch.commit()
        } catch (error) {
            console.log('■■tweets()でエラー発生。コンソールデバッグ↓')
            console.debug(error)
        }
    }
    return { tweetDraft, deselectImage, selectImages, isValidTweet, tweet }
}
