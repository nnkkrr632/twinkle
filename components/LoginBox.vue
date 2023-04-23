<script setup lang="ts">
import { ref } from '#imports'
import { useAuthByGoogleAccount } from '@/composables/auth'

const { googleSignUp } = useAuthByGoogleAccount()
const googleButton = ref<string>('/images/btn_google_signin_light_normal_web@2x.png')
const googleSignUpWithOfficialButton = async () => {
    googleButton.value = '/images/btn_google_signin_light_pressed_web@2x.png'
    await googleSignUp()
    googleButton.value = '/images/btn_google_signin_light_normal_web@2x.png'
}
</script>

<template>
    <div class="px-3 py-4 border dark:border-gray-800 flex flex-col rounded-2xl">
        <div class="text-xl font-extrabold">
            Twinkleを使ってみよう
        </div>
        <span class="text-gray-500 text-sm pt-3">今すぐ登録して、タイムラインをカスタマイズしましょう。</span>
        <div class="flex justify-center items-center">
            <img
                :src="googleButton"
                alt="Googleで登録/ログイン"
                class="h-12 mt-2 mb-1 object-contain cursor-pointer"
                @click="googleSignUpWithOfficialButton"
            />
        </div>
    </div>
</template>
