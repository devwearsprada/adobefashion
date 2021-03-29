<template>
  <img 
    :data-src="lazySrc"
    :data-srcset="lazySrcset"
    :style="style"
    class="preload"
  />
</template>

<script>
import lozad from 'lozad'

export default {
  name: 'ImageLazy',
  props: {
    backgroundColor: {
      type: String,
      default: '#bcbfd4'
    },
    height: {
      type: Number,
      default: null
    },
    lazySrc: {
      type: String,
      default: null
    },
    lazySrcset: {
      type: String,
      default: null
    },
    width: {
      type: Number,
      default: null
    }
  },
  data: () => ({
    loading: true
  }),
  computed: {
    aspectRatio() {
      // Calculate aspect ratio of the image
      // if width and height are given
      if (!this.width || !this.height) return null
      return (this.height / this.width) * 100
    },
    style() {
      // background color is used as a placeholder
      // while loading the image
      const style = { backgroundColor: this.backgroundColor }

      if (this.width) style.width = `${this.width}px`

      // if image is this loading and aspect ratio
      // could be calculated, apply aspect ratio by
      // using padding top
      const applyAspectRatio = this.loading && this.aspectRatio
      if (applyAspectRatio) {
        // prevent flash of unstyled image
        // after image has loaded
        style.height = 0
        // scale container according to aspect ratio
        style.paddingTop = `${this.aspectRatio}%`
      }

      return style
    }
  },
  mounted() {
    // as soon as the img element triggers the load
    // event, the loading state is set to false, which
    // removes the aspect ratio we've set earlier
    const setLoadingState = () => {
      this.loading = false
    }
    this.$el.addEventListener('load', setLoadingState)
    // we remove the listener as soon as the component
    // is destroyed to prevent potential memory leaks
    this.$once('hook:destroyed', () => {
      this.$el.removeEventListener('load', setLoadingState)
    })

    const observer = lozad(this.$el)
    observer.observe()
  }
}
</script>