<template>
  <div id="adobefashion">
    <!-- <transition-fade>
      <blur-overlay
        @click.native="blurEditor = false"
        v-if="blurMenu || inView && blurEditor"
      />
    </transition-fade> -->
    <navigation
      @menuOpen="toggleBlur"
    />
    <transition-view>
      <router-view
        class="container pb-10 md:pb-20"
      />
    </transition-view>
    <transition-image-editor>
      <image-editor
        v-if="inView && $route.name === 'Thesis'"
        :editorOpen="blurEditor"
        @editorOpen="toggleBlur"
      />
    </transition-image-editor>
  </div>
</template>

<script>
export default {
  name: 'App',
  metaInfo: {
    titleTemplate: (titleChunk) => {
      return titleChunk 
        ? `${titleChunk} - Adobefashion` 
        : 'Adobefashion'
    },
    meta: [
      { 
        charset: 'utf-8' 
      },
      { 
        name: 'viewport', 
        content: 'initial-scale=1, user-scalable=no, width=device-width, height=device-height, viewport-fit=cover'
      }
    ]
  },
  components: {
    // Preloader: () => import(/* webpackChunkName: "Preloader" */ '@/components/Preloader.vue'),
    // BlurOverlay: () => import(/* webpackChunkName: "Sections" */ '@/components/BlurOverlay.vue'),
    Navigation: () => import(/* webpackChunkName: "Navigation" */ '@/components/Navigation.vue'),
    // ArchiveSection: () => import(/* webpackChunkName: "Sections" */ '@/components/sections/ArchiveSection.vue'),
    // TransitionFade: () => import(/* webpackChunkName: "Transitions" */ '@/components/transitions/TransitionFade.vue'),
    TransitionView: () => import(/* webpackChunkName: "Transitions" */ '@/components/transitions/TransitionView.vue'),
    // TransitionExpand: () => import(/* webpackChunkName: "Transitions" */ '@/components/transitions/TransitionExpand.vue'),
    TransitionImageEditor: () => import(/* webpackChunkName: "Transitions" */ '@/components/transitions/TransitionImageEditor.vue'),
    ImageEditor: () => import(/* webpackChunkName: "ImageEditor" */ '@/components/ImageEditor.vue'),
  },
  data() {
    return {
      blurMenu: false,
      blurEditor: false,
      scrollToTopEnabled: false,
    }
  },
  created() {
    // Get thesis
    this.$store.dispatch('fetchThesis')
    // Get originals
    this.$store.dispatch('fetchOriginals')
    // Get colophon
    this.$store.dispatch('fetchColophon')
  },
  computed: {
    slideAnimation() {
      if (this.previousView === null) return true
      if (this.inView === null) return true 

      return false
    },
    loaded() {
      return this.$store.getters.loaded
    },
    inView() {
      return this.$store.getters.inView
    },
    previousView() {
      return this.$store.getters.previousView
    }
  },
  methods: {
    toggleBlur(payload) {
      const data = payload[0]
      const value = payload[1]

      this[data] = value
    },
  }
}
</script>