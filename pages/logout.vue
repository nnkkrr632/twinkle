<script setup lang="ts">
import { useAuthByGoogleAccount } from '@/composables/auth'
const { signOut } = useAuthByGoogleAccount()
</script>

<template>
    <div
        class="fixed w-full h-full z-20 top-0 left-0 bg-black dark:bg-white dark:bg-opacity-20 bg-opacity-40 flex justify-center overscroll-contain overflow-y-scroll hidden-scrollbar"
        @click="$router.back()"
    >
        <!-- モーダルコンテンツ -->
        <div
            class="bg-white dark:bg-black h-max opacity-100 mt-20 rounded-2xl px-8 py-6 z-30"
            @click="
                (event) => {
                    event.stopPropagation()
                }
            "
        >
            <div class="flex flex-col items-center">
                <!-- twinkle正円 -->
                <div class="w-12 h-12 flex justify-center items-center">
                    <span id="modal-twinkle-icon" class="material-symbols-outlined text-3xl text-amber-500/90"
                        >auto_awesome</span
                    >
                </div>
                <span class="text-xl font-bold">Twinkleからログアウトしますか？</span>
                <span class="text-gray-500">いつでもログインし直すことができます。</span>
                <!-- ログアウトボタン -->
                <button
                    class="bg-black dark:bg-white hover:opacity-80 dark:hover:opacity-90 border border-gray-300 dark:border-gray-500 text-gray-200 dark:text-gray-700 text-xl font-bold items-center justify-center w-full rounded-full py-2 mt-6"
                    @click="signOut"
                >
                    ログアウト
                </button>
                <!-- キャンセルボタン -->
                <button
                    class="hover:bg-black/5 dark:hover:bg-white/10 dark:hover:opacity-90 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 text-xl font-bold items-center justify-center w-full rounded-full py-2 mt-3"
                    @click="$router.back()"
                >
                    キャンセル
                </button>
            </div>
        </div>
        <!-- スクロール防止 https://qiita.com/yowatsuyoengineer/items/b43b64e1419fa285b758 -->
        <div class="absolute w-20 h-[calc(100vh+0.5px)]" />
    </div>
</template>

<style scoped lang="scss">
.material-symbols-outlined {
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}
</style>
