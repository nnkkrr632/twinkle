<script setup lang="ts">
import { ref, definePageMeta, useHead, useSeoMeta } from '#imports'
import { useUserDetail } from '@/composables/userDetail'
import { useTweetsByUser } from '@/composables/tweetByUser'
import { useIntersectionObserver } from '@vueuse/core'

definePageMeta({
    middleware: 'user-slug',
})

const { tweets, addOldTweets } = useTweetsByUser()
const { user } = useUserDetail()

// https://github.com/vueuse/vueuse/issues/1685#issuecomment-1185050680
const el = ref<HTMLElement>(null)
useIntersectionObserver(
    el,
    () => {
        console.log('★★★無限スクロール発火2')
        addOldTweets()
    },
    {
        threshold: 0.5,
    }
)

// SEO
if (user.value) {
    const title = `${user.value.displayName}(@${user.value.slug})さん / Twinkle`
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
        ogSiteName: 'Twinkle',
        twitterCard: 'summary',
        twitterImage: user.value.iconImageUrl,
        twitterTitle: title,
        twitterDescription: user.value.description,
    })
}
</script>

<template>
    <div v-if="user">
        <!-- 透明ヘッダー -->
        <ContentsHeader :title="user.displayName" :sub-title="`${tweets?.length ?? 0}件のツイート`" />
        <!-- プロフィール -->
        <UserProfile :user="user" />
        <!-- ツイートs -->
        <div v-if="tweets">
            <section v-for="tweet of tweets" :key="tweet.tweetDocId">
                <TweetWrapper :tweet="tweet" />
            </section>
            <!-- useIntersectionObserver で無限スクロール -->
            <span ref="el" />
        </div>
        <div v-else class="flex justify-center items-center py-8">
            <div class="flex flex-col justify-center max-w-sm">
                <p class="text-2xl font-bold">@{{ user.slug }} さんはまだツイートしていません</p>
                <p class="text-gray-500">ツイートをするとここに表示されます。</p>
            </div>
        </div>
    </div>
</template>
