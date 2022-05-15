<template>
    <div class="employees-grid">
		<v-container class="my-3 white lighten-2">
			<v-layout row wrap class="pt-1">
				<v-flex xs12 sm6 md4 lg3 v-for="e in employees" :key="e.id">
					<v-hover v-slot="{ hover }">
						<v-card flat :elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }" class="grey lighten-3 text-center ma-3">
							<v-responsive class="pt-4">
								<v-avatar size="80" class="grey lighten-2">
									<img :src="e.image">
								</v-avatar>
							</v-responsive>

							<v-card-text>
								<div class="subheading"> {{ e.names }} </div>
								<div class="grey--text"> {{ e.email }} </div>
								<div class="grey--text"> {{ e.post.post_title }} </div>
							</v-card-text>

							<v-card-actions>
								<v-spacer></v-spacer>
								<router-link :to="{ name: 'employee', params: { id: e.id }}">
									<v-btn depressed small class="info lighten-2">
										<v-icon small left>mdi-eye</v-icon>
										<span>View</span>
									</v-btn>
								</router-link>
								<v-spacer></v-spacer>
							</v-card-actions>
						</v-card>
					</v-hover>
				</v-flex>
			</v-layout>
        </v-container>
    </div>
</template>

<script>
	import axios from 'axios'
	export default {
		name: 'EmployeesGridView',
		data: () => ({
			employees: [],
		}),

		mounted() {
			this.getEmployees()
		},
		
		methods: {
			getEmployees() {
				axios.get('employees/')
				.then(response => {
					this.employees = response.data.employees
				})
				.catch(error => {
					if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
				})
			},
		},
	}
</script>

<style lang="sass" scoped>
.v-card.on-hover.theme--dark
  background-color: rgba(#FFF, 0.8)
  >.v-card__text
    color: #000
</style>
