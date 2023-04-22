import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { useAuthByGoogleAccount } from '@/composables/auth'

// ログインユーザーのみ表示できるページ
export default defineNuxtRouteMiddleware((to, from) => {
    const { me } = useAuthByGoogleAccount()
    if (me.value) {
        return
    }
    return navigateTo('/')
})
