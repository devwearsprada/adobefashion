<template>
  <div class="fixed backdrop-blur h-screen w-screen"></div>
</template>

<script>
export default {
  name: 'BlurOverlay',
}
</script>

<style scoped>
* {
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
  -webkit-transform: translate3d(0,0,0);
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
  transform: translate3d(0,0,0);
  transform: translateZ(0);
}
</style>