<template>
  <nav class="sticky w-auto top-0 inline-flex p-4 space-x-4 z-30 filter-shadow">
    <div 
      class="rounded-xl transition-all duration-300"
      :class="shadowClass"
    >
      <div 
        class="h-2 rounded-t-full transition-colors duration-300 ease-in-out"
        :class="bgClass"
      />
      <router-link 
        :to="{ name: buttonText }"
        custom
        v-slot="{ navigate }"
      >
        <button
          class="transition-colors duration-300 ease-in-out px-4"
          :class="bgClass"
          @click="navigate"
          role="link"
        >
          {{ buttonText }}
        </button>
      </router-link>
      <div 
        class="h-2 rounded-b-full transition-colors duration-300 ease-in-out"
        :class="bgClass"
      />
    </div>
    <transition-fade>
      <filter-menu
        v-if="$route.name === 'Archive'"
      />
    </transition-fade>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
  components: {
    FilterMenu: () => import(/* webpackChunkName: "navigation" */ '@/components/filter-menu.vue'),
    TransitionFade: () => import(/* webpackChunkName: "transitions" */ '@/components/transitions/transition-fade.vue')
  },
  computed: {
    screen() {
      return this.$store.getters.screen.is
    },
    menuItems() {
      return this.$store.getters.menuItems
    },
    bgClass() { 
      return (this.buttonText === 'Thesis') ? 'bg-primary' : 'bg-secondary'
    },
    shadowClass() {
      return (this.buttonText === 'Thesis') ? 'shadow-primary' : 'shadow-secondary'
    },
    buttonText() {
      if (this.$route.name === 'Thesis') {
        return 'Archive'
      } else {
        return 'Thesis'
      }
    }
  }
}
</script>