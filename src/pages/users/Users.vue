<template>
    <div class="users mx-4 mb-4">
        <h3 class="subheading grey--text">Users</h3>

        <v-container class="my-3 white">
			<v-data-table :headers="headers" :search="search" :items="tableData" sort-by="calories" class="elevation-1 text-center">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Users</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>

                        <v-spacer></v-spacer>
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>

                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn small depressed color="primary" v-bind="attrs" v-on="on">
                                    <v-icon left>mdi-plus</v-icon>
                                    <span>Add User</span>
                                </v-btn>
                            </template>

                            <v-card>
                                <v-card-title class="grey lighten-3" v-if="editedIndex == -1">
                                    <span class="text-h5">{{ formTitle }}</span>
                                </v-card-title>

								<v-card-title class="grey lighten-3" v-else>
                                    <span class="text-h5">{{ formTitle }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <form class="mx-4 mb-4">
                                            <v-row>
                                                <v-col cols="12" sm="12" md="12">
                                                    <v-autocomplete v-model="editedUser.indiv_id" :items="employees"
                                                        item-text="names" item-value="id" label="Employee" placeholder="Select User From Employees">
                                                    </v-autocomplete>

                                                    <span class="errors" v-if="errors && errors.indiv_id">
                                                        {{ errors.indiv_id[0] }}
                                                    </span>
                                                </v-col>
                                            </v-row>

                                            <v-layout row wrap class="mt-1">
                                                <v-flex xs12 md4></v-flex>
                                                <v-flex xs12 md4 class="text-center">
                                                    <v-btn v-if="editedIndex == -1" :loading="loading" type="submit" depressed @click.prevent="addUser" color="success" class="mr-4">
                                                        <v-icon left>mdi-check</v-icon>
                                                        <span>Submit</span>
                                                    </v-btn>

													<v-btn v-else :loading="loading" type="submit" depressed @click.prevent="updateUser(editedUser.id)" color="success" class="mr-4">
                                                        <v-icon left>mdi-check</v-icon>
                                                        <span>Update</span>
                                                    </v-btn>
                                                </v-flex>
                                                <v-flex xs12 md4></v-flex>
                                            </v-layout>
                                        </form>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="close">
                                        Cancel
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <v-dialog v-model="dialogDelete" max-width="400px">
                            <v-card>
                                <v-card-title class="text-h5">
                                    Are you sure you want to delete user {{ editedUser.client_names }}?
                                </v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn color="blue darken-1" text @click="closeDelete">NO</v-btn>
                                    <v-btn color="red darken-1" text @click="deleteUserConfirm(editedUser.id)">YES</v-btn>
                                    
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon color="primary accent-2" class="mr-2" @click="editUser(item)">
                        mdi-pencil
                    </v-icon>
                    
                    <v-icon color="red accent-2" @click="deleteUser(item)">
                        mdi-delete
                    </v-icon>
                </template>

				<template v-slot:[`item.created_at`]="{ item }">
                    {{ formatDate(item.created_at) }}
                </template>

                <template v-slot:[`item.updated_at`]="{ item }">
                    {{ formatDate(item.updated_at) }}
                </template>
            </v-data-table>
        </v-container>
    </div>
</template>

<script>
	import axios from 'axios'
    import moment from 'moment'

    export default {
        name: 'users',

        data: () => ({
			loading: false,
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            search: '',
            headers: [
                { text: 'Names', align: 'start', sortable: false, value: 'client_names', },
                { text: 'Email', value: 'client_email' },
                { text: 'Contact', value: 'client_contact' },
                { text: 'Added By', value: 'added_by' },
                { text: 'Added On', value: 'created_at' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            tableData: [],
            employees: [],
            editedUser: {},
            defaultUser: {},
            errors: {}
        }),

		mounted() {
			this.getUsers()
		},

		methods: {
            formatDate(value) {
                return moment(value).format("Do-MMM-YYYY")
            },

            getUsers () {
                axios.get('users/')
				.then(response => {
					this.tableData = response.data.users
                    this.employees = response.data.employees
				})
				.catch(error => {
					if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
				})
            },

            addUser () {
                this.loading = true

				let userForm = new FormData()
				userForm.append('indiv_id', this.editedUser.indiv_id)

				axios.post('users/', userForm)
				.then(response => {
					this.loading = false
					this.dialog = false
					this.getUsers()
				}).catch(error => {
					if (error.response.status == 422) {
                        this.loading = false
                        this.errors = error.response.data.errors
                    }
				})
            },

            editUser (item) {
                this.editedIndex = this.tableData.indexOf(item)
                this.editedUser = Object.assign({}, item)
                this.dialog = true
            },

            updateUser(id) {
				this.loading = true

				axios.put(`users/${id}/`, this.editedUser)
				.then(response => {
					this.loading = false
					this.dialog = false
					this.getUsers()
				}).catch(error => {
					if (error.response.status == 422) {
                        this.loading = false
                        this.errors = error.response.data.errors
                    }
				})
			},

            deleteUser (item) {
                this.editedIndex = this.tableData.indexOf(item)
                this.editedUser = Object.assign({}, item)
                this.dialogDelete = true
            },

            deleteUserConfirm (id) {
                this.loading = true

				axios.delete(`users/${id}/`)
				.then(response => {
					this.loading = false
					this.closeDelete()
					this.getUsers()
				}).catch(error => {
					if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
				})
            },

            close () {
                this.dialog = false
                this.$nextTick(() => {
                    this.editedUser = Object.assign({}, this.defaultUser)
                    this.editedIndex = -1
                })
            },

            closeDelete () {
                this.dialogDelete = false
                this.$nextTick(() => {
                    this.editedUser = Object.assign({}, this.defaultUser)
                    this.editedIndex = -1
                })
            },
        },

		computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Add User' : 'Edit User'
            },
        },

		watch: {
            dialog (val) {
                val || this.close()
            },
            dialogDelete (val) {
                val || this.closeDelete()
            },
        },
    }
</script>
