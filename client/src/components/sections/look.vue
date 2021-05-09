<template>
  <section class="grid grid-cols-1 lg:grid-cols-3 lg:gap-10">
    <article class="lg:col-span-2 pt-4">
    <h3 class="font-swiss-black text-xl md:text-xl">
      {{ data.title }}
    </h3>
    <span class="link text-xs cursor-pointer" @click="expand = !expand">
      click to view look
    </span>
    <transition-expand>
      <div v-show="expand">
        <image-lazy
          :width="data.image.width"
          :height="data.image.height"
          :backgroundColor="'rgb(228 253 65)'"
          :lazy-src="api + data.image.formats.small.url"
          :lazy-srcset="api + data.image.url"
        />
      </div>
    </transition-expand>
    <div class="-mt-4" v-html="data.content" />
    </article>
  </section>
</template>

<script>
export default {
  props: ['data'],
  name: 'Look',
  components: {
    TransitionExpand: () => import(/* webpackChunkName: "transitions" */ '@/components/transitions/transition-expand.vue'),
    ImageLazy: () => import(/* webpackChunkName: "images" */ '@/components/image-lazy.vue')
  },
  data: () => ({
    api: process.env.VUE_APP_API_URL,
    expand: false
  })
}
</script>

<style>
  span.link {
    @apply text-secondary;
  }

  span.link:hover {
    @apply border-b-2;
    @apply border-secondary;
  }
</style>