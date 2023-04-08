<script setup lang="ts">
import type { Tweet, Retweet } from '@/composables/types'
const props = defineProps<{ tweet: Tweet | Retweet }>()
</script>

<template>
    <Tweet
        v-if="props.tweet.type === 'retweet'"
        :tweet="props.tweet.originalTweet"
        :tweet-doc-id="props.tweet.tweetDocId"
        :retweeted-by="props.tweet.userInfo.displayName"
    />
    <Tweet
        v-else
        :tweet="props.tweet"
        :tweet-doc-id="props.tweet.tweetDocId"
    />
</template>