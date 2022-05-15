<template>
	<v-app class="grey lighten-4">
		<Navbar/>
		<v-main class="grey lighten-2">
			<router-view></router-view>
		</v-main>
		<Footer/>
	</v-app>
</template>

<script>
	import Navbar from './components/Navbar'
	import Footer from './components/Footer'
	import axios from 'axios'

	export default {
		name: 'App',
		components: {
			Navbar,
			Footer
		},
		beforeCreated() {
			const token = this.$store.state.auth.token		

			if (token) {
				axios.defaults.headers.common['Authorization'] = "Bearer " + token
			} else {
				axios.defaults.headers.common['Authorization'] = ""
			}
		},
		mounted() {
			// const token = this.$store.state.auth.token

			// axios.defaults.headers.common['Authorization'] = "Bearer " + token
		},
	};
</script>

<style lang="scss">
	a {
		text-decoration: none;
	}
	
	.errors {
		color: red;
	}
</style>
