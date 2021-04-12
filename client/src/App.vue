<template>
  <div id="adobefashion">
    <transition-fade>
      <preloader 
        v-show="!loaded"
      />
    </transition-fade>

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
    Preloader: () => import(/* webpackChunkName: "preloader" */ '@/components/preloader.vue'),
    BlurOverlay: () => import(/* webpackChunkName: "sections" */ '@/components/blur-overlay.vue'),
    Navigation: () => import(/* webpackChunkName: "navigation" */ '@/components/navigation.vue'),
    TransitionFade: () => import(/* webpackChunkName: "transitions" */ '@/components/transitions/transition-fade.vue'),
    TransitionView: () => import(/* webpackChunkName: "transitions" */ '@/components/transitions/transition-view.vue'),
    TransitionImageEditor: () => import(/* webpackChunkName: "transitions" */ '@/components/transitions/transition-image-editor.vue'),
    ImageEditor: () => import(/* webpackChunkName: "images" */ '@/components/image-editor.vue'),
  },
  data() {
    return {
      editor: false,
    }
  },
  created() {
    console.group(
			"%cDesign & development by:",
			"background: linear-gradient(90deg, rgba(188,191,212,1) 0%, rgba(228,253,65,1) 100%); color: #000000 ; font-weight: bold; padding: 4px ;"
		);
		console.log(
      "%cArthur Boer &",
      "background: linear-gradient(90deg, rgba(188,191,212,1) 0%, rgba(228,253,65,1) 100%); color: #000000 ; padding: 4px ;"
    );
		console.log(
      "%cBoris Smeenk",
      "background: linear-gradient(90deg, rgba(188,191,212,1) 0%, rgba(228,253,65,1) 100%); color: #000000 ; padding: 4px ;"
    );
		console.groupEnd();

    console.log(`%c
_░▒███████
░██▓▒░░▒▓██
██▓▒░__░▒▓██___██████
██▓▒░____░▓███▓__░▒▓██
██▓▒░___░▓██▓_____░▒▓██
██▓▒░_______________░▒▓██
_██▓▒░______________░▒▓██
__██▓▒░____________░▒▓██
___██▓▒░__________░▒▓██
____██▓▒░________░▒▓██
_____██▓▒░_____░▒▓██
______██▓▒░__░▒▓██
_______█▓▒░░▒▓██
_________░▒▓██
_______░▒▓██
_____░▒▓██
    
    `, "font-family:monospace")

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