import { getStorage, ref as storageRef, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage'
import { getRandomString } from '@/utils/helpers'

export const useStorage = () => {
    const resolveImageUrl = async (imageFullPath: string) => {
        const imageRef = storageRef(getStorage(), imageFullPath)
        try {
            const imageUrl = await getDownloadURL(imageRef)
            return imageUrl
        } catch (error) {
            console.debug('useStorage()のresolveImageUrl()でエラー発生')
            console.error(error)
            // 失敗したら画像なし扱い
            return ''
        }
    }

    const uploadPublicImage = async (filePath: string, image: File) => {
        const imageRef = storageRef(getStorage(), `${filePath}/${getRandomString()}`)
        try {
            await uploadBytes(imageRef, image)
            const imageUrl = await resolveImageUrl(imageRef.fullPath)
            return { imageFullPath: imageRef.fullPath, imageUrl: imageUrl }
        } catch (error) {
            console.debug('useStorage()のuploadPublicImage()でエラー発生')
            console.error(error)
        }
    }

    const deleteImage = async (imageFullPath: string) => {
        const deletingImageRef = storageRef(getStorage(), imageFullPath)
        try {
            await deleteObject(deletingImageRef)
        } catch (error) {
            console.debug('useStorage()のdeleteImage()でエラー発生')
            console.error(error)
        }
    }

    return { uploadPublicImage, deleteImage }
}
