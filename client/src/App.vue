<template>
  <div id="adobefashion">
    <transition-fade>
      <blur-overlay
        @click.native="editor = !editor"
        v-if="inView && editor"
      />
    </transition-fade>
    <navigation/>
    <transition-view>
      <router-view
        class="container pb-10 md:pb-20"
      />
    </transition-view>
    <transition-image-editor>
      <image-editor
        v-if="inView && $route.name === 'Thesis'"
        @toggleModal="modal = !modal"
        @toggleEditor="editor = !editor"
        :toggleEditor="editor"
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
    // Preloader: () => import(/* webpackChunkName: "Preloader" */ '@/components/preloader.vue'),
    BlurOverlay: () => import(/* webpackChunkName: "Sections" */ '@/components/blur-overlay.vue'),
    Navigation: () => import(/* webpackChunkName: "Navigation" */ '@/components/navigation.vue'),
    TransitionFade: () => import(/* webpackChunkName: "Transitions" */ '@/components/transitions/transition-fade.vue'),
    TransitionView: () => import(/* webpackChunkName: "Transitions" */ '@/components/transitions/transition-view.vue'),
    TransitionImageEditor: () => import(/* webpackChunkName: "Transitions" */ '@/components/transitions/transition-image-editor.vue'),
    ImageEditor: () => import(/* webpackChunkName: "Images" */ '@/components/image-editor.vue'),
  },
  data() {
    return {
      modal: false,
      editor: false,
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
  watch: {
    inView() {
      if (this.inView === null) this.editor = false
    }
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
  }
}
</script>