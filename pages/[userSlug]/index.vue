<script setup lang="ts">
import { useUserDetail } from '@/composables/userDetail'
import { useTweetsByUser } from '@/composables/tweetByUser'
import { ref } from '#imports'
import { useIntersectionObserver } from '@vueuse/core'

const { tweets, addOldTweets } = useTweetsByUser()
console.log('私はpages/userSlug/index.vue。tweetsとれてる？↓')
console.log(tweets)
const { user } = useUserDetail()

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
</script>

<template>
    <div v-if="user">
        <!-- 透明ヘッダー -->
        <ContentsHeader
            :title="user.displayName"
            :sub-title="`${tweets?.length ?? 0}件のツイート`"
        />
        <!-- プロフィール -->
        <UserProfile :user="user" />
        <!-- <div class="w-20 h-20 bg-red-300 cursor-pointer" @click="addOldTweets()">add</div> -->
        <!-- ツイートs -->
        <div>
            <section
                v-for="tweet of tweets"
                :key="tweet.tweetDocId"
            >
                <TweetWrapper :tweet="tweet" />
            </section>
        </div>
        <!-- useIntersectionObserver で無限スクロール -->
        <span ref="el" />
    </div>
</template>
