import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import axios from 'axios'
import store from './store'

axios.defaults.baseURL = 'http://127.0.0.1:8000/api/'

Vue.config.productionTip = false

new Vue({
	axios,
	vuetify,
	router,
	store,
	render: h => h(App)
}).$mount('#app')
