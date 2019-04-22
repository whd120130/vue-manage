import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    items:[],
    permissions: []
}

const mutations = {
    init (state, permissions) {
        this.state.permissions = permissions;
    },
    initMenu(state,menu){
        this.state.items = menu;
    }
}

const actions = {

}


const store =  new Vuex.Store({
    state,
    mutations,
    actions
})

export default store
