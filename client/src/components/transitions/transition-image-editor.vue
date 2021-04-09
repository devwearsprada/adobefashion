<template>
  <transition 
    name="slide"
  >
    <slot ref="slot" />
  </transition>
</template>

<script>

export default {
  name: 'TransitionImageEditor',
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: transform 0.25s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateY(100%);
}
</style>
