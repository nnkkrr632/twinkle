<script setup lang="ts"></script>

<template>
    <!-- すべてのラッパー -->
    <div class="bg-white dark:bg-black text-gray-700 dark:text-gray-200 flex flex-col justify-center break-all">
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
        <footer class="fixed bottom-0 xs:hidden w-full bg-white/50 dark:bg-black/50 ">
            <Footbar />
        </footer>

        <!-- モーダル -->
        <TweetModal />
        <ImagesModal />
        <ConfirmTweetDeleteModal />
    </div>
</template>
