import { ref as storageRef, getDownloadURL } from 'firebase/storage'
// import { useMyFirebase } from '@/composables/firebase'
import { getStorage } from 'firebase/storage'

export const useStorage = () => {
    // console.log('storage.tsのuseStorage開始。getStorage()でstorageとれてるの？↓')
    const storage = getStorage()
    // console.log(storage)

    // firebase storage から画像を取得
    const resolveImageUrl = async (imageFullPath: string) => {
        // console.log('storage.tsのresolveImageUrl開始')
        const imageRef = storageRef(storage, imageFullPath)
        try {
            const imageUrl = await getDownloadURL(imageRef)
            return imageUrl
        } catch (e) {
            console.log('■■resolveImageUrl()でエラー発生。コンソールデバッグ↓')
            console.debug(e)
            // 画像フルパス設定されているのに取得ミスったらデフォルト設定しておく
            return 'default-image-url'
        }
    }

    return { resolveImageUrl }
}
