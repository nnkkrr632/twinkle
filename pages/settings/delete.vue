<script setup lang="ts">
import { definePageMeta, ref, useHead } from '#imports'
import { useAuthByGoogleAccount } from '@/composables/auth'
import { useAccountDelete } from '@/composables/accountDelete'

definePageMeta({
    middleware: 're-authenticated',
})

const { me } = useAuthByGoogleAccount()
const { deleteAccount } = useAccountDelete()

const deleteButtonText = ref<string>('アカウント削除')
const succeeded = ref<boolean>(false)
const tryDeleteAccount = async () => {
    deleteButtonText.value = '...アカウントを削除中'
    succeeded.value = await deleteAccount()
    deleteButtonText.value = 'アカウントを削除'
}

useHead({
    title: 'アカウントを削除 / Twinkle',
    meta: [{property: 'robots', content: 'noindex'}],
})
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
                        class="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full"
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
            アカウントが削除されます
        </p>
        <div class="flex flex-col text-gray-500 text-sm">
            <p class="px-4 border-b dark:border-gray-800 py-2">
                アカウントの削除は取り消せません。
            </p>
            <p class="px-4 border-b dark:border-gray-800 py-2">
                GoogleやBingなどの検索エンジンに一部のアカウント情報が残っている場合があります。
            </p>
        </div>
        <!-- ボタン -->
        <div class="flex justify-end p-4">
            <button
                class="font-semibold text-white px-4 py-[6px] rounded-full bg-red-500/90 hover:bg-red-500"
                @click="tryDeleteAccount"
            >
                {{ deleteButtonText }}
            </button>
        </div>
    </div>
    <div
        v-if="succeeded"
        class="p-3 flex flex-col gap-4"
    >
        <h1 class="text-lg font-bold">
            削除済み
        </h1>
        <p class="text-lg font-bold">
            アカウントが削除されました
        </p>
        <p class="text-gray-500 text-sm">
            ご利用ありがとうございました。 #GoodBye
        </p>
    </div>
</template>
