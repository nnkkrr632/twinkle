<script setup lang="ts">
console.log('わたしはRightBar.vueコンポーネント')
</script>

<template>
    <div class="hidden lg:flex lg:flex-col lg:space-y-4 sticky top-0 h-screen flex-1 max-w-sm pl-5 pt-3">
        <slot />
        <!-- 注釈 -->
        <div class="w-full px-4 text-gray-500 text-sm">
            <span>© 2023 Twinkle @nrpans</span>
        </div>
    </div>
</template>
