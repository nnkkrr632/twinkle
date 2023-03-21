<script setup lang="ts">
import { ref, computed, onMounted } from '#imports'
import { useUserDetail } from '@/composables/userDetail'
import { useTweetsByUser } from '~/composables/tweetByUser'
import { useImagesModal } from '~/composables/modal'
const { setImages } = useImagesModal()
const { tweets } = await useTweetsByUser()
const { user, error } = useUserDetail()

const allImageUrls = ref<string[]>([])
// 同じURLのパラメータ違い(ex. /userSlug /taro → /hanako)のときtweet取得前にallImageUrlsが計算され0が入ってきてしまうので無理やりcomputedで上書き
const imageBoxColNumber = computed(() => {
    // console.log('★★列数決定のコンピューテッド発火')
    allImageUrls.value = tweets.value?.flatMap((tweet) => tweet.imageUrls) ?? []
    // console.log('allImageUrls.value.length ↓')
    // console.log(allImageUrls.value.length)
    if (allImageUrls.value.length < 3) {
        return allImageUrls.value.length
    }
    return 3
})
</script>

<template>
    <div v-if="user" class="flex">
        <!-- 左半分 -->
        <div class="w-full max-w-[37.5rem] sm:border-r dark:border-gray-800">
            <!-- 透明ヘッダー -->
            <ContentsHeader :title="user.displayName" :sub-title="`${user.tweetsCount}件のツイート`">
                <div class="flex items-center">
                    <span
                        class="bg-black dark:bg-white px-5 py-1 rounded-full text-gray-200 dark:text-gray-700 font-semibold hover:opacity-80 dark:hover:opacity-90 cursor-pointer"
                        >フォロー</span
                    >
                </div>
            </ContentsHeader>
            <!-- プロフィール -->
            <UserProfile :user="user" />
            <!-- ツイートs -->
            <section v-for="tweet of tweets" :key="tweet.tweetDocId">
                <Tweet :tweet="tweet" />
            </section>
            <!-- 下にスペース -->
            <div class="h-16" />
        </div>

        <!-- 右半分 -->
        <RightBar>
            <!-- ログインボックス -->
            <ClientOnly fallback-tag="span" fallback="Loading comments...">
                <LoginBox />
            </ClientOnly>
            <!-- 画像ボックス -->
            <div
                class="w-full aspect-[3/2] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border dark:border-gray-900 grid gap-[2px]"
                :class="`grid-cols-${imageBoxColNumber}`"
            >
                <img
                    v-for="(imageUrl, index) of allImageUrls"
                    :key="index"
                    :src="imageUrl"
                    class="w-full h-full object-cover aspect-square cursor-pointer"
                    alt="ツイートされた画像"
                    @click="setImages(allImageUrls, index)"
                />
            </div>
        </RightBar>
    </div>
</template>
