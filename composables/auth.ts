import type { User as AuthenticationUser } from 'firebase/auth'
import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    UserCredential,
    getRedirectResult,
    onIdTokenChanged,
    sendSignInLinkToEmail,
    signOut as firebaseSignOut,
    setPersistence,
    browserSessionPersistence,
    browserLocalPersistence,
} from 'firebase/auth'
import {
    collection,
    where,
    query,
    getDocs,
    setDoc,
    doc,
    addDoc,
    getFirestore,
    DocumentData,
    getDoc,
    serverTimestamp,
} from '@firebase/firestore'
import { getStorage, ref as storageRef } from 'firebase/storage'

import { useState, ref, computed } from '#imports'
import { getRandomString } from '@/utils/myLibrary'
import type { User } from '@/composables/types'
import { useUserSelect } from '@/composables/userSelect'

// サインイン
export const useAuthByGoogleAccount = () => {
    console.log('useAuthByGoogleAccount開始')
    // .vueのインポートでnullかもでうまく注意が出てしまう
    // if (process.server) {
    //   console.log('useAuthByGoogleAccountでサーバーの分岐は行ったので早期リターン')
    //   return
    // }
    const db = getFirestore()
    const storage = getStorage()
    const auth = getAuth()
    const { getRetouchedUser, getUser } = useUserSelect()

    const user = useState<User | null>('loginUser', () => null)

    console.log('ここはcomposables/auth.tsのuseAuthByGoogleAccount直下')
    console.log('auth.currentUser↓')
    console.log(auth.currentUser)
    console.log('user.value↓')
    console.log(user.value)

    // firestoreのusersコレクションにAuthenticationUserのuidでドキュメント作成
    const createUser = async (user: AuthenticationUser) => {
        console.log('createUser()開始')

        try {
            const randomSlug = getRandomString()
            const imageRef = storageRef(storage, `default-images/default_user_image.png`)
            // users/uid
            await setDoc(doc(db, 'users', `${user.uid}`), {
                slug: randomSlug,
            })

            // users/uid/public/userPublicDocumentV1
            await setDoc(doc(db, 'users', `${user.uid}`, 'public', 'userPublicDocumentV1'), {
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                uid: user.uid,
                slug: randomSlug,
                displayName: randomSlug,
                link: '',
                place: '',
                userType: 'normal',
                iconImageFullPath: imageRef.fullPath,
                headerImageFullPath: '',
                tweetsCount: 0,
                likeTweetsCount: 0,
                followingsCount: 0,
                followersCount: 0,
            })
        } catch (e) {
            console.log('createUserでエラー発生')
            console.log(e)
        }
    }

    // Google新規登録
    const googleSignUp = async () => {
        if (user.value) {
            alert('既にログインしています。')
            return
        }

        try {
            const provider = new GoogleAuthProvider()
            const userCredential = await signInWithPopup(auth, provider)
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
                user.value = await getRetouchedUser(uid)
                console.log('すでにユーザー登録されていますの分岐のuser.value↓')
                console.log(user.value)
            } else {
                console.log('新規登録の分岐入った')
                alert('新規登録完了しました')
                const createdUserSlug = await createUser(authenticationUser)
                if (!createdUserSlug) {
                    return
                }
                user.value = await getRetouchedUser(uid)
                console.log('新規登録で作成されたuserで埋められたuser.value↓')
                console.log(user.value)
            }
        } catch (error) {
            console.log('googleSignUpでエラー発生')
            throw error
        }
    }

    const signOut = async () => {
        console.log('signOut()開始')
        if (!user.value) {
            alert('現在ログインしていません。')
        }
        try {
            await firebaseSignOut(auth)
            user.value = null
        } catch (e) {
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
                auth,
                async (authenticationUser) => {
                    if (authenticationUser) {
                        console.log('setUser()のonAuthStateChangedでauthenticationUserが存在するの分岐入った')
                        // authenticationUserがいるということはFirestoreからも取れてしかるべき
                        user.value = await getRetouchedUser(authenticationUser.uid)
                        console.log('onAuthStateChanged()内のuser.value↓')
                        console.log(user.value)
                        resolve(authenticationUser)
                    } else {
                        console.log('setUser()のonAuthStateChangedでauthenticationUserが存在しない分岐入った')
                        user.value = null
                        resolve(authenticationUser)
                    }
                },
                (error) => reject(error)
            )
        })
    }

    return { user, signOut, setAuthUserWhenAUthStateChanged, googleSignUp }
}

// サインインしたユーザーの取得
// export const useSignedInUser = () => {
//   console.log('useSignedInUser入った')

//   const getSignedInUser = () => {
//     const auth = getAuth(app)
//     onAuthStateChanged(auth, (user) => {
//       console.log('onAuthStateChangedの引数のuserってなに？↓')
//       console.log(user)
//       if (user) {
//         // User is signed in, see docs for a list of available properties
//         // https://firebase.google.com/docs/reference/js/firebase.User
//         const uid = user.uid;
//         console.log(uid);
//         return uid
//         // ...
//       } else {
//         // User is signed out
//         // ...
//       }
//     })
//   }

//   return { getSignedInUser }
// }
