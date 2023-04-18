<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { useCreateTweetModal } from '@/composables/modal'
import { useAuthByGoogleAccount } from '@/composables/auth'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const { openModal } = useCreateTweetModal()
const { me, googleSignUp } = useAuthByGoogleAccount()
</script>
<template>
    <!-- ログインセクション -->
    <section v-if="!me" class="flex justify-center w-full border-t dark:border-gray-800 py-[2px]">
        <button class="flex items-center gap-2 justify-center py-1 w-full" @click="googleSignUp">
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/24px-Google_%22G%22_Logo.svg.png"
                class="w-5 aspect-square"
            />
            <span class="dark:text-white text-sm">Google で登録 / ログイン</span>
        </button>
    </section>

    <ul class="w-full h-14 flex items-center border-t dark:border-gray-800">
        <!-- ホーム -->
        <li class="flex justify-center w-full h-full">
            <NuxtLink to="/" class="w-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10">
                <span class="material-symbols-outlined text-3xl">home</span>
            </NuxtLink>
        </li>
        <!-- プロフィール -->
        <li v-if="me" class="flex justify-center w-full h-full">
            <NuxtLink
                :to="`/${me.slug}`"
                class="w-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10"
            >
                <span class="material-symbols-outlined text-3xl">person</span>
            </NuxtLink>
        </li>
        <!-- 設定 -->
        <li v-if="me" class="flex justify-center w-full h-full">
            <NuxtLink
                to="/settings"
                class="w-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10"
            >
                <span class="material-symbols-outlined text-3xl">settings</span>
            </NuxtLink>
        </li>
        <!-- twinkle -->
        <li class="flex justify-center w-full h-full">
            <div
                id="twinkle-icon"
                class="w-full flex items-center justify-center hover:bg-amber-100/10 dark:hover:bg-white/10 cursor-pointer"
                @click="toggleDark()"
            >
                <span class="material-symbols-outlined text-3xl text-amber-500/90 hover:text-amber-500"
                    >auto_awesome</span
                >
            </div>
        </li>
    </ul>
</template>
