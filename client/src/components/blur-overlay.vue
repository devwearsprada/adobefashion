<template>
  <div class="moz fixed backdrop-blur h-screen w-screen cursor-pointer transform-gpu z-40"></div>
</template>

<script>
export default {
  name: 'BlurOverlay',
}
</script>

<style scoped>
@-moz-document url-prefix() {
  .moz {
    background: rgba(188, 191, 212, .9);
  }
}
</style>