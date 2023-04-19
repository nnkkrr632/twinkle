<script setup lang="ts">
import { definePageMeta, useHead } from '#imports'

definePageMeta({
    middleware: 'auth',
})

// SEO 上書きするものだけ定義
useHead({
    title: '設定 / Twinkle',
    meta: [{property: 'robots', content: 'noindex'}],
})

</script>
<template>
    <h1 class="text-xl font-bold px-3 py-3 pb-2">
        設定
    </h1>
    <ul class="flex flex-col">
        <!-- SPビューのログアウトは/settings から行う -->
        <li class="flex xs:hidden">
            <NuxtLink
                to="/logout"
                class="hover:bg-black/5 dark:hover:bg-white/10 w-full"
            >
                <div class="flex justify-between items-center py-2">
                    <div class="flex items-center">
                        <!-- アイコン正円 -->
                        <div class="w-12 h-12 flex justify-center items-center">
                            <span class="material-symbols-outlined text-xl">logout</span>
                        </div>
                        <div class="flex flex-col px-3">
                            <span class="">ログアウト</span>
                            <span class="text-sm text-gray-500">ログアウトページに移動します。</span>
                        </div>
                    </div>
                    <div class="w-12 h-12 flex justify-center items-center">
                        <span class="material-symbols-outlined text-xl">chevron_right</span>
                    </div>
                </div>
            </NuxtLink>
        </li>
        <li class="flex">
            <NuxtLink
                to="/settings/re-sign-in"
                class="hover:bg-black/5 dark:hover:bg-white/10 w-full"
            >
                <div class="flex justify-between items-center py-2">
                    <div class="flex items-center">
                        <!-- アイコン正円 -->
                        <div class="w-12 h-12 flex justify-center items-center">
                            <span class="material-symbols-outlined text-xl">heart_broken</span>
                        </div>
                        <div class="flex flex-col px-3">
                            <span class="">アカウント削除</span>
                            <span class="text-sm text-gray-500">アカウントを削除する方法について説明します。</span>
                        </div>
                    </div>
                    <div class="w-12 h-12 flex justify-center items-center">
                        <span class="material-symbols-outlined text-xl">chevron_right</span>
                    </div>
                </div>
            </NuxtLink>
        </li>
    </ul>
</template>