<script setup lang="ts">
import { useRoute } from '#imports'
import type { Tweet } from '@/composables/types'
import { useImagesModal } from '@/composables/modal'
import { useLikes } from '@/composables/likes'

const { likeTweetDocIds, isTweetLikedByMe } = useLikes()
console.log('Tweet.vue')
console.log(likeTweetDocIds.value)

// const { me } = useAuthByGoogleAccount()
// console.log('■■script setup■■me.value↓')
// console.log(me.value)


const { setImages } = useImagesModal()
const route = useRoute()
const props = defineProps<{ tweet: Tweet }>()
onMounted( () => {
console.log('Tweet.vueのonMounted()')
console.log(likeTweetDocIds.value)
})

// FIXME ツイートをmeがRT・いいねしたか判定する苦肉の策(CSR)
// サイトのメインコンテンツであるツイート(tweet.vue)ごと<ClientOnly>するわけにはいかない
const isLiked = ref(true)
// onMounted( async () => {
//     // 少し待たないと me.value がnullになる苦肉の策

//     const { me } = useAuthByGoogleAccount()
//     await sleep(2000)
//     console.log('Tweet.vueのonMounted()開始。↓')
//     console.log('■■onMounted■■me.value↓')
//     console.log(me.value)
//     console.log(me)

//     if(me.value) {
//         isLiked.value = false
//     }
//   })

</script>

<template>
    <div class="block border-b dark:border-gray-800 px-4 py-3 hover:bg-gray-400/5 dark:hover:bg-white/5">
        <!-- アイコンと文章のフレックス -->
        <div class="flex">
            <div class="pr-3">
                <NuxtLink
                    :to="`/${tweet.userInfo.slug}`"
                    class="rounded-full hover:bg-black/5 dark:hover:bg-white/10 xl:w-full"
                >
                    <!-- ユーザーアイコン -->
                    <div class="w-12 h-12 flex justify-center items-center">
                        <img
                            class="h-full w-full object-cover"
                            :class="tweet.userInfo.userType === 'official' ? 'rounded-md' : 'rounded-full'"
                            :src="tweet.userInfo.iconImageUrl"
                        />
                    </div>
                </NuxtLink>
            </div>
            <!-- 文章 -->
            <div class="flex flex-col flex-1">
                <!-- 1行目 -->
                <div class="flex items-center h-7">
                    <NuxtLink
                        :to="`/${tweet.userInfo.slug}`"
                        class="hover:border-gray-700 dark:hover:border-gray-200 hover:border-b h-6"
                    >
                        <span class="font-bold text-lg line-clamp-1">{{ tweet.userInfo.displayName }}</span>
                    </NuxtLink>
                    <!-- バッジ -->
                    <span
                        v-if="tweet.userInfo.userType === 'official'"
                        class="official-badge material-symbols-outlined text-xl text-amber-500/90 ml-1 mt-[3px]"
                    >verified</span>
                    <NuxtLink :to="`/${tweet.userInfo.slug}`">
                        <span class="text-gray-500 ml-2 line-clamp-1">@{{ tweet.userInfo.slug }}</span>
                    </NuxtLink>
                    <span class="text-gray-500 ml-1 line-clamp-1">·</span>
                    <span class="text-gray-500 ml-1 shrink-0">{{ tweet.formattedCreatedAt }}</span>
                </div>
                <!-- 2行目 -->
                <div>
                    <span>{{ tweet.body }}</span>
                </div>
                <!-- 画像ボックス -->
                <div
                    v-if="tweet.imageUrls.length"
                    class="grid gap-1 mt-3 aspect-video rounded-2xl overflow-hidden border dark:border-gray-900"
                    :class="tweet.imageUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'"
                >
                    <img
                        v-for="(imageUrl, index) of tweet.imageUrls"
                        :key="index"
                        :src="imageUrl"
                        class="w-full h-full object-cover cursor-pointer"
                        :class="tweet.imageUrls.length === 2 ? 'aspect-[16:18]' : 'aspect-video'"
                        alt="ツイートされた画像"
                        @click="setImages(tweet.imageUrls, index)"
                    />
                </div>
                <!-- 最下段 -->
                <div class="flex justify-between mt-3 max-w-[27rem]">
                    <div class="flex items-center">
                        <!-- アイコン正円 -->
                        <button
                            class="w-8 h-8 flex justify-center items-center rounded-full hover:bg-amber-600/10"
                            title="返信"
                        >
                            <span class="material-symbols-outlined text-xl text-gray-500 hover:text-amber-500">chat_bubble</span>
                        </button>
                        <div class="ml-1 pb-[2px] text-gray-500 text-sm">
                            0
                        </div>
                    </div>
                    <div class="flex items-center">
                        <!-- アイコン正円 -->
                        <button
                            class="w-8 h-8 flex justify-center items-center rounded-full hover:bg-emerald-600/10"
                            title="リツイート"
                        >
                            <span class="material-symbols-outlined text-xl text-gray-500 hover:text-emerald-500">repeat</span>
                        </button>
                        <div class="ml-1 pb-[2px] text-gray-500 text-sm">
                            {{ tweet.retweetsCount }}
                        </div>
                    </div>
                    <div class="flex items-center">
                        <!-- アイコン正円 -->
                        <button
                            class="w-8 h-8 flex justify-center items-center rounded-full hover:bg-pink-600/10"
                            title="いいね"
                        >
                            <span
                                v-if="isLiked"
                                class="material-symbols-outlined text-xl text-gray-500 hover:text-pink-500"
                            >favorite</span>
                            <span
                                v-else
                                class="material-symbols-outlined text-xl text-gray-500 hover:text-pink-500"
                            >phone</span>
                        </button>
                        <div class="ml-1 pb-[2px] text-gray-500 text-sm">
                            {{ tweet.likesCount }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.official-badge {
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}
</style>
