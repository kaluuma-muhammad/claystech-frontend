import axios from 'axios';
import router from '../../router'

const state = {
    user: {},
    token: null,
};
const getters = {
    isAuthenticated: state => !!state.user,
    StateUser: state => state.user,
};
const actions = {
    LogIn({commit}, User) {
        axios.post('login', User)
        .then(response => {
            commit('setUser', response.data.user)
            commit('setUserToken', response.data.token)
            
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("user", response.data.user)

            router.push("/dashboard");
        })
    },

    LogOut({commit}){
        axios.post('logout')
        .then(response => {
            let user = null
            let token = null

            commit('LogOut', user)
            commit('LogOut', token)

            localStorage.removeItem("token")
            localStorage.removeItem("user")

            axios.defaults.headers.common['Authorization'] = ""

            router.push("/");
        })
    }
};
const mutations = {
    setUser(state, user){
        state.user = user
    },
    setUserToken(state, token){
        state.token = token
    },
    LogOut(state){
        state.user = null
        state.token = null
    },
};
export default {
    state,
    getters,
    actions,
    mutations
};