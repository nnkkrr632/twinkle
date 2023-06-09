import { reactive, computed } from '#imports'
import { getFirestore, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import type { UserProfileDraft } from '@/composables/types'
import { useAuthByGoogleAccount } from '@/composables/auth'
import { useStorage } from '@/composables/storage'

// ユーザープロフィール
export const useEditProfile = () => {
    const { me } = useAuthByGoogleAccount()

    if (!me.value) {
        return
    }

    // 初期値は現在値
    const profileDraft: UserProfileDraft = reactive({
        displayName: me.value.displayName,
        description: me.value.description,
        place: me.value.place,
        link: me.value.link,
        headerImage: null,
        iconImage: null,
        headerImagePreviewUrl: me.value.headerImageUrl,
        iconImagePreviewUrl: me.value.iconImageUrl,
        headerImageFullPath: me.value.headerImageFullPath,
        iconImageFullPath: me.value.iconImageFullPath,
        headerImageUrl: me.value.headerImageUrl,
        iconImageUrl: me.value.iconImageUrl,
    })

    // location.reload()するからreactiveではなくてOK
    const beforeEditImages = {
        headerImageFullPath: me.value.headerImageFullPath,
        iconImageFullPath: me.value.iconImageFullPath,
    }

    const selectHeaderImage = (event: any) => {
        // event.target.files が FileList型のようだ
        profileDraft.headerImage = event.target.files[0]
        if (!profileDraft.headerImage) {
            return
        }
        profileDraft.headerImagePreviewUrl = URL.createObjectURL(profileDraft.headerImage)
    }

    const deselectHeaderImage = async () => {
        profileDraft.headerImage = null
        profileDraft.headerImagePreviewUrl = ''
        // 既に設定されているヘッダー画像を削除するフラグ
        profileDraft.headerImageUrl = ''
    }

    const selectIconImage = (event: any) => {
        // event.target.files が FileList型のようだ
        profileDraft.iconImage = event.target.files[0]
        if (!profileDraft.iconImage) {
            return
        }
        profileDraft.iconImagePreviewUrl = URL.createObjectURL(profileDraft.iconImage)
    }

    const isValidLink = computed(() => {
        return (
            profileDraft.link.length === 0 ||
            (profileDraft.link.length > 1 &&
                profileDraft.link.length < 80 &&
                profileDraft.link.match(/^https?:\/\/.+\..+/))
        )
    })

    const isValidEdit = computed(() => {
        // 画像のチェックはなし
        return (
            profileDraft.displayName.length > 0 &&
            profileDraft.displayName.length < 31 &&
            profileDraft.description.length < 121 &&
            profileDraft.place.length < 21 &&
            isValidLink.value
        )
    })

    const edit = async () => {
        if (!me.value) {
            return
        }

        try {
            // 画像のアップロード
            const { uploadPublicImage, deleteImage } = useStorage()
            if (profileDraft.headerImage) {
                if (profileDraft.headerImageFullPath) {
                    await deleteImage(profileDraft.headerImageFullPath)
                }
                const { imageFullPath, imageUrl } = await uploadPublicImage(
                    `user-header-images/${me.value.uid}`,
                    profileDraft.headerImage
                )
                profileDraft.headerImageFullPath = imageFullPath
                profileDraft.headerImageUrl = imageUrl
            }
            if (profileDraft.iconImage) {
                if (profileDraft.iconImageFullPath) {
                    await deleteImage(profileDraft.iconImageFullPath)
                }
                const { imageFullPath, imageUrl } = await uploadPublicImage(`user-icon-images/${me.value.uid}`, profileDraft.iconImage)
                profileDraft.iconImageFullPath = imageFullPath
                profileDraft.iconImageUrl = imageUrl
            }
            // ヘッダー画像削除フラグ
            if (!profileDraft.headerImageUrl && profileDraft.headerImageFullPath) {
                await deleteImage(profileDraft.headerImageFullPath)
                profileDraft.headerImageFullPath = ''
            }

            // 画像変更時は変更前の画像を削除
            if (
                beforeEditImages.headerImageFullPath &&
                beforeEditImages.headerImageFullPath !== profileDraft.headerImageFullPath
            ) {
                await deleteImage(beforeEditImages.headerImageFullPath)
            }
            if (
                beforeEditImages.iconImageFullPath &&
                beforeEditImages.iconImageFullPath !== profileDraft.iconImageFullPath
            ) {
                await deleteImage(beforeEditImages.iconImageFullPath)
            }

            const myUserDocRef = doc(getFirestore(), 'users', me.value.uid)
            await updateDoc(myUserDocRef, {
                headerImageFullPath: profileDraft.headerImageFullPath,
                iconImageFullPath: profileDraft.iconImageFullPath,
                headerImageUrl: profileDraft.headerImageUrl,
                iconImageUrl: profileDraft.iconImageUrl,
                displayName: profileDraft.displayName,
                description: profileDraft.description,
                place: profileDraft.place,
                link: profileDraft.link,
                updatedAt: serverTimestamp(),
            })

            location.reload()
        } catch (error) {
            // console.debug('useEditProfile()のedit()でエラー発生')
            console.error(error)
        }
    }

    return { profileDraft, selectHeaderImage, deselectHeaderImage, selectIconImage, isValidLink, isValidEdit, edit }
}
