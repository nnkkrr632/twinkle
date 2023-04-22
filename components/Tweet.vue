<script setup lang="ts">
import { ref } from '#imports'
import type { Tweet } from '@/composables/types'
import { useImagesModal } from '@/composables/modal'
import { useConfirmTweetDelete } from '@/composables/modal'
import { useAuthByGoogleAccount } from '@/composables/auth'
import { useLike } from '@/composables/tweetLike'
import { useRetweet } from '@/composables/retweet'

const { openModal } = useConfirmTweetDelete()
const { me } = useAuthByGoogleAccount()

const { setImages } = useImagesModal()
const props = defineProps<{ tweet: Tweet; tweetDocId: string; retweetedBy?: string }>()
// propsを直接変更できない
const likeUserSlugs = ref(props.tweet.likeUserSlugs)
const retweetUserSlugs = ref(props.tweet.retweetUserSlugs)

const { storeLike, destroyLike } = useLike()
const like = async () => {
    if (!me.value) {
        return
    }
    const storeSucceeded = await storeLike(props.tweet.tweetDocId)
    if(storeSucceeded) {
        likeUserSlugs.value.push(me.value.slug)
    }
}
const cancelLike = async () => {
    if (!me.value) {
        return
    }
    const destroySucceeded = await destroyLike(props.tweet.tweetDocId)
    if(destroySucceeded) {
        likeUserSlugs.value = likeUserSlugs.value.filter((userSlug) => userSlug !== me.value?.slug)
    }
}

const { storeRetweet, destroyRetweet } = useRetweet()
const retweet = async () => {
    if (!me.value) {
        alert('リツイートをするにはログインが必要です。')
        return
    }
    if (retweetUserSlugs.value.includes(me.value.slug)) {
        alert('既にリツイート済です。')
        return
    }
    const storeSucceeded = await storeRetweet(props.tweet.tweetDocId)
    if(storeSucceeded) {
        retweetUserSlugs.value.push(me.value.slug)
    } else {
        alert('リツイートに失敗しました。ツイートが存在しない可能性があります。')
    }
}
const cancelRetweet = async () => {
    if (!me.value) {
        return
    }
    if (!retweetUserSlugs.value.includes(me.value.slug)) {
        alert('リツイートしていないツイートのリツイートを取り消すことはできません。')
        return
    }
    const originalTweetDocId = props.tweet.tweetDocId
    const destroySucceeded = await destroyRetweet(props.tweetDocId, originalTweetDocId)
    if (destroySucceeded) {
        retweetUserSlugs.value = retweetUserSlugs.value.filter((userSlug) => userSlug !== me.value?.slug)
    } else {
        alert('リツイートの取り消しに失敗しました。ツイートが存在しない可能性があります。')
    }
}
</script>

<template>
    <div class="block border-b dark:border-gray-800 px-4 hover:bg-gray-400/5 dark:hover:bg-white/5 py-[6px]">
        <div>tweetDocId：{{ tweet.tweetDocId }}</div>
        <div>userSlug：{{ tweet.userInfo.slug }}</div>
        <!-- リツイート -->
        <div
            v-if="props.retweetedBy"
            class="flex items-center text-sm text-gray-500"
        >
            <span class="material-symbols-outlined text-xl ml-7 mr-3">repeat</span>
            <span class="line-clamp-1">{{ props.retweetedBy }} さんがリツイートしました</span>
        </div>
        <!-- アイコンと文章のフレックス -->
        <div class="flex">
            <div class="pr-3">
                <NuxtLink
                    :to="`/${tweet.userInfo.slug}`"
                    class="rounded-full hover:bg-black/5 dark:hover:bg-white/10 xl:w-full"
                >
                    <!-- ユーザーアイコン -->
                    <div
                        class="w-12 h-12 flex justify-center items-center bg-gray-100 dark:bg-gray-900 overflow-hidden"
                        :class="tweet.userInfo.type === 'official' ? 'rounded-md' : 'rounded-full'"
                    >
                        <img
                            v-if="tweet.userInfo.iconImageUrl"
                            :src="tweet.userInfo.iconImageUrl"
                            alt="ツイートしたユーザーのアイコン画像"
                            class="h-full w-full object-cover"
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
                        v-if="tweet.userInfo.type === 'official'"
                        class="official-badge material-symbols-outlined text-xl text-amber-500/90 ml-1 mt-[2px]"
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
                <div class="flex justify-between mt-3 mx-10 xs:mx-20">
                    <!-- リツイート -->
                    <div class="flex items-center">
                        <!-- リツイート済 -->
                        <button
                            v-if="me && retweetUserSlugs.includes(me.slug)"
                            class="me-retweeted w-8 h-8 flex justify-center items-center rounded-full hover:bg-emerald-600/10"
                            title="リツイートを取り消す"
                            @click="cancelRetweet()"
                        >
                            <span class="material-symbols-outlined text-xl text-emerald-500">repeat</span>
                        </button>
                        <!-- 未リツイート -->
                        <button
                            v-else
                            class="w-8 h-8 flex justify-center items-center rounded-full hover:bg-emerald-600/10"
                            title="リツイート"
                            @click="retweet()"
                        >
                            <span class="material-symbols-outlined text-xl text-gray-500 hover:text-emerald-500">repeat</span>
                        </button>
                        <div class="ml-1 pb-[2px] text-gray-500 text-sm">
                            {{ retweetUserSlugs.length }}
                        </div>
                    </div>
                    <!-- いいね -->
                    <div class="flex items-center">
                        <!-- いいね済 -->
                        <button
                            v-if="me && likeUserSlugs.includes(me.slug)"
                            class="me-liked w-8 h-8 flex justify-center items-center rounded-full hover:bg-pink-600/10"
                            title="いいねを取り消す"
                            @click="cancelLike()"
                        >
                            <span class="material-symbols-outlined text-xl text-pink-500">favorite</span>
                        </button>
                        <!-- 未いいね -->
                        <button
                            v-else
                            class="w-8 h-8 flex justify-center items-center rounded-full hover:bg-pink-600/10"
                            title="いいね"
                            @click="like()"
                        >
                            <span class="material-symbols-outlined text-xl text-gray-500 hover:text-pink-500">favorite</span>
                        </button>
                        <div class="ml-1 pb-[2px] text-gray-500 text-sm">
                            {{ likeUserSlugs.length }}
                        </div>
                    </div>
                    <!-- 削除 ※リツイートの場合は押せない。リツイートは取り消しに限定する。-->
                    <div
                        
                        class="flex items-center"
                    >
                        <!-- アイコン正円 -->
                        <button
                            class="w-8 h-8 flex justify-center items-center rounded-full"
                            :class="props.retweetedBy ? 'opacity-30' : 'hover:bg-red-500/10'"
                            :disabled="!!props.retweetedBy"
                            title="削除"
                            @click="openModal(tweet.tweetDocId)"
                        >
                            <span
                                class="material-symbols-outlined text-xl text-gray-500"
                                :class="props.retweetedBy ? '' : 'hover:text-red-500'"
                            >delete</span>
                        </button>
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
.me-retweeted {
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}
.me-liked {
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
}
</style>
