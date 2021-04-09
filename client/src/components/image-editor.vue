<template>
  <div
    class="fixed bottom-0 right-0 z-40 cursor-pointer w-full filter-shadow md:w-8/12 md:max-w-lg lg:w-6/12 lg:max-w-lg xl:w-4/12 xl:max-w-2xl p-4"
  >
    <div 
      class="rounded-2xl shadow-secondary"
    >
      <div class="relative h-4 rounded-t-full bg-secondary">
        <div
          class="absolute flex justify-center items-center border-black border bg-primary right-2 md:right-5 -mt-7 md:-mt-5 rounded-full w-10 h-10 select-none md:w-8 md:h-8 transition-all transform hover:scale-110"
          @click="toggleInstruction"
        >
          {{ instructions ? 'X' : '?'}}
        </div>
      </div>

      <transition-expand>
        <div 
          v-show="toggleEditor"
          class="bg-secondary select-none"
        >

          <transition-fade>
            <div
              v-if="instructions"
              class="absolute z-10 px-2 flex w-full h-full bg-secondary select-none overflow-scroll"
            > 
              Dear Visitor,
              <br/><br/>
              The images, which pop up as you read and scroll the text, each show a “look” that caught Rosalie’s attention on the street.
              <br/><br/>
              Like Rosalie, you can manipulate and change each look by dragging, pulling or swiping details in the image. If you are content with your re-design, you can save your version to the archive. If you want to start over, click “re-set.”
              <br/><br/>
              Click in the text to close the pop-up image and read on.
              <br/><br/>
              To view all versions of the five looks, including yours, click “archive.”
              <br/><br/>
              “Look 5,” the bag, will be actually produced  in a limited series of manipulated versions. In the archive, you can see which versions of “Look 5” are still available for sale.
              <br/><br/>
            </div>
          </transition-fade>

          <div
            class="bg-secondary"
            v-if="!editing"
            @click="editing = !editing"
          >
            <div
              class="absolute flex justify-center items-center w-full h-full bg-secondary bg-opacity-50 select-none"
            >
              {{ startEditText }}
            </div>
            
            <image-lazy
              :key="original.id"
              :width="original.image.width"
              :height="original.image.height"
              :backgroundColor="'rgb(228 253 65)'"
              :lazy-src="api + original.image.formats.small.url"
              :lazy-srcset="api + original.image.url"
            />
          </div>

            <div
              v-if="save"
              class="absolute flex justify-center items-center w-full h-full bg-secondary bg-opacity-50 select-none"
            >
              <img
                v-if="spinner" 
                class="w-1/4 animate-spin-slow" 
                src="@/assets/images/AF_006.png"
              />
              <span 
                class="text-center"
                v-else
              >
                Your edit has been published<br/> to the archive
              </span>
            </div>
            <warp-image
              v-show="editing"
              :key="original.item.id"
              :image="api + original.item.url"
              :width="original.item.width"
              :height="original.item.height"
              :resetEdit="reset"
              @reset="reset = false"
              :saveEdit="save"
              @save="saving"
            />
        </div>
      </transition-expand>

      <div class="grid grid-cols-5 grid-rows-1 bg-secondary px-2">
        <button 
          class="col-span-1 text-left select-none focus:outline-none"
          :disabled="save"
        >
          <transition-fade>
            <span 
              v-show="toggleEditor && editing"
              @click="save = true"
            >
              Save
            </span>
          </transition-fade>
        </button>
        <div 
          class="col-span-3 text-center font-hadogenes-regular text-3xl uppercase select-none whitespace-nowrap"
          @click="$emit('toggleEditor')"
        >
          <div class="transition-all ease-in-out transform hover:scale-110">{{ original.title }}</div>
        </div>
        <button class="col-span-1 text-right select-none focus:outline-none">
          <transition-fade>
            <span 
              v-show="toggleEditor && editing"
              @click="reset = true"
            >
              Reset
            </span>
          </transition-fade>
        </button>
      </div>

      <div class="h-4 rounded-b-full bg-secondary"/>
    </div>
  </div> 
</template>

<script>
import { isMobile } from 'mobile-device-detect';

export default {
  name: 'ImageEditor',
  props: {
    toggleEditor: {
      type: Boolean,
      required: true,
    }
  },
  components: {
    WarpImage: () => import('@/components/warp-image.vue'),
    ImageLazy: () => import('@/components/image-lazy.vue'),
    TransitionExpand: () => import(/* webpackChunkName: "Transitions" */ '@/components/transitions/TransitionExpand.vue'),
    TransitionFade: () => import(/* webpackChunkName: "Transitions" */ '@/components/transitions/TransitionFade.vue')
},
  data() {
    return {
      api: process.env.VUE_APP_API_URL,
      expanded: false,
      editing: false,
      reset: false,
      save: false,
      spinner: true,
      instructions: false,
    }
  },
  watch: {
    toggleEditor() {
      if (!this.toggleEditor) {
        setTimeout(() => {
          this.editing = false
          this.instructions = false
        }, 300)
      }
    }
  },
  methods: {
    saving() {
      setTimeout(() => {
        this.spinner = false
      }, 3000)
      setTimeout(() => {
        this.save = false
        this.$nextTick(() => {
          this.spinner = true
        })
      }, 5000)
    },
    toggleInstruction() {
      if (this.instructions) {
        this.instructions = false
      } else {
        this.instructions = true
        if (!this.toggleEditor) {
          this.$emit('toggleEditor')
        }
        this.toggleEditor = true
      }      
    }
  },
  computed: {
    startEditText() {
      return isMobile ? 'Tap to start editing' : 'Click to start editing'
    },
    original() {
      return this.$store.getters.inView
    },
    previousView() {
      return this.$store.getters.previousView
    }
  },
}
</script>