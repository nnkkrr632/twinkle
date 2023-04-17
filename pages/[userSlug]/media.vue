<script setup lang="ts">
import { computed } from '#imports'
import { useUserDetail } from '@/composables/userDetail'
import { useTweetsByUser } from '@/composables/tweetByUser'
import { ref } from '#imports'
import { useIntersectionObserver } from '@vueuse/core'

const { tweets, addOldTweets } = useTweetsByUser()
// firestore で whereするフィールドは1つでなくてはならないからクライアント側でフィルタ
// Invalid query. All where filters with an inequality (<, <=, !=, not-in, >, or >=) must be on the same field. But you have inequality filters on 'imageUrls' and 'createdAt'
const mediaTweets = computed(() => {
    if (!tweets.value) {
        return []
    }
    console.log('tweets.value↓')
    console.log(tweets.value)
    const mediaTweetList = tweets.value.filter((tweet) => tweet.imageUrls.length !== 0)
    console.log('mediaTweetList↓')
    console.log(mediaTweetList)
    return mediaTweetList
})

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
        <div v-else class="flex justify-center items-center py-8">
            <div class="flex flex-col justify-center max-w-sm">
                <p class="text-2xl font-bold">@{{ user.slug }} さんはまだメディア付きツイートしていません</p>
                <p class="text-gray-500">実際に行うとそのツイートがここに表示されます。</p>
            </div>
        </div>
    </div>
</template>
