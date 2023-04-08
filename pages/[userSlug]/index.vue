<script setup lang="ts">

import { useUserDetail } from '@/composables/userDetail'
import { useTweetsByUser } from '@/composables/tweetByUser'
import { useImagesModal } from '@/composables/modal'
import { useAuthByGoogleAccount } from '@/composables/auth'
import { ref } from '#imports'
import { useInfiniteScroll } from '@vueuse/core'
import { vInfiniteScroll, } from '@vueuse/components'

const { me } = useAuthByGoogleAccount()
const { setImages } = useImagesModal()
const { tweets, allImageUrls, addOldTweets } = await useTweetsByUser()
const { user } = useUserDetail()

const target = ref<HTMLElement>(null)
useInfiniteScroll(
  target,
  () => {
    console.log('★★★無限スクロール発火')
    // load more
    addOldTweets()
  },
  {distance: 10, direction: 'bottom'}
)
</script>

<template>
    <div
        v-if="user"
        class="flex"
    >
        <!-- 左半分 -->
        <div ref="target" class="h-screen w-full max-w-[37.5rem] sm:border-r dark:border-gray-800 overflow-y-scroll">
            <!-- 透明ヘッダー -->
            <ContentsHeader
                :title="user.displayName"
                :sub-title="`${tweets?.length}件のツイート`"
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
                    <TweetWrapper
                        :tweet="tweet"
                    />
                </section>
            </div>
        </div>

        <!-- 右半分 -->
        <RightBar>
            <!-- ログインボックス -->
            <LoginBox v-if="!me" />
            <!-- 画像ボックス -->
            <div
                class="w-full aspect-[3/2] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 border dark:border-gray-900 grid gap-[2px]"
                :class="allImageUrls.length < 3 ? `grid-cols-${allImageUrls.length}` : 'grid-cols-3'"
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
