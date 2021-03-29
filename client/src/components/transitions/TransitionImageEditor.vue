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

.bounce-leave-to {
  animation: bounce 1s 3;
}
/* .bounce-leave-active {
  animation: bounce-in .5s reverse;
} */

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animationTimingFunction: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animationTimingFunction: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>
