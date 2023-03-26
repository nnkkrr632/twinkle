import { useRoute, useAsyncData } from '#imports'
import type { User } from '@/composables/types'
import { useUserSelect } from '@/composables/userSelect'

// ユーザープロフィール
export const useUserDetail = () => {
    const { getRetouchedUser, resolveUidFromUserSlug } = useUserSelect()
    const { data: user, error } = useAsyncData(async () => {
        console.log('■■useUserDetails()のuseAsyncData()開始。')

        const route = useRoute()
        const userSlug = route.params.userSlug
        if (typeof userSlug !== 'string') {
            return
        }

        try {
            const uid = await resolveUidFromUserSlug(userSlug)
            const retouchedUser = await getRetouchedUser(uid)
            // console.log('■■リターン前のretouchedUser↓')
            // console.log(retouchedUser)
            return retouchedUser as User
        } catch (error) {
            console.log('■■プロフィール取得のuseAsyncData()でエラー発生。コンソールデバッグ↓')
            console.debug(error)
        }
    })

    return { user, error }
}
