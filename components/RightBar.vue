<script setup lang="ts">
import { useAuthByGoogleAccount } from '@/composables/auth'

const { me } = useAuthByGoogleAccount()
</script>

<template>
    <div class="sticky top-0 hidden lg:flex lg:flex-col lg:space-y-4 w-96 h-screen pl-5 pt-3">
        <!-- <slot /> -->

        <!-- ログインボックス -->
        <LoginBox v-if="!me" />
        <!-- 画像ボックス -->
        <div
            class="w-full aspect-[3/2] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 border dark:border-gray-900"
        >
            <RightBarImageBox />
        </div>
        <!-- 注釈 -->
        <div class="w-full px-4 text-gray-500 text-sm">
            <span>© 2023 Twinkle @nrpans</span>
        </div>
    </div>
</template>
