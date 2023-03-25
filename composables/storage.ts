import { getStorage, ref as storageRef, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage'
import { getRandomString } from '@/utils/myLibrary'

export const useStorage = () => {
    // console.log('storage.tsのuseStorage開始。getStorage()でstorageとれてるの？↓')
    const storage = getStorage()
    // console.log(storage)

    // private firebase storage から画像を取得
    const resolveImageUrl = async (imageFullPath: string) => {
        console.log('storage.tsのresolveImageUrl開始')
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

    const uploadPublicImage = async (directoryName: string, image: File) => {
        console.log('uploadImage()開始')

        const imageRef = storageRef(storage, `${directoryName}/${getRandomString()}`)
        try {
            const response = await uploadBytes(imageRef, image)
            console.log(response.metadata)
            console.log(response.ref)
            const imageUrl = await resolveImageUrl(imageRef.fullPath)
            return { imageFullPath: imageRef.fullPath, imageUrl: imageUrl}
        } catch (error) {
            console.error(error)
        }
    }

    const deleteImage = async (imageFullPath: stirng) => {
        console.log('deleteImage開始')
        const deletingImageRef = storageRef(storage, imageFullPath)
        try {
            await deleteObject(deletingImageRef)
        } catch (error) {
            console.log('storage.ts。deleteImage()でエラー発生')
            console.debug(JSON.stringify(error))
        }
    }

    return { uploadPublicImage, deleteImage }
}
