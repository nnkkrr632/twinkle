import { useState, navigateTo } from '#imports'
import type { User as AuthenticationUser } from 'firebase/auth'
import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut as firebaseSignOut,
    deleteUser,
    reauthenticateWithCredential,
} from 'firebase/auth'
import { setDoc, doc, getFirestore, serverTimestamp } from '@firebase/firestore'
import type { User } from '@/composables/types'
import { useUserSelect } from '@/composables/userSelect'
import { getRandomString } from '@/utils/helpers'

// サインイン
export const useAuthByGoogleAccount = () => {
    // .vueのインポートでnullかもでうまく注意が出てしまう
    // if (process.server) {
    //   return
    // }

    const me = useState<User | null>('loginUser', () => null)

    // users/uidドキュメントを作成
    const createUser = async (user: AuthenticationUser) => {
        const db = getFirestore()
        try {
            const randomSlug = getRandomString()
            // users/uid
            await setDoc(doc(db, 'users', user.uid), {
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                uid: user.uid,
                slug: randomSlug,
                displayName: randomSlug,
                description: '',
                link: '',
                place: '',
                type: 'normal',
                iconImageFullPath: '',
                headerImageFullPath: '',
                iconImageUrl: '',
                headerImageUrl: '',
            })
        } catch (error) {
            // console.debug('useAuthByGoogleAccount()のcreateUser()でエラー発生')
            console.error(error)
        }
    }

    // Google新規登録
    const googleSignUp = async () => {
        if (me.value) {
            alert('既にログインしています。')
            return
        }

        const { getRetouchedUser, getUser } = useUserSelect()
        try {
            const provider = new GoogleAuthProvider()
            const userCredential = await signInWithPopup(getAuth(), provider)
            const authenticationUser = userCredential.user
            const uid = authenticationUser.uid

            const userData = await getUser(uid)
            if (userData) {
                me.value = await getRetouchedUser(uid)
            } else {
                await createUser(authenticationUser)
                me.value = await getRetouchedUser(uid)
            }
            navigateTo(`/${me.value?.slug}`)
        } catch (error) {
            alert('Googleアカウントによるサインインに失敗しました。')
            // console.debug('useAuthByGoogleAccount()のgoogleSignUp()でエラー発生')
            console.error(error)
        }
    }

    const signOut = async () => {
        if (!me.value) {
            alert('現在ログインしていません。')
        }
        navigateTo('/')
        try {
            await firebaseSignOut(getAuth())
            me.value = null
        } catch (error) {
            // console.debug('useAuthByGoogleAccount()のsignOut()でエラー発生')
            console.error(error)
        }
    }

    const setAuthUserWhenAUthStateChanged = async () => {
        await new Promise<AuthenticationUser | null>((resolve, reject) => {
            if (process.server) {
                return resolve(null)
            }
            // 第二引数のauthenticationUser は引数名
            onAuthStateChanged(
                getAuth(),
                async (authenticationUser) => {
                    if (authenticationUser) {
                        // authenticationUserがいるということはFirestoreからも取れてしかるべき
                        const { getRetouchedUser } = useUserSelect()
                        const retouchedUser = await getRetouchedUser(authenticationUser.uid)
                        if (retouchedUser) {
                            me.value = retouchedUser
                        }
                        resolve(authenticationUser)
                    } else {
                        me.value = null
                        resolve(authenticationUser)
                    }
                },
                (error) => reject(error)
            )
        })
    }

    const reAuthenticated = useState<boolean>('reAuthenticated', () => false)
    const reAuthenticate = async () => {
        try {
            const auth = getAuth()
            const currentUser = auth.currentUser
            if (!currentUser) {
                return
            }
            const userCredential = await signInWithPopup(auth, new GoogleAuthProvider())
            const oAuthCredential = GoogleAuthProvider.credentialFromResult(userCredential)
            if (!oAuthCredential) {
                return
            }
            await reauthenticateWithCredential(currentUser, oAuthCredential)
            // middlewareのre-authenticated.tsでURL入るときに参照
            reAuthenticated.value = true
        } catch (error) {
            // console.debug('useAuthByGoogleAccount()のreAuthenticate()でエラー発生')
            console.error(error)
        }
    }

    const deleteMe = async () => {
        const auth = getAuth()
        const currentUser = auth.currentUser
        if (!currentUser) {
            alert('ログインしていないアカウントを削除することはできません。')
            return
        }

        try {
            await deleteUser(currentUser)
        } catch (error) {
            // console.debug('useAuthByGoogleAccount()のdeleteMe()でエラー発生')
            console.error(error)
        }
    }

    return { me, signOut, setAuthUserWhenAUthStateChanged, googleSignUp, reAuthenticate, reAuthenticated, deleteMe }
}
