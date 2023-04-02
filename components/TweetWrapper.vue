<script setup lang="ts">
import type { Tweet } from '@/composables/types'
const props = defineProps<{ tweet: Tweet }>()
</script>

<template>
    <Tweet
        v-if="tweet.tweetType === 'retweet'"
        :tweet="props.tweet.originalTweet"
    />
    <Tweet
        v-else
        :tweet="props.tweet"
    />
</template>