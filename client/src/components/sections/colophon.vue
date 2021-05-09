<template>
  <section
    class="col-span-3 grid grid-cols-1 lg:grid-cols-3 lg:gap-10 pt-40 pb-20 md:pb-0"
  >
    <article
      class="order-2 lg:order-none lg:col-span-2" 
    >
      <div 
        class="colophon font-beaufort-regular" 
        v-html="colophon.content"
      />
      <div
        class="flex flex-row space-x-4 pt-6"
      >
      <div
        class="flex items-end"
        v-for="(logo, i) in colophon.logo"
        :key="i"
      >
        <img
          class="w-24"
          :src="api + logo.image.url"
        />
      </div>
      </div>
    </article>
  </section>
</template>

<script>
export default {
  name: 'Colophon',
  data: () => ({
    api: process.env.VUE_APP_API_URL, 
  }),
  computed: {
    colophon() {
      return this.$store.getters.colophon
    }
  }
}
</script>

<style>
  .colophon p {
    @apply pt-0;
  }
</style>
