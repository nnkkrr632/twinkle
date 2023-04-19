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
    //   console.log('useAuthByGoogleAccountでサーバーの分岐は行ったので早期リターン')
    //   return
    // }

    const me = useState<User | null>('loginUser', () => null)

    // users/uidドキュメントを作成
    const createUser = async (user: AuthenticationUser) => {
        console.log('createUser()開始')
        const db = getFirestore()
        try {
            const randomSlug = getRandomString()
            // users/uid
            await setDoc(doc(db, 'users', `${user.uid}`), {
                slug: randomSlug,
            })

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
            console.log('createUserでエラー発生')
            console.debug(error)
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

            console.log('userCredential↓')
            console.log(userCredential)
            console.log('authenticationUser = userCredential.user↓')
            console.log(authenticationUser)
            console.log('uid = authenticationUser.uid↓')
            console.log(uid)

            const userData = await getUser(uid)
            console.log('authのuidでusersコレクションからドキュメントを探した。userData')
            console.log(userData)

            if (userData) {
                console.log('既にユーザー登録されているの分岐入った')
                alert('既にユーザー登録されています。')
                me.value = await getRetouchedUser(uid)
                console.log('すでにユーザー登録されていますの分岐のme.value↓')
                console.log(me.value)
            } else {
                console.log('新規登録の分岐入った')
                alert('新規登録完了しました')
                await createUser(authenticationUser)
                me.value = await getRetouchedUser(uid)
                console.log('新規登録で作成されたuserで埋められたme.value↓')
                console.log(me.value)
            }
            navigateTo(`/${me.value?.slug}`)
        } catch (error) {
            console.log('googleSignUpでエラー発生')
            throw error
        }
    }

    const signOut = async () => {
        console.log('signOut()開始')
        if (!me.value) {
            alert('現在ログインしていません。')
        }
        navigateTo('/')
        try {
            await firebaseSignOut(getAuth())
            me.value = null
        } catch (error) {
            console.log('signOutでエラー発生')
        }
    }

    const setAuthUserWhenAUthStateChanged = async () => {
        console.log('setUserWhenAuthStateChanged()開始')
        await new Promise<AuthenticationUser | null>((resolve, reject) => {
            if (process.server) {
                console.log('setUser()でprocess.serverの分岐はいった')
                return resolve(null)
            }
            // 第二引数のauthenticationUser は引数名
            onAuthStateChanged(
                getAuth(),
                async (authenticationUser) => {
                    if (authenticationUser) {
                        console.log('setUser()のonAuthStateChangedでauthenticationUserが存在するの分岐入った')
                        // authenticationUserがいるということはFirestoreからも取れてしかるべき
                        const { getRetouchedUser } = useUserSelect()
                        const retouchedUser = await getRetouchedUser(authenticationUser.uid)
                        if (retouchedUser) {
                            me.value = retouchedUser
                        }
                        console.log('onAuthStateChanged()内のme.value↓')
                        console.log(me.value)
                        resolve(authenticationUser)
                    } else {
                        console.log('setUser()のonAuthStateChangedでauthenticationUserが存在しない分岐入った')
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
            console.log('reAuthenticateここまで残っているのは成功。下でuseStateのreAuthenticatedにtrueをセット')
            reAuthenticated.value = true
        } catch (error) {
            console.log('再度ログインエラー発生')
            console.log(error)
        }
    }

    const deleteMe = async () => {
        const auth = getAuth()
        const currentUser = auth.currentUser
        console.log('currentUser')
        console.log(currentUser)
        if (!currentUser) {
            console.log('ログインしていない自分を削除することはできません。')
            return
        }

        try {
            await deleteUser(currentUser)
        } catch (error) {
            console.log('deleteMe()でエラー発生')
            console.debug(error)
        }
    }

    return { me, signOut, setAuthUserWhenAUthStateChanged, googleSignUp, reAuthenticate, reAuthenticated, deleteMe }
}
