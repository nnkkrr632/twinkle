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

    const me = useState<User | null>('loginUser', () => null)

    // firestoreのusersコレクションにAuthenticationUserのuidでドキュメント作成
    const createUser = async (user: AuthenticationUser) => {
        console.log('createUser()開始')
        const db = getFirestore()
        try {
            const randomSlug = getRandomString()
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
                description: '',
                link: '',
                place: '',
                userType: 'normal',
                iconImageFullPath: '',
                headerImageFullPath: '',
                iconImageUrl: '',
                headerImageUrl: '',
                tweetsCount: 0,
                likeTweetsCount: 0,
                followingsCount: 0,
                followersCount: 0,
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
                        if(retouchedUser) {
                            me.value = retouchedUser
                        }
                        console.log('onAuthStateChanged()内のme.value↓')
                        console.log(me.value)

                        // useAsyncData()でやってみたけど再読み込み時にuser.valueにすぐに値がセットされないことは変わらない
                        // const { data: retouchedUser } = useAsyncData(async () => {
                        //     try {
                        //         const retouchedUser = await getRetouchedUser(authenticationUser.uid)
                        //         if(retouchedUser) {
                        //             me.value = retouchedUser
                        //         }
                        //         console.log('リターンするretouchedUser↓')
                        //         console.log(retouchedUser)
                        //         console.log('me.value at 内側')
                        //         if(retouchedUser) {
                        //             // me.value = retouchedUser
                        //             // console.log(me.value)
                        //             // console.log('うえうえ')
                        //         }
                        //         return retouchedUser
                        //     } catch (error) {
                        //         console.log('■■onAuthStateChanged()でエラー発生↓')
                        //         console.debug(error)
                        //     }
                        // })
                        // console.log('useAsyncDataを抜けた me.value = retouchedUser ↓')
                        // me.value = retouchedUser
                        // console.log('me.value↓')
                        // console.log(me.value)
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

    return { me, signOut, setAuthUserWhenAUthStateChanged, googleSignUp }
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
