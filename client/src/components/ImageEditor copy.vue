<template>
<div class="shadow-secondary fixed bottom-0 right-0 safe-bottom md:right-14 md:w-6/12 lg:w-4/12 w-full bg-secondary">
  <div 
    class="test"
  >
    <transition-expand> 
      <div v-show="editorVisible">
        <div class="grid grid-cols-1 grid-rows-1" v-show="!startEdit">
          <img class="col-span-1 col-start-1 row-start-1" :src="api + original.image.url"/>
          <button @click="startEdit = true" class="z-10 focus:outline-none col-span-1 col-start-1 row-start-1 bg-gradient-to-t from-secondary to-transparent h-full w-full">
            Click/tap to edit
          </button>
        </div>
        <warp 
          v-show="startEdit"
          :key="original._id"
          :image="api + original.item.url" 
          :saveEdit="save" 
          :resetEdit="reset"
          @reset="reset = false"
          @save="save = false"
        />
      </div>
    </transition-expand>
    <div class="grid grid-cols-3 p-2" @click="editorVisible = !editorVisible">
      <button class="text-left focus:outline-none" v-show="editorVisible" @click.stop="save = true; startEdit = false">
        Save
      </button>
      <div class="font-hadogenes-regular text-center text-3xl uppercase col-start-2 whitespace-nowrap">
        {{ original.title }}
      </div>
      <button class="text-right focus:outline-none" v-show="editorVisible" @click.stop="reset = true">
        Reset
      </button>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'ImageEditor',
  props: {
    editorOpen: {
      type: Boolean,
      required: true
    }
  },
  components: {
    TransitionExpand: () => import(/* webpackChunkName: "Transitions" */ '@/components/transitions/TransitionExpand.vue'),
    Warp: () => import(/* webpackChunkName: "Warp" */ '@/components/Warp.vue')
  },
  data() {
    return {
      api: process.env.VUE_APP_API_URL,
      editorVisible: false,
      startEdit: false,
      reset: false,
      save: false
    }
  },
  created() {
    this.$emit('editorOpen', ['blurEditor', false])
  },
  watch: {
    editorVisible() {
      if (this.editorVisible) {
        this.$emit('editorOpen', ['blurEditor', true])
      } else {
        this.$emit('editorOpen', ['blurEditor', false])
        setTimeout(() => {
          this.startEdit = false
        }, 250)
      }
    },
    editorOpen() {
      if (!this.editorOpen) this.editorVisible = false
    }
  },
  computed: {
    original() {
      return this.$store.getters.inView
    }
  },
}
</script>

<style>
@-webkit-keyframes Pulse {
	0% { -webkit-box-shadow: 0 0 2rem rgba(228, 253, 65, .8) }
	50% { -webkit-box-shadow: 0 0 2rem rgba(228, 253, 65, 1) }
	100% { -webkit-box-shadow: 0 0 2rem rgba(228, 253, 65, .8) }
}

@keyframes Pulse {
	0% { box-shadow: 0 0 2rem rgba(228, 253, 65, .8) }
	50% { box-shadow: 0 0 2rem rgba(228, 253, 65, 1) }
	100% { box-shadow: 0 0 2rem rgba(228, 253, 65, .8) }
}
</style>