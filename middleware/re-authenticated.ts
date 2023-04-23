import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { useAuthByGoogleAccount } from '@/composables/auth'

// URI: /delete は再ログイン後であることを確認する
export default defineNuxtRouteMiddleware((to, from) => {
    const { me, reAuthenticated } = useAuthByGoogleAccount()
    if (me.value && reAuthenticated.value) {
        return
    }
    return navigateTo('/')
})
