<script setup lang="ts">
import { useAuthByGoogleAccount } from '@/composables/auth'

const { me } = useAuthByGoogleAccount()

defineProps<{ title: string; subTitle?: string }>()
const route = useRoute()
console.log('ru-to')
console.log(route.name)
console.log(route.params)
console.log(route.path)
console.log(route.fullPath)
console.log(me.value)
</script>

<template>
    <header class="z-10 sticky top-0 w-full h-12 backdrop-blur-sm bg-white/50 dark:bg-black/50">
        <!-- (1)矢印 (2)タイトル&サブタイトル (3)スロット のflex -->
        <div class="px-3 h-full flex items-center">
            <!-- (1)矢印 -->
            <div
                class="w-10 h-10 flex justify-center items-center shrink-0 rounded-full cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
                @click="$router.back()"
            >
                <span class="material-symbols-outlined text-2xl">arrow_back</span>
            </div>
            <!-- (2)タイトル&サブタイトル -->
            <div class="flex flex-col pl-2">
                <span class="text-lg font-semibold line-clamp-1">{{ title }}</span>
                <span
                    v-if="subTitle"
                    class="text-sm line-clamp-1"
                >{{ subTitle }}</span>
            </div>
            <!-- ログインしている場合はフォローボタンを表示 -->
            <div
                v-if="me"
                class="h-full flex items-center justify-end flex-1 min-w-max"
            >
                <div v-if="me.slug === $route.params.userSlug" />
                <div
                    v-else
                    class="bg-black dark:bg-white px-5 py-1 rounded-full text-gray-200 dark:text-gray-700 font-semibold hover:opacity-80 dark:hover:opacity-90 cursor-pointer"
                >
                    フォロー
                </div>
            </div>
        </div>
    </header>
</template>
