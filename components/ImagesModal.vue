<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { useImagesModal } from '@/composables/modal'

const { visible, hasLeft, hasRight, closeModal, currentImageUrl, showLeft, showRight } = useImagesModal()

// FIX ME
// 画像モーダル開いていないときでも発火してる
onKeyStroke('ArrowLeft', (e) => {
    showLeft()
})
onKeyStroke('ArrowRight', (e) => {
    showRight()
})
onKeyStroke('Escape', (e) => {
    closeModal()
})
</script>

<template>
    <div
        v-if="visible"
        class="fixed inset-0 z-20 flex justify-center bg-black bg-opacity-80 overscroll-contain overflow-y-scroll hidden-scrollbar"
        @click="closeModal"
    >
        <!-- モーダルコンテンツ -->
        <div class="flex items-center justify-between w-full h-full">
            <!-- 左右ボタンのラッパー 表示位置 & クリックイベント調整用 -->
            <div
                class="z-30 ml-4 rounded-full"
                @click="
                    (event) => {
                        event.stopPropagation()
                    }
                "
            >
                <!-- Left正円 -->
                <div
                    v-show="hasLeft"
                    class="bg-black/50 text-white/80 w-9 h-9 flex justify-center items-center rounded-full cursor-pointer hover:bg-black/30 dark:hover:bg-white/10"
                    @click="showLeft"
                >
                    <span class="material-symbols-outlined text-2xl">arrow_back</span>
                </div>
            </div>

            <!-- 左右ボタンのラッパー 表示位置 & クリックイベント調整用 -->
            <div
                class="z-30 mr-4 rounded-full"
                @click="
                    (event) => {
                        event.stopPropagation()
                    }
                "
            >
                <!-- Right正円 -->
                <div
                    v-show="hasRight"
                    class="bg-black/50 text-white/80 w-9 h-9 flex justify-center items-center rounded-full cursor-pointer hover:bg-black/20 dark:hover:bg-white/10"
                    @click="showRight"
                >
                    <span class="material-symbols-outlined text-2xl">arrow_forward</span>
                </div>
            </div>

            <img
                class="absolute w-full h-full object-contain"
                :src="currentImageUrl"
            />
        </div>
        <!-- スクロール防止 https://qiita.com/yowatsuyoengineer/items/b43b64e1419fa285b758 -->
        <div class="absolute w-20 flex justify-center h-[calc(100vh+0.5px)]" />
    </div>
</template>
