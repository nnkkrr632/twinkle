<script setup lang="ts">
import { ref } from '#imports'
import { useCreateTweet } from '@/composables/tweetCreate'
import { useCreateTweetModal } from '@/composables/modal'
import { useAuthByGoogleAccount } from '@/composables/auth'
import { onKeyStroke, useFocus } from '@vueuse/core'

const { tweetDraft, deselectImage, selectImages, isValidTweet, maxTextCount, tweet } = useCreateTweet()
const { visible, closeModal } = useCreateTweetModal()
const { me } = useAuthByGoogleAccount()

const tweetDraftTextarea = ref()
useFocus(tweetDraftTextarea, { initialValue: true })

onKeyStroke('Escape', (e) => {
    closeModal()
})

const tweetButtonText = ref<string>('ツイートする')
const tweetAndCloseModal = async () => {
    tweetButtonText.value = '...ツイート中'
    await tweet()
    closeModal()
    tweetButtonText.value = 'ツイートする'
}
</script>

<template>
    <div
        v-if="visible && me"
        class="fixed inset-0 z-20 bg-black dark:bg-white bg-opacity-40 dark:bg-opacity-20 flex justify-center overscroll-contain overflow-y-scroll hidden-scrollbar"
        @click="closeModal"
    >
        <!-- モーダルコンテンツ -->
        <div
            class="bg-white dark:bg-black w-[37rem] h-screen xs:h-max opacity-100 xs:mt-20 xs:rounded-2xl px-4 py-3 z-30"
            @click="
                (event) => {
                    event.stopPropagation()
                }
            "
        >
            <!-- ×ボタン正円 -->
            <div
                class="w-10 h-10 flex justify-center items-center rounded-full cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
                @click="closeModal"
            >
                <span class="material-symbols-outlined text-2xl">close</span>
            </div>
            <!-- アイコン正円と入力部分のflex -->
            <div class="flex gap-3 mt-3">
                <!-- アイコン正円 -->
                <div
                    class="w-[52px] h-[52px] flex justify-center items-center rounded-full overflow-hidden bg-gray-100 dark:bg-gray-900"
                >
                    <img
                        v-if="me.iconImageUrl"
                        class="h-full w-full object-cover"
                        :src="me.iconImageUrl"
                    />
                </div>
                <!-- 入力部分の縦flex -->
                <div class="flex flex-col flex-1">
                    <!-- 縦flex(1) 本文 -->
                    <textarea
                        ref="tweetDraftTextarea"
                        v-model="tweetDraft.body"
                        placeholder="いまどうしてる？"
                        class="h-48 text-xl resize-none outline-none dark:bg-black"
                    />
                    <!-- 縦flex(2) 画像プレビュー -->
                    <div
                        v-show="tweetDraft.images.length"
                        class="grid gap-2"
                        :class="tweetDraft.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'"
                    >
                        <div
                            v-for="(imageUrl, index) of tweetDraft.imagePreviewUrls"
                            :key="index"
                            class="relative"
                            :class="tweetDraft.images.length < 3 ? 'h-72' : 'h-36'"
                        >
                            <!-- ×ボタン正円 -->
                            <button
                                class="absolute top-1 left-1 w-8 h-8 flex justify-center items-center rounded-full bg-black opacity-60 hover:opacity-40"
                                @click="deselectImage(index)"
                            >
                                <span class="material-symbols-outlined text-xl text-white/90">close</span>
                            </button>
                            <img
                                :src="imageUrl"
                                class="w-full h-full object-cover rounded-2xl"
                            />
                        </div>
                    </div>
                    <!-- 縦flex(3) ツイートは全体公開されます -->
                    <div class="flex items-center gap-1 p-2 text-sm text-amber-500/90 font-semibold">
                        <span class="material-symbols-outlined text-xl">public</span>
                        <span>ツイートは全体公開されます</span>
                    </div>
                    <!-- 縦flex(4) 画像&ツイートボタン -->
                    <div class="pt-4 flex justify-between items-center border-t dark:border-gray-800">
                        <label>
                            <!-- 画像ボタン正円 -->
                            <div
                                class="w-8 h-8 flex justify-center items-center rounded-full cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
                                :class="tweetDraft.images.length > 3 ? 'opacity-30 cursor-default' : ''"
                                title="メディア"
                            >
                                <span class="material-symbols-outlined text-xl text-amber-500/90">image</span>
                            </div>
                            <input
                                type="file"
                                accept="image/jpg, image/jpeg, image/png, image/gif, image/webp"
                                multiple
                                name="tweetImage"
                                class="hidden"
                                :disabled="tweetDraft.images.length > 3"
                                @change="selectImages"
                            />
                        </label>
                        <div class="flex justify-end items-center gap-3">
                            <div>
                                <span v-if="tweetDraft.body.length === 0">0</span>
                                <span
                                    v-else
                                    :class="tweetDraft.body.length <= maxTextCount ? 'text-amber-500/90' : 'text-red-500/90'"
                                >{{ tweetDraft.body.length }}</span>
                                /{{ maxTextCount }}
                            </div>
                            <button
                                class="px-4 py-1 text-white text-base bg-amber-500/90 rounded-full"
                                :class="!isValidTweet ? 'opacity-30' : 'hover:bg-amber-500'"
                                :disabled="!isValidTweet"
                                @click="tweetAndCloseModal"
                            >
                                {{ tweetButtonText }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- スクロール防止 https://qiita.com/yowatsuyoengineer/items/b43b64e1419fa285b758 -->
        <div class="absolute w-20 h-[calc(100vh+0.5px)]" />
    </div>
</template>
