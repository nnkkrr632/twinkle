<script setup lang="ts">
</script>
<template>
    <NuxtLayout>
        <!-- ユーザーページ用の404 -->
        <div v-if="$route.name?.toString().includes('userSlug')">
            <!-- 透明ヘッダー -->
            <ContentsHeader title="プロフィール" />
            <!-- プロフィール -->
            <div>
                <div class="relative">
                    <!-- ユーザーヘッダー画像 -->
                    <div class="w-full aspect-[3/1] bg-gray-200 dark:bg-gray-800" />
                    <!-- ユーザーアイコン画像 -->
                    <div class="w-1/4 aspect-square min-w-[3rem] absolute top-[62%] left-[1rem]">
                        <div
                            class="bg-gray-100 dark:bg-gray-900 h-full w-full object-cover rounded-full border-[3px] border-white dark:border-black"
                        />
                    </div>
                </div>
                <!--テキストセクション -->
                <div class="py-6 px-4 flex flex-col">
                    <div class="py-[34px]" />
                    <!-- ユーザーID -->
                    <span class="text-xl font-bold">@{{ $route.params.userSlug }}</span>
                </div>
            </div>
            <!-- ツイートs -->
            <div class="flex justify-center items-center py-8">
                <div class="flex flex-col justify-center max-w-sm py-8">
                    <p class="text-2xl font-bold">
                        このアカウントは存在しません
                    </p>
                    <p class="text-gray-500">
                        キーワードを変えて検索してみてください。
                    </p>
                </div>
            </div>
        </div>
        <div
            v-else
            class="flex items-center justify-center"
        >
            <p class="text-gray-500 py-8">
                このページは存在しません。他のページを検索してみましょう。
            </p>
        </div>
    </NuxtLayout>
</template>

<!-- なぜかstype句がないと再読み込み時エラー 中身は何でも良い-->
<style scoped lang="scss">
.container {
    display: flex;
}
</style>
