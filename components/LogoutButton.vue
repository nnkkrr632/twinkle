<script setup lang="ts">
import { useAuthByGoogleAccount } from '@/composables/auth'

const { me, setAuthUserWhenAUthStateChanged } = useAuthByGoogleAccount()
// script setup直下はVue2のcreated()に相当
await setAuthUserWhenAUthStateChanged()
</script>

<template>
    <div
        v-if="me"
        class="flex justify-center xl:justify-start my-5"
    >
        <NuxtLink
            to="/logout"
            class="rounded-full hover:bg-black/5 dark:hover:bg-white/10 xl:w-full"
        >
            <!-- アイコンと文字を横並び -->
            <div class="flex flex-row items-center">
                <!-- ユーザーアイコン -->
                <div class="w-16 h-16 flex justify-center items-center">
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
                <div class="hidden xl:flex flex-col flex-1 items-start pr-2">
                    <div class="flex items-center gap-1">
                        <span class="font-bold line-clamp-1">{{ me.displayName }}</span>
                        <span
                            v-if="me.type === 'official'"
                            class="official-badge material-symbols-outlined text-xl text-amber-500/90 pt-[2px] leading-5"
                        >verified</span>
                    </div>
                    <span class="line-clamp-1">@{{ me.slug }}</span>
                </div>
            </div>
        </NuxtLink>
    </div>
</template>

<style scoped lang="scss">
.official-badge {
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}
</style>