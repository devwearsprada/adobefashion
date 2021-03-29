<template>
  <section
    id="archive"
    ref="archive"
    class="relative z-10 min-h-screen w-full bg-secondary text-black shadow-secondary-large"
  >
    <div class="grid grid-cols-1 md:grid-cols-3 md:gap-12 p-3 md:p-12">
      <div class="col-span-2">
        <ul class="sticky top-0 z-10 py-3 flex text-base justify-between md:justify-start md:text-xl bg-secondary">
          <li
            class="md:pr-3 cursor-pointer"
            @click="selectedFilter = null"
            v-scroll-to="{ el: '#archive', lazy: true }"
          >
            All
          </li>
          <li
            class="md:px-3 cursor-pointer" 
            v-for="(original, index) in originals"
            :key="index"
            @click="selectedFilter = original.title"
            v-html="original.title"
            v-scroll-to="{ el: '#archive', lazy: true }"
          />
        </ul>
        <div
          :class="['grid gap-3 md:gap-y-0 md:gap-x-2', `xl:grid-cols-${this.originals.length} lg:grid-cols-4 md:grid-cols-3 grid-cols-2`]"
          v-if="filterEdits.length > 0"
        >
          <figure
            v-for="(edit, index) in filterEdits"
            :key="edit._id"
            :style="{'--i': index}"
          >
            <img
              :src="api + edit.image.url" 
              :alt="edit.image.alternativeText"
            />
            <figcaption
              class="font-hadogenes-regular text-center uppercase"
              v-html="edit.title"
            />
          </figure>
          <infinite-loading 
            @infinite="loadMore" 
            :key="originals[0]._id"
          >
            <div slot="spinner">Loading...</div>
            <div slot="no-more" class="text-left"></div>
            <div slot="no-results" class="text-left"></div>
          </infinite-loading>
        </div>
      </div>
      <div 
        class="font-beaufort-regular col-span-1"
      >
        <div class="sticky top-0 py-6 md:py-12">
          <div
            class="pb-6"
            v-html="colophon.content"
          />
          <div class="flex flex-row-reverse">
            <img
              class="self-start w-24 p-2" 
              v-for="(logo, i) in colophon.logo"
              :key="i"
              :src="api + logo.image.formats.thumbnail.url" 
              :alt="logo.image.alternativeText"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import EventBus from '@/event-bus'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'Archive',
  components: {
    InfiniteLoading
  },
  data() {
    return {
      api: process.env.VUE_APP_API_URL,
      selectedFilter: null
    }
  },
  mounted() {
    // Observe archive
    EventBus.$emit('observeArchive', this.$refs.archive)
  },
  methods: {
    loadMore($state) {
      this.$store.dispatch('fetchEdits', $state)
    },
    test() {
      console.log('s');
    }
  },
  computed: {
    colophon() {
      return this.$store.getters.colophon
    },
    originals() {
      return this.$store.getters.originals
    },
    edits() {
      return this.$store.getters.edits
    },
    filterEdits() {
      let arr = this.edits
      if (this.selectedFilter !== null) {
        return arr.filter(entry => {
          return entry.title.includes(this.selectedFilter)
        })
      } else {
        return arr
      }
    },
    totalEdits() {
      return this.$store.getters.totalEdits
    }
  }
}
</script>