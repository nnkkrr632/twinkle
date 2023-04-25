import { useRoute, useAsyncData } from '#imports'
import type { User } from '@/composables/types'
import { useUserSelect } from '@/composables/userSelect'

// ユーザープロフィール
export const useUserDetail = () => {
    const { getRetouchedUser, resolveUidFromUserSlug } = useUserSelect()
    const { data: user, error } = useAsyncData(async () => {
        const route = useRoute()
        const userSlug = route.params.userSlug
        if (typeof userSlug !== 'string') {
            return
        }

        try {
            const uid = await resolveUidFromUserSlug(userSlug)
            if(!uid) { return }
            const retouchedUser = await getRetouchedUser(uid)
            return retouchedUser as User
        } catch (error) {
            // console.debug('useUserDetail()のuseAsyncData()でエラー発生')
            console.error(error)
        }
    })

    return { user, error }
}
