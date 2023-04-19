<script setup lang="ts">
import { useHead, useSeoMeta } from '#imports'

// SEO layouts/default.vueで定義されたものはすべてのページで使用できる。各ページで再定義することで上書きできる
const defaultTitle = 'Twinkle'
const defaultDescription = 'NuxtとFirebaseで作成されたTwitterクローンサイト「Twinkle」です。'
const twinkleImageUrl = 'https://firebasestorage.googleapis.com/v0/b/twinkle-d72d6.appspot.com/o/material-images%2Ftwinkle.png?alt=media'
useHead({
    title: defaultTitle,
    meta: [{ property: 'description', content: defaultDescription }],
})
useSeoMeta({
    title: defaultTitle,
    ogTitle: defaultTitle,
    description: defaultDescription,
    ogDescription: defaultDescription,
    ogImage: twinkleImageUrl,
    ogSiteName: 'Twinkle',
    twitterCard: 'summary',
    twitterImage: twinkleImageUrl,
    twitterTitle: defaultTitle,
    twitterDescription: defaultDescription,
})
</script>

<template>
    <!-- すべてのラッパー -->
    <div class="bg-white dark:bg-black text-gray-700 dark:text-gray-200 flex flex-col items-center justify-center break-all">
        <!-- サイドバーとコンテンツのflex -->
        <div class="flex justify-center max-w-[42rem] lg:max-w-5xl xl:max-w-7xl w-full">
            <aside
                class="hidden xs:block sticky top-0 px-1 xl:px-5 pt-1 w-[4.5rem] xl:w-[17rem] h-screen border-r dark:border-gray-800"
            >
                <LeftBar />
            </aside>
            <main class="min-h-screen flex-1 max-w-[600px] box-border sm:border-r dark:border-gray-800 pb-28 xs:pb-16">
                <slot />
            </main>
            <aside>
                <RightBar />
            </aside>
        </div>
        <footer class="fixed bottom-0 xs:hidden w-full">
            <Footbar />
        </footer>

        <!-- モーダル -->
        <TweetModal />
        <ImagesModal />
        <ConfirmTweetDeleteModal />
    </div>
</template>
