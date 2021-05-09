<template>
  <section 
    ref="section"
    class="grid lg:grid-cols-3 lg:gap-12"
    :data-id="data.image.id"
    :id="data.slug"
  >
    <article
      ref="article"
      class="order-2 lg:order-none lg:col-span-2" 
      v-html="data.content"
    />
    <aside
      class="order-1 lg:order-none lg:col-span-1"
    >
      <h1 class="font-hadogenes-regular text-3xl md:text-4xl text-center md:py-8">
        {{ data.title }}
      </h1>
    </aside>
  </section>
</template>

<script>
export default {
  props: ['data'],
  name: 'ParagraphSection',
  mounted() {
    const section = this.$refs.section
    this.$emit('observe', section)
  }
}
</script>