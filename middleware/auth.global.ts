import { defineNuxtRouteMiddleware, navigateTo } from "#imports"
import { useAuthByGoogleAccount } from '@/composables/auth'

export default defineNuxtRouteMiddleware(async () => {
  if (!process.server) {
    // const sleep = (waitTime: number) => new Promise( resolve => setTimeout(resolve, waitTime) )
    // await sleep(1000)

    // const { me } = useAuthByGoogleAccount()
    // console.log('■■■■私はmiddleware/auth.ts。me.value↓')
    // console.log(me.value)
    // if (!me.value) {
    //   console.log('me.value がnull?')
    //   // replaceで遷移
    //   //return await navigateTo('/login', { replace: true })
    // }
  }
})