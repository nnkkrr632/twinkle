import { useRoute, useAsyncData, reactive, computed } from '#imports'
import { getFirestore, doc, updateDoc, serverTimestamp, writeBatch, increment } from 'firebase/firestore'
import type { User, UserProfileDraft } from '@/composables/types'
import { useAuthByGoogleAccount } from '@/composables/auth'
import { useStorage } from '@/composables/storage'
import { useUserDetail } from '@/composables/userDetail'

// ユーザープロフィール
export const useEditProfile = () => {
  console.log('useEditProfile開始')
  const { me } = useAuthByGoogleAccount()

  if (!me.value) {
    console.log('ログインしていないので編集するためのプロフィールが存在しません。')
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

  const selectHeaderImage = (event: any) => {
    console.log('selectImage開始')
    console.log('profileDraftの現状確認↓')
    console.log(profileDraft)
    // event.target.files が FileList型のようだ
    profileDraft.headerImage = event.target.files[0]
    console.log('profileDraft.headerImage。ヘッダー画像追加した後↓')
    console.log(profileDraft.headerImage)
    if (!profileDraft.headerImage) {
      return
    }
    profileDraft.headerImagePreviewUrl = URL.createObjectURL(profileDraft.headerImage)
    console.log('headerImagePreviewUrlできた？↓')
    console.log(profileDraft.headerImagePreviewUrl)
  }

  const deselectHeaderImage = async () => {
    console.log('deselectHeaderImage呼ばれた')
    profileDraft.headerImage = null
    profileDraft.headerImagePreviewUrl = ''
    // 既に設定されているヘッダー画像を削除するフラグ
    profileDraft.headerImageUrl = ''
  }

  const selectIconImage = (event: any) => {
    console.log('selectIconImage開始')
    console.log('profileDraftの現状確認↓')
    console.log(profileDraft)
    // event.target.files が FileList型のようだ
    profileDraft.iconImage = event.target.files[0]
    console.log('profileDraft.iconImage。アイコン画像追加した後↓')
    console.log(profileDraft.iconImage)
    if (!profileDraft.iconImage) {
      return
    }
    profileDraft.iconImagePreviewUrl = URL.createObjectURL(profileDraft.iconImage)
    console.log('iconImagePreviewUrlできた？↓')
    console.log(profileDraft.iconImagePreviewUrl)
  }

  const isValidLink = computed(() => {
    console.log('コンピューテッドのisValidLink発動')
    return profileDraft.link.length === 0 
    || (profileDraft.link.length > 1 && profileDraft.link.length < 80 && profileDraft.link.match(/^https?:\/\/.+\..+/))
  })

  const isValidEdit = computed(() => {
    console.log('コンピューテッドのisValidEdit発動')

    // 画像のチェックはなし
    return (profileDraft.displayName.length > 0 && profileDraft.displayName.length < 31)
      && profileDraft.description.length < 121
      && profileDraft.place.length < 21
      && isValidLink.value
  })

  const reflectEditedProfile = () => {
    if(!me.value) { return }
    // meに反映
    me.value.displayName = profileDraft.displayName
    me.value.description = profileDraft.description
    me.value.place = profileDraft.place
    me.value.link = profileDraft.link
    me.value.headerImageFullPath = profileDraft.headerImageFullPath
    me.value.headerImageUrl = profileDraft.headerImageUrl
    me.value.iconImageFullPath = profileDraft.iconImageFullPath
    me.value.iconImageUrl = profileDraft.iconImageUrl
    console.log('reflect後のme.value↓')
    console.log(me.value)

    // プロフィールに反映
    const route = useRoute()
    if (route.path === `/${me.value.slug}`) {
      const { user } = useUserDetail()
      if(!user.value) { return }
      user.value.displayName = profileDraft.displayName
      user.value.description = profileDraft.description
      user.value.place = profileDraft.place
      user.value.link = profileDraft.link
      user.value.headerImageFullPath = profileDraft.headerImageFullPath
      user.value.headerImageUrl = profileDraft.headerImageUrl
      user.value.iconImageFullPath = profileDraft.iconImageFullPath
      user.value.iconImageUrl = profileDraft.iconImageUrl
      console.log('reflect後のuser.value↓')
      console.log(user.value)  
    }

  }

  const edit = async () => {
    console.log('editよばれた')
    if(!me.value) { return }

    try {
      // 画像のアップロード
      const { uploadPublicImage, deleteImage } = useStorage()
      if(profileDraft.headerImage) {
        const { imageFullPath, imageUrl } = await uploadPublicImage('user-header-images', profileDraft.headerImage)
        profileDraft.headerImageFullPath = imageFullPath
        profileDraft.headerImageUrl = imageUrl
      }
      if(profileDraft.iconImage) {
        const { imageFullPath, imageUrl } = await uploadPublicImage('user-icon-images', profileDraft.iconImage)
        profileDraft.iconImageFullPath = imageFullPath
        profileDraft.iconImageUrl = imageUrl
      }
      // ヘッダー画像削除フラグ
      if(!profileDraft.headerImageUrl && profileDraft.headerImageFullPath) {
        await deleteImage(profileDraft.headerImageFullPath)
        profileDraft.headerImageFullPath = ''
      }
  
      console.log('更新されるprofileDraftは以下の内容↓')
      console.log(profileDraft)
  
      const myUserDocRef = doc(getFirestore(), 'users', me.value.uid, 'public', 'userPublicDocumentV1')
      await updateDoc(myUserDocRef, {
        headerImageFullPath: profileDraft.headerImageFullPath,
        iconImageFullPath: profileDraft.iconImageFullPath,
        headerImageUrl: profileDraft.headerImageUrl,
        iconImageUrl: profileDraft.iconImageUrl,
        displayName: profileDraft.displayName,
        description: profileDraft.description,
        place: profileDraft.place,
        link: profileDraft.link,
        updatedAt: serverTimestamp()
      })

          // auth の meに反映
    reflectEditedProfile()

    } catch (error) {
      console.debug(error)
    }
    
  }

  return { profileDraft, selectHeaderImage, deselectHeaderImage, selectIconImage, isValidLink, isValidEdit, edit }
}