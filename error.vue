<script setup lang="ts">
const error = useError();
</script>

<template>
  <div class="container">
    <div class="stack">
      <h1>404</h1>
      <p class="error-message">{{ error?.message }}</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
h1 {
  font-size: 6rem;
  letter-spacing: 0.5rem;
  text-align: center;
  line-height: 1;
  color: pink;
}
.error-message {
  font-weight: lighter;
}
</style>