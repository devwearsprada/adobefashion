<template>
  <div
    class="relative pt-4"
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
        :key="`${edit.id}-${i}`"
        class="relative transition-all duration-200"
      >
        <button 
          class="absolute flex justify-center items-center right-0 w-12 h-12 -mr-4 -mt-4 z-20 cursor-pointer select-none rounded-full border border-black bg-secondary"
          v-if="edit.available"
        >
          <a :href="`mailto:rosalievanpinxteren@gmail.com?subject=Hi Rosalie, I would love to buy ${edit.title}&body=Hi Rosalie,%0D%0A%0D%0AI'm interested in buying ${edit.title}. What would be the estimate to buy this look and to ship it to the following address:%0D%0A%0D%0AStreet + number:%0D%0APostal code:%0D%0ACity:%0D%0ACountry:%0D%0A%0D%0AThank you! Looking forward to hear from you.%0D%0A%0D%0ABest regards,%0D%0A%0D%0A`">Buy</a>
        </button>
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
        <h1 class="font-hadogenes-regular text-2xl pt-2 -ml-1">
          {{ edit.title }}
        </h1>
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
    InfiniteLoading: () =>  import(/* webpackChunkName: "components" */ 'vue-infinite-loading'),
    ImageLazy: () => import(/* webpackChunkName: "images" */ '@/components/image-lazy.vue')
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

      el.style.width = width;
      el.style.height = height;
    },
    loadMore($state) {
      this.$store.dispatch('fetchEdits', $state)
    }
  },
  computed: {
    edits() {
      return this.$store.getters.edits
    }
  }
}
</script>