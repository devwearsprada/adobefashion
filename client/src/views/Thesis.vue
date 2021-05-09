<template>
  <div>
    <component 
      v-for="(section, index) in thesis.body"
      :key="index"
      :is="section.__component"
      :data="section"
      @observe="observeSection"
    />
    <colophon/>
  </div>
</template>

<script>
import store from '@/store'

export default {
  name: 'Thesis',
  metaInfo() {
    return {
      title: this.title,
      bodyAttrs: {
        class: 'bg-primary'
      }
    }
  },
  components: { 
    'sections.anchor-look': () => import(/* webpackChunkName: "sections" */ '@/components/sections/anchor-look-section.vue'),
    'sections.anchor': () => import(/* webpackChunkName: "sections" */ '@/components/sections/anchor-section.vue'),
    'sections.look': () => import(/* webpackChunkName: "sections" */ '@/components/sections/look.vue'),
    'sections.footnotes': () => import(/* webpackChunkName: "sections" */ '@/components/sections/footnotes.vue'),
    Colophon: () => import(/* webpackChunkName: "sections" */ '@/components/sections/colophon.vue')
  },
  data() {
    return {
      title: null,
      sectionObserver: null,
      oldPos: null,
    }
  },
  mounted() {
    // Initialize intersection observer
    this.initIntersectionObserver()
  },
  async beforeRouteEnter(to, from, next) {
    await store.dispatch('calculateInView', null)
    next()
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
      this.$nextTick(() => {
        this.sectionObserver.observe(element)
      })
    },
    sectionObserverHandler(entries) {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const originalId = entry.target.dataset.id 
          const sectionId = entry.target.id
          const hashedId = `#${sectionId}`;

          // set original image that is in view
          if (originalId)  {
            this.$store.dispatch('calculateInView', originalId)
           } else {
            this.$store.dispatch('calculateInView', null)
           }

          // update route hash
          if (hashedId !== this.$route.hash)
            this.$router.push({ hash: hashedId, params: { scroll: false } })
        } else {
          if (entries.length === 1) {
            this.$store.dispatch('calculateInView', null)
          }
        }
      }
    },
  },
}
</script>
