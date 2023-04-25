import { doc, DocumentData, getDoc, collection, getDocs, where, query } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'
import type { User } from '@/composables/types'
import dayjs from 'dayjs'

export const useUserSelect = () => {
    const getRetouchedUser = async (uid: string) => {
        try {
            const user = await getUser(uid)
            if (!user) {
                return
            }
            return retouchUser(user) as User
        } catch (error) {
            // console.debug('useUserSelect()のgetRetouchedUser()でエラー発生')
            console.error(error)
        }
    }

    const resolveUidFromUserSlug = async (userSlug: string) => {
        const usersColRef = collection(getFirestore(), 'users')
        const q = query(usersColRef, where('slug', '==', userSlug))
        const querySnapshot = await getDocs(q)
        let uid = ''

        if(querySnapshot.empty) {
            return ''
        }
        querySnapshot.forEach((queryDocSnapshot) => {
            const docId = queryDocSnapshot.id
            uid = docId
        })
        return uid
    }

    // firestoreからユーザー取得
    const getUser = async (uid: string) => {
        try {
            const userDocRef = doc(getFirestore(), 'users', uid)
            const userSnapshot = await getDoc(userDocRef)
            return userSnapshot.data()
        } catch (error) {
            // console.debug('useUserSelect()のgetUser()でエラー発生')
            console.error(error)
        }
    }

    // 表示用に加工
    const retouchUser = (user: DocumentData) => {
        // 日付の変換
        user.formattedCreatedAt = dayjs(user.createdAt.toDate()).format('YYYY年M月')
        return user
    }

    return { getRetouchedUser, resolveUidFromUserSlug, getUser }
}
