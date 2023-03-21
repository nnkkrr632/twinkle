<script setup lang="ts">
defineProps<{ title: string; subTitle?: string }>()
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
            <!-- (3)slot -->
            <div class="h-full flex justify-end flex-1 min-w-max">
                <slot />
            </div>
        </div>
    </header>
</template>
