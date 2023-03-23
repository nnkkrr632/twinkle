import { useRoute, useAsyncData } from '#imports'
import { collection, doc, FieldValue, getFirestore, serverTimestamp, writeBatch, increment } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import type { User, UserProfileDraft } from '@/composables/types'
import { useUserSelect } from '@/composables/userSelect'
import { useAuthByGoogleAccount } from '@/composables/auth'

// ユーザープロフィール
export const useEditProfile = () => {
  console.log('useEditProfile開始')
  const { user } = useAuthByGoogleAccount()
  if (!user.value) {
    console.log('ログインしていないので編集するためのプロフィールが存在しません。')
    return
  }

  const db = getFirestore()
  const storage = getStorage()

  // 初期値は現在値
  const profileDraft: UserProfileDraft = reactive({
    headerImage: null,
    iconImage: null,
    displayName: user.value.displayName,
    description: user.value.description,
    place: user.value.place,
    link: user.value.link,
    headerImagePreviewUrl: user.value.headerImageUrl,
    iconImagePreviewUrl: user.value.iconImageUrl,
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

  const deselectHeaderImage = () => {
    console.log('deselectHeaderImage呼ばれた')
    profileDraft.headerImage = null
    profileDraft.headerImagePreviewUrl = ''
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

  const edit = () => {
    console.log('editよばれた')
  }

  return { profileDraft, selectHeaderImage, deselectHeaderImage, selectIconImage, isValidLink, isValidEdit, edit }
}