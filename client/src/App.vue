<template>
  <div id="adobefashion">
    <transition-fade>
      <preloader
        v-if="preloader"
      />
    </transition-fade>
    <transition-fade>
      <blur-overlay
        v-if="blurMenu || inView && blurEditor"
      />
    </transition-fade>
    <navigation
      @menuOpen="toggleBlur"
    />
    <router-view
      class="container px-3 pt-6 pb-10 md:pt-16 md:pb-20 md:px-0"
      @scrollToTop="scrollToTop"
    />
    <archive-section/>
    <transition-expand>
      <image-editor
        v-if="inView"
        @editorOpen="toggleBlur"
      />
    </transition-expand>
    <scroll-to-top
      v-if="scrollToTopEnabled"
    />
  </div>
</template>

<script>
export default {
  name: 'App',
  metaInfo: {
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} - Adobefashion` : 'Adobefashion';
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'initial-scale=1, user-scalable=no, width=device-width, height=device-height, viewport-fit=cover' }
    ]
  },
  components: {
    Preloader: () => import(/* webpackChunkName: "Preloader" */ '@/components/Preloader.vue'),
    BlurOverlay: () => import(/* webpackChunkName: "Sections" */ '@/components/BlurOverlay.vue'),
    Navigation: () => import(/* webpackChunkName: "Navigation" */ '@/components/Navigation.vue'),
    ArchiveSection: () => import(/* webpackChunkName: "Sections" */ '@/components/sections/ArchiveSection.vue'),
    TransitionFade: () => import(/* webpackChunkName: "Transitions" */ '@/components/transitions/TransitionFade.vue'),
    TransitionExpand: () => import(/* webpackChunkName: "Transitions" */ '@/components/transitions/TransitionExpand.vue'),
    ImageEditor: () => import(/* webpackChunkName: "ImageEditor" */ '@/components/ImageEditor.vue'),
    scrollToTop: () => import(/* webpackChunkName: "ScrollToTop" */ '@/components/ScrollToTop.vue')
  },
  data() {
    return {
      blurMenu: false,
      blurEditor: false,
      scrollToTopEnabled: false,
      preloader: true
    }
  },
  created() {
    // Get thesis
    this.$store.dispatch('fetchThesis')
    // Get originals
    this.$store.dispatch('fetchOriginals')
    // Get edits
    this.$store.dispatch('fetchEdits')
    this.$store.dispatch('fetchEditsCount')
    // Get colophon
    this.$store.dispatch('fetchColophon')
  },
  watch: {
    loaded() {
      if (this.loaded) {
        setTimeout(() => {
          this.preloader = false
        }, 1000)
      }
    }
  },
  computed: {
    loaded() {
      return this.$store.getters.loaded
    },
    inView() {
      return this.$store.getters.inView
    },
  },
  methods: {
    toggleBlur(payload) {
      const data = payload[0]
      const value = payload[1]

      this[data] = value
    },
    scrollToTop(payload) {
      this.scrollToTopEnabled = payload
    }
  }
}
</script>