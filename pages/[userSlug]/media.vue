<script setup lang="ts">
import { computed, definePageMeta, useHead, useSeoMeta } from '#imports'
import { useUserDetail } from '@/composables/userDetail'
import { useTweetsByUser } from '@/composables/tweetByUser'
import { ref } from '#imports'
import { useIntersectionObserver } from '@vueuse/core'

definePageMeta({
    middleware: 'user-slug',
})

const { tweets, addOldTweets } = useTweetsByUser()
// firestore で whereできるフィールドは仕様上1つなのでクライアント側でフィルタ
// Invalid query. All where filters with an inequality (<, <=, !=, not-in, >, or >=) must be on the same field. But you have inequality filters on 'imageUrls' and 'createdAt'
const mediaTweets = computed(() => {
    if (!tweets.value) {
        return []
    }
    const mediaTweetList = tweets.value.filter((tweet) => tweet.imageUrls.length !== 0)
    return mediaTweetList
})

const { user } = useUserDetail()

const el = ref<HTMLElement>(null)
useIntersectionObserver(
    el,
    () => {
        console.debug('スクロールによるツイート取得更新')
        addOldTweets()
    },
    {
        threshold: 0.5,
    }
)

// SEO
if (user.value) {
    const title = `${user.value.displayName}(@${user.value.slug})さんのメディアツイート / Twinkle`
    useHead({
        title: title,
        meta: [{ name: 'description', content: user.value.description }],
    })
    useSeoMeta({
        title: title,
        ogTitle: title,
        description: user.value.description,
        ogDescription: user.value.description,
        ogImage: user.value.iconImageUrl,
        twitterImage: user.value.iconImageUrl,
        twitterTitle: title,
        twitterDescription: user.value.description,
    })
}
</script>

<template>
    <div v-if="user">
        <!-- 透明ヘッダー -->
        <ContentsHeader
            :title="user.displayName"
            :sub-title="`${mediaTweets.length}件の画像と動画`"
        />
        <!-- プロフィール -->
        <UserProfile :user="user" />
        <!-- ツイートs -->
        <div v-if="mediaTweets.length > 0">
            <section
                v-for="tweet of mediaTweets"
                :key="tweet.tweetDocId"
            >
                <TweetWrapper :tweet="tweet" />
            </section>
            <!-- useIntersectionObserver で無限スクロール -->
            <span ref="el" />
        </div>
        <div
            v-else
            class="flex justify-center items-center py-8 px-5"
        >
            <div class="flex flex-col justify-center max-w-sm">
                <p class="text-2xl font-bold">
                    @{{ user.slug }} さんは最近メディア付きツイートしていません
                </p>
                <p class="text-gray-500">
                    最近のメディア付きツイートがここに表示されます。
                </p>
            </div>
        </div>
    </div>
</template>
