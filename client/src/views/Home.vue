<template>
  <div>
    <component 
      v-for="(section, index) in thesis.body"
      :key="index"
      :is="section.__component"
      :data="section"
      @observe="observeSection"
    />
  </div>
</template>

<script>
import breakpoints from '@/plugins/breakpoints'
import EventBus from '@/event-bus'

export default {
  name: 'Home',
  metaInfo() {
    return {
      title: this.title
    }
  },
  components: { 
    'sections.anchor-look': () => import(/* webpackChunkName: "Sections" */ '@/components/sections/AnchorLookSection.vue'),
    'sections.anchor': () => import(/* webpackChunkName: "Sections" */ '@/components/sections/AnchorSection.vue'),
    ImageEditor: () => import(/* webpackChunkName: "Warp" */ '@/components/ImageEditor.vue')
  },
  data() {
    return {
      breakpoints,
      title: null,
      sectionObserver: null,
      oldPos: null,
    }
  },
  mounted() {
    // Initialize intersection observer
    this.initIntersectionObserver()
    // Event emitted by archive
    EventBus.$on('observeArchive', element => {
      this.observeSection(element)
    })
  },
  computed: {
    thesis() {
      return this.$store.getters.thesis
    },
  },
  methods: {
    initIntersectionObserver() {
      const options = { 
        rootMargin: '0px 0px -100%', 
        threshold: 0
      }

      this.sectionObserver = new IntersectionObserver(this.sectionObserverHandler, options)
    },
    observeSection(element) {
      this.sectionObserver.observe(element)
    },
    sectionObserverHandler(entries) {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const originalId = entry.target.dataset.id 
          const sectionId = entry.target.id
          const hashedId = `#${sectionId}`;

          // set original image that is in view
          (originalId) 
            ? this.$store.dispatch('calculateInView', originalId) 
            : this.$store.dispatch('calculateInView', null)

          // update route hash
          if (hashedId !== this.$route.hash)
            this.$router.push({ hash: hashedId, params: { scroll: false } })

          // show scroll to top at the archive section
          if (sectionId === 'archive') {
            this.oldPos = window.pageYOffset || document.documentElement.scrollTop
            window.addEventListener('scroll', this.moveToTop)
          } else {
            this.oldPos = null
            window.removeEventListener('scroll', this.moveToTop)
          }
        }
      }
    },
    moveToTop() {
      const top = window.pageYOffset || document.documentElement.scrollTop
      const value = top - this.oldPos

      if (breakpoints.is === 'sm' && breakpoints.is === 'all') {
        if (value >= 3000) {
          this.$emit('scrollToTop', true)
        } else {
          this.$emit('scrollToTop', false)
        }
      } else {
        if (value >= 500) {
          this.$emit('scrollToTop', true)
        } else {
          this.$emit('scrollToTop', false)
        }
      }
    }
  },
}
</script>
