<template>
    <div class="dashboard mx-4 mb-4">
        <nav class="breadcrumb mt-1" aria-label="breadcrumbs">
            <ul>
                <li class=""><router-link to="/employees">Employees</router-link></li>
                <li class="is-active"><router-link to="/add-employee">Add Employee</router-link></li>
            </ul>
        </nav>

        <v-container class="my-2 white">
            <form class="mx-4 mb-4">
                <v-row>
                    <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="employee.names" label="Names" ></v-text-field>

                        <span class="errors" v-if="errors && errors.names">
                            {{ errors.names[0] }}
                        </span>
                    </v-col>

                    <v-col cols="12" sm="12" md="6">
                        <v-autocomplete v-model="employee.department_id" :items="departments"
                            item-text="depart_name" item-value="id" label="Department" placeholder="Select Department">
                        </v-autocomplete>

                        <span class="errors" v-if="errors && errors.department_id">
                            {{ errors.department_id[0] }}
                        </span>
                    </v-col>

                    <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="employee.email" label="Email"></v-text-field>

                        <span class="errors" v-if="errors && errors.email">
                            {{ errors.email[0] }}
                        </span>
                    </v-col>

                    <v-col cols="12" sm="12" md="6">
                        <v-autocomplete v-model="employee.role_post" :items="posts"
                            item-text="post_title" item-value="id" label="Role Post" placeholder="Select Role Post">
                        </v-autocomplete>

                        <span class="errors" v-if="errors && errors.role_post">
                            {{ errors.role_post[0] }}
                        </span>
                    </v-col>

                    <v-col cols="6" sm="4" md="2">
                        <v-autocomplete v-model="employee.phone_code" :items="countries"
                            item-text="PhoneCode" item-value="id" label="Area Code" placeholder="Select Code">
                        </v-autocomplete>

                        <span class="errors" v-if="errors && errors.phone_code">
                            {{ errors.phone_code[0] }}
                        </span>
                    </v-col>

                    <v-col cols="6" sm="8" md="4">
                        <v-text-field v-model="employee.contact" label="Contact" ></v-text-field>

                        <span class="errors" v-if="errors && errors.contact">
                            {{ errors.contact[0] }}
                        </span>
                    </v-col>

                    <v-col cols="12" sm="12" md="6">
                        <v-autocomplete v-model="employee.country_id" :items="countries"
                            item-text="name" item-value="id" label="Country" placeholder="Select Country">
                        </v-autocomplete>

                        <span class="errors" v-if="errors && errors.country_id">
                            {{ errors.country_id[0] }}
                        </span>
                    </v-col>

                    <v-col cols="12" sm="12" md="6">
                        <v-file-input type="file" v-model="employee.image" :rules="rules" accept="image/png, image/jpeg, image/bmp"
                            placeholder="Pick an image" prepend-icon="mdi-camera" label="Image">
                        </v-file-input>

                        <span class="errors" v-if="errors && errors.image">
                            {{ errors.image[0] }}
                        </span>
                    </v-col>

                    <v-col cols="12" sm="8" md="6">
                        <v-text-field v-model="employee.address" label="Address" ></v-text-field>

                        <span class="errors" v-if="errors && errors.address">
                            {{ errors.address[0] }}
                        </span>
                    </v-col>

                    <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="employee.salary" label="Salary" ></v-text-field>

                        <span class="errors" v-if="errors && errors.salary">
                            {{ errors.salary[0] }}
                        </span>
                    </v-col>

                    <v-col cols="3" sm="3" md="3">
                        <v-menu origin="center center" transition="scale-transition">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field  v-bind="attrs" v-on="on" :value="employee.contract_start" label="Contract From"></v-text-field>
                            </template>

                            <v-list>
                                <v-list-item>
                                    <v-date-picker v-model="employee.contract_start" flat></v-date-picker>
                                </v-list-item>
                            </v-list>
                        </v-menu>

                        <span class="errors" v-if="errors && errors.contract_start">
                            {{ errors.contract_start[0] }}
                        </span>
                    </v-col>

                    <v-col cols="3" sm="3" md="3">
                        <v-menu origin="center center" transition="scale-transition">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field  v-bind="attrs" v-on="on" :value="employee.contract_end" label="Contract To"></v-text-field>
                            </template>

                            <v-list>
                                <v-list-item>
                                    <v-date-picker v-model="employee.contract_end" flat></v-date-picker>
                                </v-list-item>
                            </v-list>
                        </v-menu>

                        <span class="errors" v-if="errors && errors.contract_end">
                            {{ errors.contract_end[0] }}
                        </span>
                    </v-col>

                    <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="employee.n_i_d" label="National Identification Number (NIN)" ></v-text-field>

                        <span class="errors" v-if="errors && errors.n_i_d">
                            {{ errors.n_i_d[0] }}
                        </span>
                    </v-col>

                    <v-col cols="12" sm="12" md="6">
                        <v-autocomplete v-model="employee.gender" :items="['Male', 'Female']"
                            label="Gender" placeholder="Select Gender">
                        </v-autocomplete>

                        <span class="errors" v-if="errors && errors.gender">
                            {{ errors.gender[0] }}
                        </span>
                    </v-col>
                </v-row>

                <v-layout row wrap class="mt-1">
                    <v-spacer></v-spacer>
                        <v-btn :loading="loading" type="submit" depressed @click.prevent="addEmployee" color="success" class="mr-4">
                            <v-icon left>mdi-check</v-icon>
                            <span>Submit</span>
                        </v-btn>
                    <v-spacer></v-spacer>
                </v-layout>
            </form>
        </v-container>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'AddEmployee',
        data: () => ({
            rules: [],
            loading: false,
            employee: {},
            posts: [],
            countries: [],
            departments: [],
            errors: {}
        }),

        mounted() {
			this.getData()
		},

        methods: {
            getData() {
                axios.get('employees/')
				.then(response => {
					this.posts = response.data.posts
                    this.countries = response.data.countries
                    this.departments = response.data.departments
				})
				.catch(error => {
					if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
				})
            },

            addEmployee() {
                this.loading = true

                let employeeForm = new FormData()
				employeeForm.append('names', this.employee.names)
                employeeForm.append('department_id', this.employee.department_id)
                employeeForm.append('email', this.employee.email)
                employeeForm.append('role_post', this.employee.role_post)
                employeeForm.append('phone_code', this.employee.phone_code)
                employeeForm.append('contact', this.employee.contact)
                employeeForm.append('country_id', this.employee.country_id)
                employeeForm.append('image', this.employee.image)
                employeeForm.append('address', this.employee.address)
                employeeForm.append('salary', this.employee.salary)
                employeeForm.append('contract_start', this.employee.contract_start)
                employeeForm.append('contract_end', this.employee.contract_end)
                employeeForm.append('n_i_d', this.employee.n_i_d)
                employeeForm.append('gender', this.employee.gender)

                axios.post('employees/', employeeForm)
				.then(response => {
					this.loading = false
                    this.employee = ""

                    this.$router.push('/employees')
				}).catch(error => {
					if (error.response.status == 422) {
                        this.loading = false
                        this.errors = error.response.data.errors
                    }
				})
            }
        },
    }
</script>
