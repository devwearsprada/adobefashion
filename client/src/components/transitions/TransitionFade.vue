<template>
  <transition 
    name="fade"
  >
    <slot/>
  </transition>
</template>

<script>
export default {
  name: 'TransitionFade'
}
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>