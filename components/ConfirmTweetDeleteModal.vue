<script setup lang="ts">
import { useConfirmTweetDelete } from '@/composables/modal'
import { useTweetDelete } from '@/composables/tweetDelete'
import { onKeyStroke, useFocus } from '@vueuse/core'

const { visible, tweetDocId, closeModal } = useConfirmTweetDelete()
const { deleteTweet } = useTweetDelete()

</script>

<template>
    <div
        v-if="visible"
        class="fixed w-full h-full z-20 top-0 left-0 bg-black dark:bg-white bg-opacity-40 dark:bg-opacity-20 flex justify-center overscroll-contain overflow-y-scroll hidden-scrollbar"
        @click="closeModal"
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
            <div class="flex flex-col items-center w-60">
                <span class="text-xl font-bold">ツイートを削除しますか？</span>
                <span class="text-gray-500">この操作は取り消せません。プローフィル、タイムラインからツイートが削除されます。</span>
                <!-- ログアウトボタン -->
                <button
                    class="bg-red-600 hover:opacity-80 dark:hover:opacity-90 border border-red-600 text-white dark:text-gray-200 text-xl font-bold items-center justify-center w-full rounded-full py-2 mt-6"
                    @click="deleteTweet(tweetDocId)"
                >
                    削除
                </button>
                <!-- キャンセルボタン -->
                <button
                    class="hover:bg-black/5 dark:hover:bg-white/10 dark:hover:opacity-90 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 text-xl font-bold items-center justify-center w-full rounded-full py-2 mt-3"
                    @click="closeModal"
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
