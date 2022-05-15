<template>
    <div class="employee mx-4 mb-4">
		<nav class="breadcrumb mt-1" aria-label="breadcrumbs">
            <ul>
                <li class=""><router-link to="/employees">Employees</router-link></li>
                <li class="is-active"><router-link :to="{ name: 'employee', params: { id: employee.id }}">Employee</router-link></li>
            </ul>
        </nav>

		<v-container class="my-3 white lighten-2">
			<v-card flat class="text-center ma-3">
				<v-row>
					<v-col cols="12" sm="6" md="4">
						<v-responsive class="pt-4">
							<v-avatar size="250" class="grey lighten-2">
								<img :src="employee.image">
							</v-avatar>
						</v-responsive>
					</v-col>

					<v-col cols="12" sm="6" md="8">
						<h3>Additional Detailes</h3>
					</v-col>
				</v-row>

				<v-card-text>
					<v-row>
						<v-col cols="12" sm="4" md="3">
							<h3 class="subheading"> Names </h3>
							<p> {{ employee.names }} </p>

							<h3 class="subheading"> Address </h3>
							<p> {{ employee.address }}</p>

							<h3 class="subheading"> Salary </h3>
							<p> {{ employee.salary }}/=</p>
						</v-col>
						
						<v-col cols="12" sm="4" md="3">
							<h3 class="subheading"> Email </h3>
							<p> {{ employee.email }} </p>

							<h3 class="subheading"> Country </h3>
							<p>  {{ employee.nation.name }} </p>

							<h3 class="subheading"> Gender </h3>
							<p> {{ employee.gender }} </p>
						</v-col>

						<v-col cols="12" sm="4" md="3">
							<h3 class="subheading"> Contact </h3>
							<p> +({{ employee.phone.PhoneCode }}){{ employee.contact }} </p>

							<h3 class="subheading"> Department </h3>
							<p> {{ employee.department.depart_name }} Department</p>

							<h3 class="subheading"> Contract Start </h3>
							<p> {{ formatDate(employee.contract_start) }}</p>
						</v-col>
						
						<v-col cols="12" sm="4" md="3">
							<h3 class="subheading"> N.I.N </h3>
							<p> {{ employee.n_i_d }} </p>

							<h3 class="subheading"> Job Post </h3>
							<p> {{ employee.post.post_title }} </p>

							<h3 class="subheading"> Contract End </h3>
							<p> {{ formatDate(employee.contract_end) }} </p>
						</v-col>
					</v-row>
					
				</v-card-text>

				<v-card-actions>
					<router-link :to="{ name: 'edit-employee', params: { id: employee.id }}">
						<v-btn depressed small class="primary">
							<v-icon small left>mdi-pencil</v-icon>
							<span>Edit Employee</span>
						</v-btn>
					</router-link>
					<v-spacer></v-spacer>

					<v-btn depressed small dark class="red" @click="deleteEmployee(employee.id)">
						<v-icon small left>mdi-delete</v-icon>
						<span>Delete Employee</span>
					</v-btn>
				</v-card-actions>
			</v-card>
        </v-container>
    </div>
</template>

<script>
	import axios from 'axios'
	import moment from 'moment'

	export default {
		name: 'Employee',
		data: () => ({
			employee: [],
		}),

		mounted() {
			this.getEmployee()
		},
		
		methods: {
			formatDate(value) {
                return moment(value).format("Do-MMM-YYYY")
            },

			getEmployee() {
                const empId = this.$route.params.id

				axios.get(`employees/${empId}`)
				.then(response => {
					this.employee = response.data.employee
				})
				.catch(error => {
					if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
				})
			},

			deleteEmployee(id) {
				axios.delete(`employees/${id}/`)
                .then(response => {
                    this.$router.push('/employees')
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
