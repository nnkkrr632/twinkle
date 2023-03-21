<script setup lang="ts">
import { useAuthByGoogleAccount } from '@/composables/auth'

const { user, googleSignUp } = useAuthByGoogleAccount()
</script>

<template>
    <div v-if="!user" class="px-3 py-4 border dark:border-gray-800 flex flex-col rounded-2xl">
        <div class="text-xl font-extrabold">Twinkleを使ってみよう</div>
        <span class="text-gray-500 text-sm pt-3">今すぐ登録して、タイムラインをカスタマイズしましょう。</span>
        <!-- ログインボタンs -->
        <div class="flex flex-wrap flex-col space-y-3 m-3 text-black">
            <button
                class="bg-white hover:bg-gray-100 border-2 dark:border-gray-800 py-2 flex items-center justify-center rounded-full space-x-2"
                @click="googleSignUp"
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/24px-Google_%22G%22_Logo.svg.png"
                    class="w-5 aspect-square"
                />
                <span>Google で登録 / ログイン</span>
            </button>
        </div>
    </div>
</template>
