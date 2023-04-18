<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { useCreateTweetModal } from '@/composables/modal'
import { useAuthByGoogleAccount } from '@/composables/auth'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const { openModal } = useCreateTweetModal()
const { me } = useAuthByGoogleAccount()
</script>

<template>
    <div class="flex flex-col justify-between h-full">
        <!-- twinkleとツイートボタンは上部 -->
        <div>
            <ul class="flex flex-col gap-3">
                <!-- twinkle -->
                <li class="flex justify-center xl:justify-start">
                    <div
                        id="twinkle-icon"
                        class="flex flex-row items-center rounded-full hover:bg-amber-100 dark:hover:bg-white/10 cursor-pointer"
                        @click="toggleDark()"
                    >
                        <!-- アイコン正円 -->
                        <div class="w-12 h-12 flex justify-center items-center">
                            <span class="material-symbols-outlined text-3xl text-amber-500/90 hover:text-amber-500">auto_awesome</span>
                        </div>
                    </div>
                </li>
                <!-- ホーム -->
                <li class="flex justify-center xl:justify-start">
                    <NuxtLink
                        to="/"
                        class="rounded-full hover:bg-black/5 dark:hover:bg-white/10 xl:w-full"
                    >
                        <!-- アイコンと文字を横並び -->
                        <div class="flex flex-row items-center">
                            <!-- アイコン正円 -->
                            <div class="w-12 h-12 flex justify-center items-center">
                                <span class="material-symbols-outlined text-3xl">home</span>
                            </div>
                            <span class="hidden xl:block px-3 text-xl">ホーム</span>
                        </div>
                    </NuxtLink>
                </li>
                <!-- プロフィール -->
                <li
                    v-if="me"
                    class="flex justify-center xl:justify-start"
                >
                    <NuxtLink
                        :to="`/${me.slug}`"
                        class="rounded-full hover:bg-black/5 dark:hover:bg-white/10 xl:w-full"
                    >
                        <!-- アイコンと文字を横並び -->
                        <div class="flex flex-row items-center">
                            <!-- アイコン正円 -->
                            <div class="w-12 h-12 flex justify-center items-center">
                                <span class="material-symbols-outlined text-3xl">person</span>
                            </div>
                            <span class="hidden xl:block px-3 text-xl">プロフィール</span>
                        </div>
                    </NuxtLink>
                </li>
                <!-- 設定 -->
                <li v-if="me" class="flex justify-center xl:justify-start">
                    <NuxtLink
                        to="/settings"
                        class="rounded-full hover:bg-black/5 dark:hover:bg-white/10 xl:w-full"
                    >
                        <!-- アイコンと文字を横並び -->
                        <div class="flex flex-row items-center">
                            <!-- アイコン正円 -->
                            <div class="w-12 h-12 flex justify-center items-center">
                                <span class="material-symbols-outlined text-3xl">settings</span>
                            </div>
                            <span class="hidden xl:block px-3 text-xl">設定</span>
                        </div>
                    </NuxtLink>
                </li>
            </ul>
            <!-- ツイートセクション -->
            <div
                v-if="me"
                class="mt-4 flex justify-center items-center text-white"
            >
                <!-- アイコン正円 -->
                <button
                    class="xl:hidden bg-amber-500/90 w-[52px] h-[52px] flex justify-center items-center rounded-full hover:bg-amber-500"
                    @click="openModal"
                >
                    <span class="material-symbols-outlined text-3xl">auto_fix</span>
                </button>
                <button
                    class="hidden xl:flex items-center justify-center text-xl bg-amber-500/90 w-full h-[52px] rounded-full hover:bg-amber-500"
                    @click="openModal"
                >
                    ツイートする
                </button>
            </div>
        </div>
        <!-- ログアウト -->
        <LogoutButton />
    </div>
</template>

<style scoped lang="scss">
#twinkle-icon {
    .material-symbols-outlined {
        font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
    }
}

.router-link-active {
    font-weight: 700;

    .material-symbols-outlined {
        font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
    }
}
</style>
