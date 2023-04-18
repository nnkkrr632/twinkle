<script setup lang="ts">
import { watchEffect, useRoute, ref } from '#imports'
import { useImagesModal } from '@/composables/modal'
import { useTweetsByUser } from '@/composables/tweetByUser'

const { setImages } = useImagesModal()
const { allImageUrls } = useTweetsByUser()
const route = useRoute()

// 画像ボックス v-if="$route.name === userSlug" でボックス表示制御は再読み込み時の挙動が怪しかった
const imageUrls = ref<string[]>([])
watchEffect(() => {
    console.log('★★imageUrlsのwatchEffect開始')
    if (!route.name) {
        return
    }
    // /userSlug と /userSlug/media では 画像ボックスを表示
    if (route.name.toString() === 'userSlug' || route.name.toString() === 'userSlug-media') {
        imageUrls.value = allImageUrls.value
        return
    }
    imageUrls.value = []
    return
})
</script>

<template>
    <div
        v-if="imageUrls.length"
        class="w-full h-full grid gap-[2px]"
        :class="imageUrls.length < 3 ? `grid-cols-${imageUrls.length}` : 'grid-cols-3'"
    >
        <img
            v-for="(imageUrl, index) of imageUrls"
            :key="index"
            :src="imageUrl"
            class="w-full h-full object-cover aspect-square cursor-pointer"
            alt="ツイートされた画像"
            @click="setImages(imageUrls, index)"
        />
    </div>
</template>
