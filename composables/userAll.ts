import { useAsyncData } from '#imports'
import type { User } from '@/composables/types'
import { useUserSelect } from '@/composables/userSelect'
import { collection, getDocs, getFirestore } from 'firebase/firestore'

// ユーザープロフィール
export const useUserAll = () => {
    const { getRetouchedUser } = useUserSelect()
    const { data: users } = useAsyncData(async () => {
        try{
            // usersコレクション
            const usersColRef = collection(getFirestore(), 'users')
            const usersQuerySnapshot = await getDocs(usersColRef)
            const uids: string[] = []
            usersQuerySnapshot.forEach(queryDocSnapshot => {
                uids.push(queryDocSnapshot.id)
            })

            const users: User[] = []
            for(const uid of uids) {
                const retouchedUser = await getRetouchedUser(uid)
                if (!retouchedUser) {
                    continue
                }
                users.push(retouchedUser)
            }
            return users
        } catch(error) {
            console.debug('useUserAll()のuseAsyncData()でエラー発生')
            console.error(error)
        }
    })

    return { users }
}
