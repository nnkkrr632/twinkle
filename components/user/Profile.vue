<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { User } from '~/composables/types'
import { useImagesModal } from '~/composables/modal'

const { setImages } = useImagesModal()

const isDark = useDark()
const textColor = ref(isDark.value ? 'rgb(229 231 235)' : 'rgb(31 41 55)')
watch(isDark, () => {
    textColor.value = isDark.value ? 'rgb(229 231 235)' : 'rgb(31 41 55)'
})

// これがなぜだめなのかわからない。<>の中のkeyに親コンポーネントで渡す変数名がないとだめ？
// const user = defineProps<User>();
// {{ user.displayName }}
//これならいける
const props = defineProps<{ user: User }>()
// どちらも表示される謎
// {{ props.user.displayName }}
// {{ user.displayName }}

// console.log('わたしはuser.vueコンポーネント')
// console.log('props.user↓')
// console.log(props.user)
</script>
<template>
    <div>
        <!-- 画像部 -->
        <div class="relative">
            <!-- ユーザーヘッダー画像 -->
            <div class="w-full aspect-[3/1] bg-gray-300 dark:bg-gray-800">
                <img
                    v-if="user.headerImageUrl"
                    :src="user.headerImageUrl"
                    class="w-full h-full object-cover cursor-pointer"
                    alt="ユーザーのヘッダー画像"
                    @click="setImages([user.headerImageUrl], 0)"
                />
            </div>
            <!-- ユーザーアイコン画像 -->
            <div class="w-1/4 aspect-square min-w-[3rem] absolute top-[62%] left-[1rem]">
                <img
                    v-if="user.iconImageUrl"
                    :src="user.iconImageUrl"
                    class="h-full w-full object-cover cursor-pointer border-2 xs:border-4 border-white dark:border-black"
                    :class="user.userType === 'official' ? 'rounded-lg' : 'rounded-full'"
                    alt="ユーザーのアイコン画像"
                    @click="setImages([user.iconImageUrl], 0)"
                />
                <div
                    v-else
                    class="bg-gray-200 dark:bg-gray-900 h-full w-full object-cover rounded-full border-[3px] border-white dark:border-black"
                />
            </div>
        </div>
        <!--テキストセクション -->
        <div class="pt-3 px-4 pb-4 flex flex-col">
            <!-- プロフィールを編集 -->
            <div class="flex justify-end pb-[3%] xs:pb-[6%]">
                <button
                    class="px-4 py-1 font-semibold border border-gray-300 dark:border-gray-500 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
                >
                    プロフィールを編集
                </button>
            </div>
            <!-- ユーザー名 -->
            <div class="flex items-center">
                <span class="text-xl font-bold mr-1">{{ user.displayName }}</span>
                <span
                    v-if="user.userType === 'official'"
                    class="official-badge material-symbols-outlined text-xl text-amber-500/90 pt-[2px]"
                    >verified</span
                >
            </div>
            <!-- ユーザーID -->
            <div class="-mt-1">
                <span class="text-gray-500">@{{ user.slug }}</span>
            </div>
            <div class="mt-3 mb-4">
                <span>{{ user.description }}</span>
            </div>
            <!-- 場所とリンクと開始日のflex -->
            <div class="flex flex-wrap items-center text-sm text-gray-500 mb-2">
                <!-- 場所 -->
                <div class="flex items-center mr-4">
                    <span class="material-symbols-outlined text-xl mr-[2px]">location_on</span>
                    <span>{{ user.place }}</span>
                </div>
                <!-- リンク -->
                <a :href="user.link" target="_blank" class="flex items-center mr-4">
                    <span class="material-symbols-outlined text-xl mr-[2px]">link</span>
                    <span class="text-blue-400 hover:border-b hover:border-blue-400 h-5">{{ user.link }}</span>
                </a>
                <!-- 開始日 -->
                <div class="flex items-center">
                    <span class="material-symbols-outlined text-xl mr-[2px]">calendar_month</span>
                    <span>{{ user.formattedCreatedAt }}からTwinkleを利用しています</span>
                </div>
            </div>
            <div class="flex flex-wrap h-6">
                <NuxtLink
                    to="/taro/followings"
                    class="mr-5 hover:border-b hover:border-gray-700 dark:hover:border-gray-200 h-5"
                >
                    <span class="font-bold mr-1">{{ user.followingsCount }}</span
                    ><span class="text-gray-500">フォロー中</span>
                </NuxtLink>
                <NuxtLink
                    to="/taro/followers"
                    class="mr-5 hover:border-b hover:border-gray-700 dark:hover:border-gray-200 h-5"
                >
                    <span class="font-bold mr-1">{{ user.followersCount }}</span
                    ><span class="text-gray-500">フォロワー</span>
                </NuxtLink>
            </div>
        </div>
        <!-- Nav -->
        <nav class="border-b dark:border-gray-800">
            <ul class="flex justify-between h-[52px]">
                <li class="w-full flex justify-center hover:bg-black/5 dark:hover:bg-white/10">
                    <NuxtLink :to="`${user.slug}`" class="w-full flex justify-center">
                        <div class="flex flex-col justify-between">
                            <div class="link-text h-full flex items-center text-gray-500 px-2">
                                <div class="flex flex-wrap justify-center">
                                    <span>ツイート</span>
                                </div>
                            </div>
                            <span class="underline" />
                        </div>
                    </NuxtLink>
                </li>
                <li class="w-full flex justify-center hover:bg-black/5 dark:hover:bg-white/10">
                    <NuxtLink :to="`${user.slug}/with-replies`" class="w-full flex justify-center">
                        <div class="flex flex-col justify-between">
                            <div class="link-text h-full flex items-center text-gray-500 px-2">
                                <div class="flex flex-wrap justify-center">
                                    <span>ツイートと</span>
                                    <span>返信</span>
                                </div>
                            </div>
                            <span class="underline" />
                        </div>
                    </NuxtLink>
                </li>
                <li class="w-full flex justify-center hover:bg-black/5 dark:hover:bg-white/10">
                    <NuxtLink :to="`${user.slug}/media`" class="w-full flex justify-center">
                        <div class="flex flex-col justify-between">
                            <div class="link-text h-full flex items-center text-gray-500 px-2">
                                <div class="flex flex-wrap justify-center">
                                    <span>メディア</span>
                                </div>
                            </div>
                            <span class="underline" />
                        </div>
                    </NuxtLink>
                </li>
                <li class="w-full flex justify-center hover:bg-black/5 dark:hover:bg-white/10">
                    <NuxtLink :to="`${user.slug}/likes`" class="w-full flex justify-center">
                        <div class="flex flex-col justify-between">
                            <div class="link-text h-full flex items-center text-gray-500 px-2">
                                <div class="flex flex-wrap justify-center">
                                    <span>いいね</span>
                                </div>
                            </div>
                            <span class="underline" />
                        </div>
                    </NuxtLink>
                </li>
            </ul>
        </nav>
    </div>
</template>

<style scoped lang="scss">
.official-badge {
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}
.underline {
    border: 3px solid rgb(0, 0, 0, 0);
    border-radius: 9999px;
    opacity: 0.9;
}
.router-link-active {
    .link-text {
        font-weight: 700;
        color: v-bind(textColor);
    }
    .underline {
        border-color: rgb(245 158 11);
    }
}
</style>
