<template>
  <div
    class="sticky top-0 md:rounded-xl md:shadow-primary"
  >
    <div class="hidden md:block h-2 rounded-t-full bg-primary"/>
    <ul
      class="hidden md:flex flex-row space-x-6 bg-primary px-4"
    >
      <li 
        class="cursor-pointer"
        @click="setTypeId"
      >
        All
      </li>
      <li
        class="cursor-pointer" 
        @click="setTypeId($event, original.id)"
        v-for="(original, index) in originals"
        :key="`filter-${index}`"
      >
        {{ original.title }}
      </li>
    </ul>
    <div class="md:hidden absolute rounded-xl shadow-primary">
      <div class="h-2 rounded-t-full bg-primary"/>
        <ul
          class="bg-primary space-y-4 px-4"
        >
          <li 
            class="cursor-pointer whitespace-nowrap"
            @click="expanded = !expanded"
          >
            Filter
          </li>
          <transition-expand>
            <div
              v-show="expanded"
            >
              <li 
                class="cursor-pointer whitespace-nowrap"
                @click="setTypeId"
              >
                All
              </li>
              <li
                class="cursor-pointer whitespace-nowrap" 
                @click="setTypeId($event, original.id)"
                v-for="(original, index) in originals"
                :key="`filter-${index}`"
              >
                {{ original.title }}
              </li>
            </div>
          </transition-expand>
        </ul>
      <div class="h-2 rounded-b-full bg-primary"/>
    </div>
    <div class="hidden md:block h-2 rounded-b-full bg-primary"/>
  </div>
</template>

<script>
export default {
  name: 'FilterMenu',
  components: { 
    TransitionExpand: () => import(/* webpackChunkName: "Transitions" */ '@/components/transitions/transition-expand.vue')
  },
  data: () => ({
    expanded: false
  }),
  computed: {
    originals() {
      return this.$store.getters.originals
    },
    stateId() {
      return this.$store.getters.typeId
    }
  },
  methods: {
    setTypeId(e, id) {
      this.$store.commit('clearEdits')
      this.$store.commit('setTypeId', id)
      this.$store.dispatch('fetchEdits')
    },
  },
}
</script>