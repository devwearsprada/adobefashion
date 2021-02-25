<template>
  <div class="fixed bottom-3 right-3 z-20 p-3 w-24 h-24 bg-primary rounded-full">
    <a href="#" v-scroll-to="{ el: '#archive' }">Scroll to top</a>
  </div>
</template>

<script>
export default {
  name: 'ScrollToTop'
}
</script>