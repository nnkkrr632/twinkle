<script setup lang="ts">
import { useUserDetail } from '@/composables/userDetail'
import { useTweetsByUser } from '@/composables/tweetByUser'
import { useImagesModal } from '@/composables/modal'
import { useAuthByGoogleAccount } from '@/composables/auth'

const { me } = useAuthByGoogleAccount()
const { setImages } = useImagesModal()
const { tweets, allImageUrls } = await useTweetsByUser()
const { user } = useUserDetail()

</script>

<template>
    <div
        v-if="user"
        class="flex"
    >
        <!-- 左半分 -->
        <div class="w-full max-w-[37.5rem] sm:border-r dark:border-gray-800 pb-16">
            <!-- 透明ヘッダー -->
            <ContentsHeader
                :title="user.displayName"
                :sub-title="`${tweets?.length}件のツイート`"
            />
            <!-- プロフィール -->
            <UserProfile :user="user" />
            <!-- ツイートs -->
            <section
                v-for="tweet of tweets"
                :key="tweet.tweetDocId"
            >
                <TweetWrapper
                    :tweet="tweet"
                />
            </section>
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
