<script setup lang="ts">
import { ref, useHead, useSeoMeta } from '#imports'
import { useTweetsByAll } from '@/composables/tweetByAll'
import { useIntersectionObserver } from '@vueuse/core'

const { tweets, addOldTweets } = useTweetsByAll()

// https://github.com/vueuse/vueuse/issues/1685#issuecomment-1185050680
const el = ref<HTMLElement>(null)
useIntersectionObserver(
    el,
    () => {
        // console.debug('スクロールによるツイート取得更新')
        addOldTweets()
    },
    {
        threshold: 0.5,
    }
)

// SEO 上書きするものだけ定義
const title = 'ホーム / Twinkle'
useHead({
    title: title,
})
useSeoMeta({
    title: title,
    ogTitle: title,
    twitterTitle: title,
})
</script>

<template>
    <div>
        <!-- 透明ヘッダー -->
        <ContentsHeader title="ホーム" />
        <!-- ツイートs -->
        <div v-if="tweets">
            <section
                v-for="tweet of tweets"
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
                    ツイートがありません
                </p>
                <p class="text-gray-500">
                    Twinkle上のツイートはすべてここに表示されます。
                </p>
            </div>
        </div>
    </div>
</template>
