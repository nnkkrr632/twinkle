<script setup lang="ts">
import { navigateTo, definePageMeta } from '#imports'
import { useAuthByGoogleAccount } from '@/composables/auth'

definePageMeta({
    middleware: 'auth',
})

const { me, reAuthenticate, reAuthenticated, signOut } = useAuthByGoogleAccount()
const reSignIn = async () => {
    await reAuthenticate()
    if (reAuthenticated.value) {
        navigateTo('/settings/delete')
    } else {
        alert(
            '本人確認に失敗したためログアウトします。\nログインしているGoogleアカウントと異なるGoogleアカウントが指定された可能性があります。'
        )
        signOut()
    }
}
</script>

<template>
    <div v-if="me">
        <div class="pt-3 px-2 h-full flex items-center">
            <!-- (1)矢印 -->
            <div
                class="w-10 h-10 flex justify-center items-center shrink-0 rounded-full cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
                @click="$router.back()"
            >
                <span class="material-symbols-outlined text-2xl">arrow_back</span>
            </div>
            <span class="text-lg font-semibold line-clamp-1 pl-5">アカウントを削除</span>
        </div>
        <!-- アイコン -->
        <NuxtLink :to="`/${me?.slug}`">
            <div class="px-4 flex flex-row items-center my-2 py-2 gap-3 hover:bg-black/5 dark:hover:bg-white/10">
                <!-- ユーザーアイコン -->
                <div class="w-12 h-12 flex justify-center items-center">
                    <img
                        v-if="me.iconImageUrl"
                        class="w-12 h-12 object-cover rounded-full"
                        :src="me.iconImageUrl"
                    />
                    <div
                        v-else
                        class="w-12 h-12 bg-gray-200 dark:bg-gray-900 rounded-full"
                    />
                </div>
                <!-- 文字 -->
                <div class="flex flex-col flex-1 items-start pr-2">
                    <span class="font-bold line-clamp-1">{{ me.displayName }}</span>
                    <span class="line-clamp-1">@{{ me.slug }}</span>
                </div>
            </div>
        </NuxtLink>
        <!-- 注意書き -->
        <p class="px-4 text-lg mb-2">
            再度ログインして本人であることをご確認ください。
        </p>
        <!-- ボタン -->
        <div class="flex flex-wrap flex-col space-y-3 m-3 text-black">
            <button
                class="bg-white hover:bg-gray-100 border-2 dark:border-gray-800 py-2 flex items-center justify-center rounded-full space-x-2"
                @click="reSignIn"
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/24px-Google_%22G%22_Logo.svg.png"
                    class="w-5 aspect-square"
                />
                <span>Google で再度ログイン</span>
            </button>
        </div>
    </div>
</template>
