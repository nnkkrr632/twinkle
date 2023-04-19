import { getStorage, ref as storageRef, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage'
import { getRandomString } from '@/utils/helpers'

export const useStorage = () => {
    // private firebase storage から画像を取得
    const resolveImageUrl = async (imageFullPath: string) => {
        console.log('storage.tsのresolveImageUrl開始')
        const imageRef = storageRef(getStorage(), imageFullPath)
        try {
            const imageUrl = await getDownloadURL(imageRef)
            return imageUrl
        } catch (error) {
            console.log('■■resolveImageUrl()でエラー発生。コンソールデバッグ↓')
            console.debug(error)
            // 画像フルパス設定されているのに取得ミスったらデフォルト設定しておく
            return 'default-image-url'
        }
    }

    const uploadPublicImage = async (directoryName: string, image: File) => {
        console.log('uploadImage()開始')

        const imageRef = storageRef(getStorage(), `${directoryName}/${getRandomString()}`)
        try {
            const response = await uploadBytes(imageRef, image)
            console.log(response.metadata)
            console.log(response.ref)
            const imageUrl = await resolveImageUrl(imageRef.fullPath)
            return { imageFullPath: imageRef.fullPath, imageUrl: imageUrl }
        } catch (error) {
            console.debug(error)
        }
    }

    const getDefaultImageUrl = async (imageFileName: string) => {
        const imageRef = storageRef(getStorage(), `material-images/${imageFileName}`)
        const imageUrl = await resolveImageUrl(imageRef.fullPath)
        console.log('imageUrl↓')
        console.log(imageUrl)
        return imageUrl
    }

    const deleteImage = async (imageFullPath: string) => {
        console.log('deleteImage開始')
        const deletingImageRef = storageRef(getStorage(), imageFullPath)
        try {
            await deleteObject(deletingImageRef)
        } catch (error) {
            console.log('storage.ts。deleteImage()でエラー発生')
            console.debug(error)
        }
    }

    return { uploadPublicImage, deleteImage, getDefaultImageUrl }
}
