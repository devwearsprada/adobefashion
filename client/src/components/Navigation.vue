<template>
  <nav 
    :class="[
      'fixed top-0 p-3 md:bg-transparent rounded-full'
    ]"
  >
    <ul>
      <li 
        @click="active = !active"
      >
        <span
          class="cursor-pointer"
        >
          Chapters
        </span>
        <transition-expand>
          <ul 
            class="pl-5" 
            v-if="active"
          >
            <li 
              v-for="(item, index) in menuItems" 
              :key="index"
              class="ml-0 hover:ml-2 transform duration-100"
            >
              <router-link 
                :to="{ hash: item.slug }"
              >
                {{ item.title }}
              </router-link>
            </li>
          </ul>
        </transition-expand>
      </li>
      <li>
        <router-link
          @click.native="active = false"
          :to="{ hash: '#archive' }"
        >
          Archive
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import breakpoints from '@/plugins/breakpoints'

export default {
  name: 'Navigation',
  components: {
    TransitionExpand: () => import(/* webpackChunkName: "Transitions" */ '@/components/transitions/TransitionExpand.vue')
  },
  data() {
    return {
      active: false,
      breakpoints,
    }
  },
  watch: {
    active() {
      if (this.active) {
        this.$emit('menuOpen', ['blurMenu', true])
      } else {
        this.$emit('menuOpen', ['blurMenu', false])
      }
    }
  },
  computed: {
    screen() {
      return this.$store.getters.screen.is
    },
    menuItems() {
      return this.$store.getters.menuItems
    }
  }
}
</script>