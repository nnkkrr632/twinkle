import { useRuntimeConfig } from '#imports'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

export const useMyFirebase = () => {
    console.log('私はcomposables/firebase.ts。runtimeConfigを取得しました')
    const runtimeConfig = useRuntimeConfig()
    const firebaseConfig = {
        apiKey: runtimeConfig.public.FIREBASE_API_KEY,
        authDomain: runtimeConfig.public.FIREBASE_AUTH_DOMAIN,
        projectId: runtimeConfig.public.FIREBASE_PROJECT_ID,
        storageBucket: runtimeConfig.public.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: runtimeConfig.public.FIREBASE_MESSAGING_SENDER_ID,
        appId: runtimeConfig.public.FIREBASE_APP_ID,
        measurementId: runtimeConfig.public.FIREBASE_MEASUREMENT_ID,

        // apiKey: process.env.FIREBASE_API_KEY,
        // authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        // projectId: process.env.FIREBASE_PROJECT_ID,
        // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        // messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        // appId: process.env.FIREBASE_APP_ID,
        // measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    }
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const storage = getStorage(app)
    // const auth = getAuth(app)
    return { app, db, storage }
}
