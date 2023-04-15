import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { useAuthByGoogleAccount } from '@/composables/auth'

// ログインユーザーのみ表示できるページ
export default defineNuxtRouteMiddleware((to, from) => {
    console.log('■■ミドルウェアのauth開始！')
    const { me } = useAuthByGoogleAccount()
    if (me.value) {
        console.log('ミドルウェアのauthで、me.valueがある分岐IN')
        return
    }
    return navigateTo('/')
})
