<template>
  <section class="grid grid-cols-1 lg:grid-cols-3 lg:gap-10">
    <article class="lg:col-span-2 pt-4">
    <template v-if="isMobile">
      <span class="link cursor-pointer" @click="expand = !expand">
        {{ data.title }}
      </span>
      <transition-expand>
        <div v-show="expand" class="max-w-xs">
          <image-lazy
            :width="data.image.width"
            :height="data.image.height"
            :backgroundColor="'rgb(228 253 65)'"
            :lazy-src="api + data.image.formats.small.url"
            :lazy-srcset="api + data.image.url"
          />
        </div>
      </transition-expand>
    </template>
    <template v-else>
      <span 
        class="link cursor-pointer" 
        @mousemove="toggleExpand($event)"
        @mouseout="expand = false"
      >
        {{ data.title }}
      </span>
      <transition-fade :duration="{ enter: 100, leave: 100 }"> 
        <div v-if="expand" class="absolute z-10 filter-shadow" :style="hoverStyle">
          <image-lazy
            :width="data.image.width / 8"
            :height="data.image.height / 8"
            :backgroundColor="'rgb(228 253 65)'"
            :lazy-src="api + data.image.formats.small.url"
            :lazy-srcset="api + data.image.url"
          />
        </div>
      </transition-fade>
    </template>
    <div class="-mt-4" v-html="data.content" />
    </article>
  </section>
</template>

<script>
import { isMobile } from 'mobile-device-detect'

export default {
  props: ['data'],
  name: 'Look',
  components: {
    TransitionExpand: () => import(/* webpackChunkName: "transitions" */ '@/components/transitions/transition-expand.vue'),
    TransitionFade: () => import(/* webpackChunkName: "transitions" */ '@/components/transitions/transition-fade.vue'),
    ImageLazy: () => import(/* webpackChunkName: "images" */ '@/components/image-lazy.vue')
  },
  data: () => ({
    isMobile,
    api: process.env.VUE_APP_API_URL,
    expand: false,
    hoverStyle: {
      left: null,
      top: null
    }
  }),
  methods: {
    toggleExpand(e) {
      if (!this.expand) { this.expand = true }

      this.hoverStyle = {
        left: `${e.pageX + 16}px`,
        top: `${e.pageY + 16}px`
      }

      console.log(this.hoverStyle)
    }
  }
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