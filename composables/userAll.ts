import { useAsyncData } from '#imports'
import type { User } from '@/composables/types'
import { useUserSelect } from '@/composables/userSelect'
import { collection, getDocs, getFirestore } from 'firebase/firestore'

// ユーザープロフィール
export const useUserAll = () => {
    const { getRetouchedUser } = useUserSelect()
    const { data: users } = useAsyncData(async () => {
        console.log('■■useUserAll()のuseAsyncData()開始。')

        try{
            // usersコレクション
            const usersColRef = collection(getFirestore(), 'users')
            const usersQuerySnapshot = await getDocs(usersColRef)
            const uids: string[] = []
            usersQuerySnapshot.forEach(queryDocSnapshot => {
                uids.push(queryDocSnapshot.id)
            })
            console.log('uids↓')
            console.log(uids)

            const users: User[] = []
            for(const uid of uids) {
                const retouchedUser = await getRetouchedUser(uid)
                if (!retouchedUser) {
                    continue
                }
                users.push(retouchedUser)
            }
            console.log('users↓')
            console.log(users)
            return users
        } catch(error) {
            console.debug('useUserAll()のuseAsyncDataでエラー発生')
            console.debug(error)
        }
    })

    return { users }
}
