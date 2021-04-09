<template>
  <transition 
    name="view"
    :mode="mode"
  >
    <slot/>
  </transition>
</template>

<script>
export default {
  name: 'TransitionView',
  props: {
    mode: {
      type: String,
      default: 'out-in'
    }
  }
}
</script>

<style scoped>
  .view-enter-active, .view-leave-active {
    transition: opacity .2s;
  }
  .view-enter, .view-leave-to {
    opacity: 0;
  }
</style>