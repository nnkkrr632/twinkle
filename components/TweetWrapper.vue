<script setup lang="ts">
import type { Tweet } from '@/composables/types'
const props = defineProps<{ tweet: Tweet }>()
</script>

<template>
    <Tweet
        v-if="tweet.tweetType === 'retweet'"
        :tweet="props.tweet.originalTweet"
        :is-retweet="true"
        :true-tweet-doc-id="props.tweet.tweetDocId"
    />
    <Tweet
        v-else
        :tweet="props.tweet"
        :is-retweet="false"
        :true-tweet-doc-id="props.tweet.tweetDocId"
    />
</template>