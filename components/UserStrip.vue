<script setup lang="ts">
import type { User } from '@/composables/types'

const props = defineProps<{ user: User }>()
</script>
<template>
    <!-- アイコンと文字を横並び -->
    <NuxtLink
        :to="`/${props.user.slug}`"
        class="flex flex-row items-center gap-3 px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5"
    >
        <!-- ユーザーアイコン -->
        <div
            class="overflow-hidden"
            :class="props.user.type === 'official' ? 'rounded-md' : 'rounded-full'"
        >
            <img
                v-if="user.iconImageUrl"
                class="w-12 h-12 object-cover"
                :src="user.iconImageUrl"
                alt="ユーザーのアイコン画像"
            />
            <div
                v-else
                class="w-12 h-12 bg-gray-100 dark:bg-gray-900"
            />
        </div>
        <!-- 文字 -->
        <div class="flex flex-col flex-1 items-start">
            <!-- ユーザー名 -->
            <div class="flex items-center gap-1">
                <span class="font-bold line-clamp-1">{{ user.displayName }}</span>
                <span
                    v-if="user.type === 'official'"
                    class="official-badge material-symbols-outlined text-xl text-amber-500/90 pt-[2px] leading-5"
                >verified</span>
            </div>

            <span class="text-gray-500 line-clamp-1">@{{ user.slug }}</span>
        </div>
    </NuxtLink>
</template>

<style scoped lang="scss">
.official-badge {
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}
</style>