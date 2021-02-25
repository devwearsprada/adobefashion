import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'
import api from '@/services/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    thesis: [],
    colophon: [],
    originals: [],
    edits: [],
    totalEdits: 0,
    editsCount: 0,
    inView: null,
  },
  mutations: {
    setThesis(state, thesis) {
      state.thesis = thesis
    },
    setOriginals(state, originals) {
      state.originals = originals
    },
    pushEdits(state, edits) {
      state.edits.push(...edits)
    },
    addEditsCount(state, number) {
      state.editsCount += number
    },
    setTotalEdits(state, number) {
      state.totalEdits = number
    },
    setColophon(state, colophon) {
      state.colophon = colophon
    },
    setInView(state, original) {
      state.inView = original
    }
  },
  actions: {
    fetchThesis({commit}) {
      api.getThesis((thesis, error) => {
        if (error) {
          throw error
        }
        commit('setThesis', thesis)
      })
    },
    fetchOriginals({ commit }) {
      api.getOriginals((originals, error) => {
        if (error) {
          throw error
        }
        commit('setOriginals', originals)
      })
    },
    fetchEdits({ commit, state}, $state) {
      axios.get(`${process.env.VUE_APP_API_URL}/edits?_limit=10&_start=${state.editsCount}`)
        .then(response => {
          commit('pushEdits', response.data)
          commit('addEditsCount', 10)

          if (state.edits.length === state.totalEdits && state.edits.length !== 0) {
            $state.complete()
          } else {
            if ($state !== undefined) {
              $state.loaded()
            }
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
    fetchEditsCount({commit}) {
      axios.get(`${process.env.VUE_APP_API_URL}/edits/count`)
        .then(response => {
          commit('setTotalEdits', response.data)
        })
        .catch(error => {
          console.log(error);
        })
    },
    fetchColophon({commit}) {
      api.getColophon((colophon, error) => {
        if (error) {
          throw error
        }
        commit('setColophon', colophon)
      })
    },
    calculateInView({ commit, state }, id) {
      let inView
      if (id) {
        inView = state.originals.filter(original => {
          return original.id === id
        })[0]
      } else {
        inView = null
      }

      commit('setInView', inView)
    }
  },
  getters: {
    loaded(state) {
      return (typeof state.thesis === "object" 
              && typeof state.colophon === "object"
              && state.originals.length > 0
              && state.edits.length >= 0)
    },
    thesis(state) {
      return state.thesis
    },
    originals(state) {
      return state.originals
    },
    edits(state) {
      return state.edits
    },
    totalEdits(state) {
      return state.totalEdits
    },
    colophon(state) {
      return state.colophon
    },
    inView(state) {
      return state.inView
    },
    menuItems(state) {
      return state.thesis.body.filter(anchor => {
        return anchor.__component === 'sections.anchor-look' 
          || anchor.__component === 'sections.anchor' 
      })
    }
  },
  modules: {
  }
})
