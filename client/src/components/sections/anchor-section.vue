<template>
  <section
    ref="section"
    class="grid grid-cols-1 lg:grid-cols-3 lg:gap-10"
    :id="data.slug"
  >
    <article
      class="order-2 lg:order-none lg:col-span-2" 
      v-html="data.content"
    />
    <aside 
      class="order-1 lg:order-none lg:col-span-1"
    >
      <h1 class="font-hadogenes-regular text-4xl text-center">
        {{ data.title }}
      </h1>
    </aside>
  </section>
</template>

<script>
export default {
  props: ['data'],
  name: 'AnchorSection',
  mounted() {
    const section = this.$refs.section
    this.$emit('observe', section)
  }
}
</script>