<script setup lang="ts">
import { useHead, useSeoMeta, ref } from '#imports'
import { useAuthByGoogleAccount } from '@/composables/auth'

const { me, googleSignUp } = useAuthByGoogleAccount()

// SEO layouts/default.vueで定義されたものはすべてのページで使用できる。各ページで再定義することで上書きできる
const defaultTitle = 'Twinkle'
const defaultDescription = 'NuxtとFirebaseで作成されたTwitterクローンサイト「Twinkle」です。'
const twinkleImageUrl = `https://nrpans-twinkle.vercel.app/images/twinkle.png`

const googleButton = ref<string>('/images/btn_google_signin_light_normal_web@2x.png')
const googleSignUpWithOfficialButton = async () => {
    googleButton.value = '/images/btn_google_signin_light_pressed_web@2x.png'
    await googleSignUp()
    googleButton.value = '/images/btn_google_signin_light_normal_web@2x.png'
}

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
    <div
        class="bg-white dark:bg-black text-gray-700 dark:text-gray-200 flex flex-col items-center justify-center break-all"
    >
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
        <!-- SPビュー フッターメニューバー -->
        <footer
            class="fixed xs:hidden w-full"
            :class="me ? 'bottom-0' : 'bottom-16'"
        >
            <Footbar />
        </footer>
        <!-- ログインバー PCビュー 左バー+コンテンツ+右バー の中央寄せのwidthに影響されずwindow幅 -->
        <div
            v-if="!me"
            class="fixed bottom-0 flex justify-around items-center w-full bg-amber-500 h-16"
        >
            <!-- テキストとログインボタンのflex -->
            <div class="flex items-center justify-center gap-1 md:gap-[10%] w-full h-full">
                <div class="hidden xs:flex flex-col text-white">
                    <p class="text-lg md:text-2xl font-bold">
                        「いま」起きていることを見つけよう
                    </p>
                    <p class="text-xs md:text-base">
                        Twinkleなら「いま」起きていることをいち早くチェックできます。
                    </p>
                </div>
                <div class="h-full flex justify-center items-center">
                    <img
                        :src="googleButton"
                        alt="Googleで登録/ログイン" 
                        class="h-12 object-contain cursor-pointer"
                        @click="googleSignUpWithOfficialButton"
                    />
                </div>
            </div>
        </div>
        <!-- モーダル -->
        <TweetModal />
        <ImagesModal />
        <ConfirmTweetDeleteModal />
    </div>
</template>
