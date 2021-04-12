<template>
  <section
    class="col-span-3 grid grid-cols-1 lg:grid-cols-3 lg:gap-10 pt-20"
  >
    <article
      class="order-2 lg:order-none lg:col-span-2" 
    >
      <div v-html="colophon.content"/>
    </article>
  </section>
</template>

<script>
export default {
  name: 'Colophon',
  computed: {
    colophon() {
      return this.$store.getters.colophon
    }
  }
}
</script>
