import { useRuntimeConfig, defineNuxtPlugin } from '#imports'
import { initializeApp } from 'firebase/app'

export default defineNuxtPlugin(() => {
    console.log('plugin/firebase.tsのdefineNuxtPlugin開始。')
    const runtimeConfig = useRuntimeConfig()
    const firebaseConfig = {
        apiKey: runtimeConfig.public.FIREBASE_API_KEY,
        authDomain: runtimeConfig.public.FIREBASE_AUTH_DOMAIN,
        projectId: runtimeConfig.public.FIREBASE_PROJECT_ID,
        storageBucket: runtimeConfig.public.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: runtimeConfig.public.FIREBASE_MESSAGING_SENDER_ID,
        appId: runtimeConfig.public.FIREBASE_APP_ID,
        measurementId: runtimeConfig.public.FIREBASE_MEASUREMENT_ID,
    }
    const app = initializeApp(firebaseConfig)
    // console.log('pluginでapp取得できてる？↓')
    // console.log(app)
})
