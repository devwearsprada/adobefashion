<template>
  <section
    ref="section"
    class="grid md:grid-cols-3 md:gap-10"
    :id="data.slug"
  >
    <sanitize
      class="order-2 md:order-none md:col-span-2" 
      :html="data.content"
    />
    <aside 
      class="order-1 md:order-none md:col-span-1"
    >
      <hadogenes-title>
        {{ data.title }}
      </hadogenes-title>
    </aside>
  </section>
</template>

<script>
export default {
  props: ['data'],
  name: 'AnchorSection',
  components: {
    Sanitize: () => import(/* webpackChunkName: "Sanitize" */ '@/components/SanitizeHTML.vue'),
    HadogenesTitle: () => import(/* webpackChunkName: "Title" */ '@/components/HadogenesTitle.vue'),
  },
  mounted() {
    const section = this.$refs.section
    this.$emit('observe', section)
  }
}
</script>