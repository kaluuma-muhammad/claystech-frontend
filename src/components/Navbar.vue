<template>
    <nav v-if="isLoggedIn">
		<v-app-bar flat dark app class="primary text--white">
			<v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

			<v-toolbar-title class="lighten-4 text-uppercase">
				<span class="font-weight-light">Clays</span>
				<span class="font-weight-bold black--text">Tech</span>
			</v-toolbar-title>

			<v-spacer></v-spacer>

			<v-menu :nudge-width="200" bottom origin="center center" transition="scale-transition" offset-y>
				<template v-slot:activator="{ on, attrs }">
					<v-btn fab class="primary" dark v-bind="attrs" v-on="on" depressed>
						<v-badge color="red accent-2" content="6" overlap>
							<v-icon flat class="white--text">mdi-message</v-icon>
						</v-badge>
					</v-btn>
				</template>

				<v-list>
					<v-list-item>
						<v-card width="400">
							<v-card-title class="black--text mt-8">
								<p class="ml-3"> Messages </p>
							</v-card-title>

							<v-card-text>
								<div class="font-weight-bold ml-8 mb-2"> Today </div>

								<v-timeline align-top dense>
									<v-timeline-item v-for="message in messages"
									:key="message.time"
									:color="message.color" small
									>
									<div>
										<div class="font-weight-normal">
											<strong>{{ message.from }}</strong> @{{ message.time }}
										</div>
										<div>{{ message.message }}</div>
									</div>
									</v-timeline-item>
								</v-timeline>
							</v-card-text>
						</v-card>
					</v-list-item>
				</v-list>
			</v-menu>

			<v-menu :nudge-width="150" bottom origin="center center" transition="scale-transition" offset-y>
				<template v-slot:activator="{ on, attrs }">
					<v-btn fab class="primary" dark v-bind="attrs" v-on="on" depressed>
						<v-badge color="red accent-2" content="9+" overlap>
							<v-icon flat class="white--text">mdi-bell</v-icon>
						</v-badge>
					</v-btn>
				</template>

				<v-list class="grey lighten-2">
					<v-list-item>
						<v-card class="grey lighten-2" width="400" flat>
							<v-card-title class="center">
								<span class="text-h6 font-weight-light">13 new notifications</span>
							</v-card-title>
							<v-divider></v-divider>

							<div v-for="n in notifications" :key="n.notification">
								<v-card-text>
									<v-layout row wrap class="mt-1">
										<v-flex xs3 sm2 md2>
											<v-responsive>
												<v-avatar class="ma-1 accent-4">
													<img :src="n.avatar">
												</v-avatar>
											</v-responsive>
										</v-flex>
										<v-flex xs9 sm10 md10>
											<v-subheader class="black--text" left>
												{{ n.notification }}
											</v-subheader>
										</v-flex>
									</v-layout>
									<v-row align="center" justify="end">
										<span class="subheading">{{ n.date }}</span>
									</v-row>
								</v-card-text>
								<v-divider></v-divider>	
							</div>

							<v-layout row wrap class="mt-1">
								<v-flex xs12 md4></v-flex>
								<v-flex xs12 md4 class="text-center">
									<span class="text-center font-italic"> See More </span>
								</v-flex>
								<v-flex xs12 md4></v-flex>
							</v-layout>
						</v-card>
					</v-list-item>
				</v-list>
			</v-menu>

			<v-btn fab class="primary accent-1" @click="logout" depressed>
				<v-icon flat class="white--text">mdi-exit-to-app</v-icon>
			</v-btn>
		</v-app-bar>

		<v-navigation-drawer app v-model="drawer" class="deep-purple accent-4">
			<v-layout row wrap class="mt-1 mb-1 text-center">
				<v-flex xs4 sm4 md4>
					<v-responsive>
						<v-avatar size="47" class="deep-purple ma-1 accent-4">
							<img src="/avatars/1.jpg">
						</v-avatar>
					</v-responsive>
				</v-flex>
				<v-flex xs6 sm6 md6 class="text-center">
					<h3 link class="white--text ma-3">
						{{ User.fname }} {{ User.lname }}
					</h3>
				</v-flex>
			</v-layout>

			<v-divider></v-divider>

			<v-list nav dense>
				<v-list-item-group sub-group v-model="selectedItem">
					<v-list-item v-for="(link, l) in links" :key="l" router :to="link.route">
						<v-list-item-icon class="white--text">
							<v-icon v-text="link.icon"></v-icon>
						</v-list-item-icon>

						<v-list-item-content class="white--text">
							<v-list-item-title v-text="link.text"></v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list-item-group>
			</v-list>
		</v-navigation-drawer>
	</nav>

</template>

<script>
	import { mapGetters, mapActions } from "vuex"
	// import axios from 'axios'
    export default {
        name: 'Navbar',
        data() {
			return {
                drawer: true,
				selectedItem: 0,
				links: [
					{ text: 'Dashboard', icon: 'mdi-view-dashboard', route: '/dashboard' },
					{ text: 'Job Posts', icon: 'mdi-account-multiple', route: '/posts' },
					{ text: 'Departments', icon: 'mdi-star-circle-outline', route: '/departments' },
					{ text: 'Employees', icon: 'mdi-account-supervisor', route: '/employees' },
					{ text: 'Projects', icon: 'mdi-folder-multiple', route: '/projects' },
					{ text: 'Clients', icon: 'mdi-account-box-multiple-outline', route: '/clients' },
					{ text: 'Expenses', icon: 'mdi-cash-minus', route: '/expenses' },
					{ text: 'Revenues', icon: 'mdi-cash-multiple', route: '/revenues' },
					{ text: 'Payments', icon: 'mdi-cash', route: '/payments' },
					{ text: 'users', icon: 'mdi-account-tie', route: '/users' },
				],
				messages: [
					{from: 'You', message: `Sure, I'll see you later.`, time: '10:42am', color: 'deep-purple lighten-1',},
					{from: 'John Doe', message: 'Yeah, sure. Does 1:00pm work?', time: '10:37am', color: 'green',},
					{from: 'You', message: 'Did you still want to grab lunch today?', time: '9:47am', color: 'deep-purple lighten-1',},
				],
				notifications: [
					{notification: 'Turns out semicolon-less style is easier...', avatar: '/avatars/1.jpg', date: '12.09.2021'},
					{notification: 'Turns out semicolon-less style is a easier...', avatar: '/avatars/2.jpg', date: '9.10.2020'},
					{notification: 'Turns out semicolon-less style is  of ease...', avatar: '/avatars/3.jpg', date: '14.03.2020'}
				]
            }
		},
		methods: {
			...mapActions(["LogOut"]),

			logout (){
                this.$store.dispatch('LogOut')
                // this.$router.push('/')
            }
		},
		computed : {
			...mapGetters({User: "StateUser"}),

            isLoggedIn : function(){
				return this.$store.getters.isAuthenticated
			}
        },
		// created() {
		// 	axios.defaults.headers = {
		// 		'Content-Type': 'application/json',
		// 		Accept: 'application/json',
		// 		Authorization: localStorage.getItem("token")
		// 	}
		// },
    }
</script>