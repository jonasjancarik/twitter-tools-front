import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    auth: {}
  },
  mutations: {
    updateAuth (state, payload) {
      state.auth = payload.data
    }
  },
  actions: {
  },
  plugins: [createPersistedState()]
})

export default store
