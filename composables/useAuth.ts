// // @/composables/useAuth.ts
// import type { Auth, User } from "firebase/auth";
// import {
//   getAuth,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   GoogleAuthProvider,
// } from "firebase/auth";
// import { computed, ref } from "vue";

// export function useAuth(auth: Auth = getAuth()) {
//   // ********************************************************
//   // * data
//   // ********************************************************
//   const user = ref<User | null>(auth.currentUser);
//   const isSignIn = computed(() => !!user.value);

//   // idTokenが変化したら更新する
//   auth.onIdTokenChanged((authUser) => (user.value = authUser));

//   // ********************************************************
//   // * methods
//   // ********************************************************
//   // 認証状態チェック
//   async function checkAuthState() {
//     try {
//       const _user = await _checkAuthState(auth);
//       user.value = _user;
//     } catch (error) {
//       user.value = null;
//     }
//   }

//   // ログイン
//   async function login() {
//     try {
//       const provider = new GoogleAuthProvider();
//       await signInWithPopup(auth, provider);
//     } catch (error) {
//       throw error;
//     }
//   }

//   // ログアウト
//   async function logout() {
//     try {
//       await signOut(auth);
//       user.value = null;
//     } catch (error) {
//       throw error;
//     }
//   }

//   return { isSignIn, user, checkAuthState, login, logout };
// }

// // ********************************************************
// // * utils
// // ********************************************************
// // onAuthStateChangedのPromise版Util
// async function _checkAuthState(auth: Auth) {
//   return new Promise<User | null>((resolve, reject) => {
//     // client only
//     if (process.server) return resolve(null);
//     onAuthStateChanged(
//       auth,
//       (user) => resolve(user || null),
//       (error) => reject(error)
//     );
//   });
// }
