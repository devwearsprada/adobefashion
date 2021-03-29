<template>
  <div
    class="relative"
  >
    <transition-group
      enter-active-class="transform-gpu"
      enter-class="opacity-0 scale-0"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="absolute transform-gpu"
      leave-class="opacity-100"
      leave-to-class="opacity-0"
      @before-leave="beforeLeave"
      tag="div"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      <div
        v-for="(edit, i) in edits"
        :key="i"
        class="transition-all duration-200"
      >
        <image-lazy
          class="shadow-primary"
          :key="edit.id"
          :width="edit.image.width"
          :height="edit.image.height"
          :src="api + edit.image.formats.small.url"
          :lazy-src="(edit.image.formats.medium) 
                      ? api + edit.image.formats.medium.url 
                      : api + edit.image.formats.small.url"
          :lazy-srcset="api + edit.image.url"
        />
      </div>
    </transition-group>
    <infinite-loading
      :identifier="Math.random()"
      @infinite="loadMore" 
    >
      <div slot="spinner"></div>
      <div slot="no-more" class="text-left"></div>
      <div slot="no-results" class="text-left"></div>
    </infinite-loading>
  </div>
</template>

<script>

export default {
  name: 'Archive',
  components: {
    InfiniteLoading: () =>  import('vue-infinite-loading'),
    ImageLazy: () => import('@/components/image-lazy.vue')
  },
  metaInfo() {
    return {
      title: 'Archive',
      bodyAttrs: {
        class: 'bg-secondary'
      }
    }
  },
  data() {
    return {
      api: process.env.VUE_APP_API_URL,
    }
  },
  methods: {
    beforeLeave(el) {
      const { width, height } = window.getComputedStyle(el);

      // el.style.left = `${el.offsetLeft - parseFloat(marginLeft, 10)}px`;
      // el.style.top = `${el.offsetTop - parseFloat(marginTop, 10)}px`;
      el.style.width = width;
      el.style.height = height;
    },
    loadMore($state) {
      this.$store.dispatch('fetchEditsNew', $state)
    }
  },
  computed: {
    edits() {
      return this.$store.getters.edits
    }
  }
}
</script>