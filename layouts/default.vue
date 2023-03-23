<script setup lang="ts"></script>

<template>
    <!-- すべてのラッパー -->
    <div class="bg-white dark:bg-black text-gray-700 dark:text-gray-200 flex justify-center break-all">
        <!-- サイドバーとコンテンツのflex -->
        <div class="flex justify-center max-w-[42rem] lg:max-w-5xl xl:max-w-7xl w-full">
            <aside
                class="hidden xs:block sticky top-0 px-1 xl:px-5 pt-1 w-[4.5rem] xl:w-[17rem] h-screen border-r dark:border-gray-800"
            >
                <ClientOnly
                    fallback-tag="span"
                    fallback="Loading LeftBar..."
                >
                    <LeftBar />
                </ClientOnly>
            </aside>
            <main class="flex-1">
                <slot />
            </main>
        </div>
        <!-- モーダル -->
        <ClientOnly>
            <TweetModal />
            <ImagesModal />
        </ClientOnly>
    </div>
</template>
