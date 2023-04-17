<script setup lang="ts">
import { definePageMeta } from '#imports'

definePageMeta({
    middleware: 'auth',
})
</script>
<template>
    <h1 class="text-xl font-bold px-3 py-3 pb-2">
        設定
    </h1>
    <ul class="flex flex-col">
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
