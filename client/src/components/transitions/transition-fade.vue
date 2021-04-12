<template>
  <transition 
    name="fade"
    mode="out-in"
    :duration="duration"
  >
    <slot/>
  </transition>
</template>

<script>
export default {
  name: 'TransitionFade',
  props: {
    mode: {
      type: String,
      default: ''
    },
    duration: {
      type: Object,
      default: () => ({
        enter: 500,
        leave: 500
      })
    },
  }
}
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s ease;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>