<script setup lang="ts">
import { useAuthByGoogleAccount } from '@/composables/auth'
import { useUserAll } from '@/composables/userAll'
const { me } = useAuthByGoogleAccount()
const { users } = useUserAll()
</script>

<template>
    <div class="sticky top-0 hidden lg:flex lg:flex-col lg:gap-4 w-96 h-screen pl-5 pt-3">
        <!-- <slot /> -->

        <!-- ログインボックス -->
        <LoginBox v-if="!me" />
        <!-- 画像ボックス -->
        <div
            class="w-full aspect-[3/2] rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 border dark:border-gray-900"
        >
            <RightBarImageBox />
        </div>
        <!-- おすすめツイート 6人からoverflow:scrollになる-->
        <div v-if="users && users.length" class="bg-gray-200 dark:bg-gray-800 flex flex-col rounded-2xl max-h-[416px] overflow-y-auto">
            <p class="text-2xl font-bold px-4 py-3">おすすめツイート</p>
            <div v-for="user of users" :key="user.slug">
                <UserStrip :user="user" />
            </div>
        </div>
        <!-- 注釈 -->
        <div class="w-full px-4 text-gray-500 text-sm flex flex-col">
            <span>© 2023 Twinkle @nrpans</span>
            <span>・GitHub: https://github.com/nnkkrr632/twinkle</span>
            <span>・NuxtとFirebaseの学習のために作成した個人用サイトです。予告なくアカウントやデータを削除する場合がございます。</span>
            <NuxtLink class="block hover:underline" to="/aaaaa">存在しないユーザーIDテスト：/aaaaa</NuxtLink>
            <NuxtLink class="block hover:underline" to="/settings/aaa">存在しないURLテスト：/settings/aaa</NuxtLink>
        </div>
    </div>
</template>
