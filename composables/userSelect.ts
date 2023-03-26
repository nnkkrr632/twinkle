import { doc, DocumentData, getDoc, collection, getDocs, where, query } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'
import type { User } from '@/composables/types'
import dayjs from 'dayjs'

export const useUserSelect = () => {
    console.log('useUserSelect()開始。')
    const getRetouchedUser = async (uid: string) => {
        try {
            const user = await getUser(uid)
            if (!user) {
                return
            }
            return retouchUser(user) as User
        } catch (error) {
            console.log('getRetouchedUserでエラー発生。コンソールデバッグ↓')
            console.debug(error)
        }
    }

    const resolveUidFromUserSlug = async (userSlug: string) => {
        const usersColRef = collection(getFirestore(), 'users')
        const q = query(usersColRef, where('slug', '==', userSlug))
        const querySnapshot = await getDocs(q)
        let uid = ''
        querySnapshot.forEach((queryDocSnapshot) => {
            const id = queryDocSnapshot.id
            uid = id
        })
        return uid
    }

    // firestoreからユーザー取得
    const getUser = async (uid: string) => {
        // console.log('getUser開始')
        try {
            const userDocRef = doc(getFirestore(), 'users', uid, 'public', 'userPublicDocumentV1')
            const userSnapshot = await getDoc(userDocRef)
            return userSnapshot.data()
        } catch (error) {
            console.log('getUserでエラー発生。コンソールデバッグ↓')
            console.debug(error)
        }
    }

    // 以下プライベートメソッド

    // 表示用に加工
    const retouchUser = (user: DocumentData) => {
        // console.log('retouchUser()開始')
        // 日付の変換
        user.formattedCreatedAt = dayjs(user.createdAt.toDate()).format('YYYY年M月')
        return user
    }

    return { getRetouchedUser, resolveUidFromUserSlug, getUser }
}
