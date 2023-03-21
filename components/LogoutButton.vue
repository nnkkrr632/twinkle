<script setup lang="ts">
import { useAuthByGoogleAccount } from '@/composables/auth'
console.log('私はLogoutLink.vue。useAuthByGoogleAccountをログアウトリンク表示するか否か切り替えるためにimport')

const { user, googleSignUp, signOut, setAuthUserWhenAUthStateChanged } = useAuthByGoogleAccount()
// script setup直下はVue2のcreated()に相当
await setAuthUserWhenAUthStateChanged()
</script>

<template>
    <div class="w-20 h-20 bg-red-400 cursor-pointer" @click="googleSignUp">サインイン</div>
    <div class="w-20 h-20 bg-blue-400 cursor-pointer" @click="signOut">サインアウト</div>

    <div>
        user.valueの表示↓
        {{ user }}
    </div>
    <div v-if="user" class="flex justify-center xl:justify-start my-5">
        <NuxtLink to="logout" class="rounded-full hover:bg-black/5 dark:hover:bg-white/10 xl:w-full">
            <!-- アイコンと文字を横並び -->
            <div class="flex flex-row items-center">
                <!-- ユーザーアイコン -->
                <div class="w-16 h-16 flex justify-center items-center">
                    <img class="w-12 h-12 object-cover rounded-full" :src="user.iconImageUrl" />
                </div>
                <!-- 文字 -->
                <div class="hidden xl:flex flex-col flex-1 items-start pr-2">
                    <span class="font-bold line-clamp-1">{{ user.displayName }}</span>
                    <span class="line-clamp-1">@{{ user.slug }}</span>
                </div>
            </div>
        </NuxtLink>
    </div>
</template>
