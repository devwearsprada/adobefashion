import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash && to.params.scroll !== false) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ 
            selector: to.hash, 
            behavior: 'smooth'
          })
        }, 500)
      })
    } else if (savedPosition) {
      return savedPosition
    } else {
      return
    }
  }
})

export default router