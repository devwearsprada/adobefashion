<template>
  <div
    class="fixed bottom-0 right-0 cursor-pointer w-full md:w-8/12 md:max-w-lg lg:w-6/12 lg:max-w-lg xl:w-4/12 xl:max-w-2xl p-4"
    @click="editorVisible = true"
  >
    <div 
      class="rounded-2xl shadow-secondary"
    >
      <div class="relative h-4 rounded-t-full bg-secondary">
        <div class="absolute flex justify-center items-center border-black border bg-primary right-5 -mt-5 rounded-full w-8 h-8">?</div>
      </div>
      <div class="bg-secondary">
        <transition-expand>
          <div
            v-show="editorVisible"
          >
            <div
              v-show="intro"
              @click="intro = false"
              class="relative"
            >
              <div
                class="absolute flex justify-center items-center w-full h-full bg-secondary bg-opacity-40 z-10"
              >
                Click to start editing
              </div>
              <image-lazy
                class="rounded-xl"
                :key="original.id"
                :backgroundColor="'#e4fd41'"
                :width="original.image.width"
                :height="original.image.height"
                :src="api + original.image.formats.small.url"
                :lazy-src="(original.image.formats.medium) 
                            ? api + original.image.formats.medium.url 
                            : api + original.image.formats.small.url"
                :lazy-srcset="api + original.image.url"
              />
            </div>
            <div
              class="absolute w-full h-full bg-secondary flex justify-center items-center"
              v-if="saving && !intro"
            >
              Your look has been published to the archive
            </div>
            <div v-show="!intro">
              <warp 
                :key="original._id"
                :image="api + original.item.url" 
                :saveEdit="save" 
                :resetEdit="reset"
                @reset="reset = false"
                @save="save = false"
              />
            </div>
            <!-- <transition-fade>
              <div
                class="absolute w-full h-full bg-secondary flex justify-center items-center"
                v-if="saving"
              >
                Your look has been published to the archive
              </div>
            </transition-fade> -->
            <!-- <warp 
              v-show="startEdit"
              :key="original._id"
              :image="api + original.item.url" 
              :saveEdit="save" 
              :resetEdit="reset"
              @reset="reset = false"
              @save="save = false"
            /> -->
          </div>
        </transition-expand>
        <div class="grid grid-cols-4">
          <button>
            Click
          </button>
          <h1 class="font-hadogenes-regular text-2xl lg:text-3xl uppercase text-center col-start-2 col-span-2">
            {{ original.title }}
          </h1>
          <button>
            Save
          </button>
        </div>
      </div>
      <div class="h-4 rounded-b-full bg-secondary"/>
    </div>
  </div> 
</template>

<script>
export default {
  name: 'ImageEditor',
  props: {
    editorOpen: {
      type: Boolean,
      required: true,
    }
  },
  components: {
    ImageLazy: () => import('@/components/image-lazy.vue'),
    // TransitionFade: () => import(/* webpackChunkName: "Transitions" */ '@/components/transitions/TransitionFade.vue'),
    TransitionExpand: () => import(/* webpackChunkName: "Transitions" */ '@/components/transitions/TransitionExpand.vue'),
    Warp: () => import(/* webpackChunkName: "Warp" */ '@/components/Warp.vue')
  },
  data() {
    return {
      api: process.env.VUE_APP_API_URL,
      editorVisible: false,
      startEdit: true,
      intro: true,
      reset: false,
      saving: true,
      save: false,
    }
  },
  watch: {
    original() {
      this.intro = true
      console.log('new');
    }
  },
  computed: {
    original() {
      return this.$store.getters.inView
    },
    previousView() {
      return this.$store.getters.previousView
    }
  },
}
</script>