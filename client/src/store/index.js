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
    previousView: null,
    typeId: false
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
    clearEdits(state) {
      state.totalEdits = 0
      state.editsCount = 0
      state.edits = []
    },
    setColophon(state, colophon) {
      state.colophon = colophon
    },
    setInView(state, original) {
      state.inView = original
    },
    setPreviousView(state, original) {
      state.previousView = original
    },
    setTypeId(state, id) {
      let type = (id)
        ? id
        : false

      state.typeId = type
    }
  },
  actions: {
    fetchThesis({ commit }) {
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
    fetchEditsNew({ commit, state }, $state) {
      let id = state.typeId

      let count = (id)
      ? `${process.env.VUE_APP_API_URL}/edits/count?original.id=${id}`
      : `${process.env.VUE_APP_API_URL}/edits/count`
      
      let url = (id) 
        ? `${process.env.VUE_APP_API_URL}/edits?original.id=${id}&_limit=10&_start=${state.editsCount}`
        : `${process.env.VUE_APP_API_URL}/edits?_limit=10&_start=${state.editsCount}`    


      console.log(url);
      
      axios.get(count)
      .then(response => {
        // set total edit count
        commit('setTotalEdits', response.data)
        axios.get(url)
        .then(response => {
          // check if all items are fetched
          if (state.editsCount < state.totalEdits) {
            commit('pushEdits', response.data)
            commit('addEditsCount', response.data.length)
            $state.loaded()
          } else {
            // all items are fetched
            $state.complete()
          }
        })
      })
      .catch(error => {
        console.log(error);
      })
    },
    fetchColophon({ commit }) {
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

      commit('setPreviousView', state.inView)
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
    previousView(state) {
      return state.previousView
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
