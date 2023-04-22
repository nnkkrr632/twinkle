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
    <!-- ツイート -->
    <section
        v-if="me"
        class="flex justify-end m-5"
    >
        <!-- アイコン正円 -->
        <button
            class="xl:hidden bg-amber-500/90 w-[52px] h-[52px] flex justify-center items-center rounded-full hover:bg-amber-500 backdrop-blur-sm"
            @click="openModal"
        >
            <span class="material-symbols-outlined text-3xl text-white">auto_fix</span>
        </button>
    </section>

    <ul
        class="bg-white/50 dark:bg-black/50 w-full h-14 flex items-center backdrop-blur-sm backdrop-grayscale"
        :class="me && me.value? 'border-t dark:border-gray-800' : ''"
    >
        <!-- ホーム -->
        <li class="flex justify-center w-full h-full">
            <NuxtLink
                to="/"
                class="w-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10"
            >
                <span class="material-symbols-outlined text-3xl">home</span>
            </NuxtLink>
        </li>
        <!-- プロフィール -->
        <li
            v-if="me"
            class="flex justify-center w-full h-full"
        >
            <NuxtLink
                :to="`/${me.slug}`"
                class="w-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10"
            >
                <span class="material-symbols-outlined text-3xl">person</span>
            </NuxtLink>
        </li>
        <!-- 設定 -->
        <li
            v-if="me"
            class="flex justify-center w-full h-full"
        >
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
                <span class="material-symbols-outlined text-3xl text-amber-500/90 hover:text-amber-500">auto_awesome</span>
            </div>
        </li>
    </ul>
</template>
