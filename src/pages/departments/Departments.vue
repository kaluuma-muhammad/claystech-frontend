<template>
    <div class="departments mx-4 mb-4">
        <h3 class="subheading grey--text">Departments</h3>

        <v-container class="my-3 white lighten-2">
            <v-data-table :headers="headers" :search="search" :items="tableData" sort-by="calories" class="elevation-1 text-center">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Departments</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn small depressed color="primary" v-bind="attrs" v-on="on">
                                    <v-icon left>mdi-plus</v-icon>
                                    <span>Add Department</span>
                                </v-btn>
                            </template>

                            <v-card>
                                <v-card-title class="grey lighten-3" v-if="editedIndex == -1">
                                    <span class="text-h5">{{ formTitle }}</span>
                                </v-card-title>

								<v-card-title class="grey lighten-3" v-else>
                                    <span class="text-h5">{{ formTitle }} {{ editedDepartment.depart_name }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <form class="mx-4 mb-4">
                                            <v-row>
                                                <v-col cols="12" sm="12" md="12">
                                                    <v-text-field v-model="editedDepartment.depart_name" label="Department Name" ></v-text-field>

                                                    <span class="errors" v-if="errors && errors.depart_name">
                                                        {{ errors.depart_name[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-text-field v-model="editedDepartment.depart_email" label="Department Email" ></v-text-field>

                                                    <span class="errors" v-if="errors && errors.depart_email">
                                                        {{ errors.depart_email[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col cols="6" sm="4" md="4">
                                                    <v-autocomplete v-model="editedDepartment.phone_code" :items="countries"
                                                        item-text="PhoneCode" item-value="id" label="Area Code" placeholder="Select Code">
                                                    </v-autocomplete>

                                                    <span class="errors" v-if="errors && errors.phone_code">
                                                        {{ errors.phone_code[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col cols="6" sm="8" md="8">
                                                    <v-text-field v-model="editedDepartment.depart_contact" label="Department Contact" ></v-text-field>

                                                    <span class="errors" v-if="errors && errors.depart_contact">
                                                        {{ errors.depart_contact[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-autocomplete v-model="editedDepartment.head_of_dapart" :items="users" label="Head of Department"
                                                        item-text="fname" item-value="id" placeholder="Select User">
                                                    </v-autocomplete>

                                                    <span class="errors" v-if="errors && errors.head_of_dapart">
                                                        {{ errors.head_of_dapart[0] }}
                                                    </span>
                                                </v-col>
                                            </v-row>

                                            <v-layout row wrap class="mt-1">
                                                <v-flex xs12 md4></v-flex>
                                                <v-flex xs12 md4 class="text-center">
                                                    <v-btn v-if="editedIndex == -1" :loading="loading" type="submit" depressed @click.prevent="addDepartment" color="success" class="mr-4">
                                                        <v-icon left>mdi-check</v-icon>
                                                        <span>Submit</span>
                                                    </v-btn>

													<v-btn v-else :loading="loading" type="submit" depressed @click.prevent="updateDepartment(editedDepartment.id)" color="success" class="mr-4">
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
                                    Are you sure you want to delete department {{ editedDepartment.depart_name }}?
                                </v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                    <v-btn color="red darken-1" text @click="deleteDepartmentConfirm(editedDepartment.id)">OK</v-btn>
                                    
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon color="primary accent-2" class="mr-2" @click="editDepartment(item)">
                        mdi-pencil
                    </v-icon>
                    
                    <v-icon color="red accent-2" @click="deleteDepartment(item)">
                        mdi-delete
                    </v-icon>
                </template>

                <template v-slot:[`item.created_at`]="{ item }">
                    {{ formatDate(item.created_at) }}
                </template>

                <template v-slot:[`item.updated_at`]="{ item }">
                    {{ formatDate(item.updated_at) }}
                </template>

                <template v-slot:[`item.added_by`]="{ item }">
                    {{ item.user.fname }}
                </template>

                <template v-slot:[`item.head_of_dapart`]="{ item }">
                    {{ item.user.fname }} {{ item.user.lname }}
                </template>

                <template v-slot:[`item.depart_contact`]="{ item }">
                    ({{ item.country.PhoneCode }}){{ item.depart_contact }}
                </template>
            </v-data-table>
        </v-container>
    </div>
</template>

<script>
    import axios from 'axios'
    import moment from 'moment'
    export default {
        name: "Departments",
        data: () => ({
            loading: false,
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            search: '',
            headers: [
                { text: 'Dapartment', align: 'start', sortable: false, value: 'depart_name', },
                { text: 'Email', value: 'depart_email' },
                { text: 'Contact', value: 'depart_contact' },
                { text: 'Head of Depart', value: 'head_of_dapart' },
                { text: 'Added By', value: 'added_by' },
                { text: 'Added On', value: 'created_at' },
                { text: 'Updated At', value: 'updated_at' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            tableData: [],
            countries: [],
            users: [],
            editedDepartment: {},
            defaultDepartment: {},
            errors: {}
        }),

        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Add New Department' : 'Edit Department'
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

        mounted() {
			this.getDepartments()
		},

        methods: {
            formatDate(value) {
                return moment(value).format("Do-MMM-YYYY")
            },

            getDepartments () {
                axios.get('departments/')
				.then(response => {
					this.tableData = response.data.departments
                    this.countries = response.data.countries
                    this.users = response.data.users
				})
				.catch(error => {
					if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
				})
            },

            addDepartment () {
                this.loading = true

				let departForm = new FormData()
				departForm.append('depart_name', this.editedDepartment.depart_name)
                departForm.append('depart_email', this.editedDepartment.depart_email)
                departForm.append('phone_code', this.editedDepartment.phone_code)
                departForm.append('depart_contact', this.editedDepartment.depart_contact)
                departForm.append('head_of_dapart', this.editedDepartment.head_of_dapart)

				axios.post('departments/', departForm)
				.then(response => {
					this.loading = false
					this.dialog = false
					this.getDepartments()
				}).catch(error => {
					if (error.response.status == 422) {
                        this.loading = false
                        this.errors = error.response.data.errors
                    }
				})
            },

            editDepartment (item) {
                this.editedIndex = this.tableData.indexOf(item)
                this.editedDepartment = Object.assign({}, item)
                this.dialog = true
            },

            updateDepartment(id) {
				this.loading = true

				axios.put('departments/' + `${id}`, this.editedDepartment)
				.then(response => {
					this.loading = false
					this.dialog = false
					this.getDepartments()
				}).catch(error => {
					if (error.response.status == 422) {
                        this.loading = false
                        this.errors = error.response.data.errors
                    }
				})
			},

            deleteDepartment (item) {
                this.editedIndex = this.tableData.indexOf(item)
                this.editedDepartment = Object.assign({}, item)
                this.dialogDelete = true
            },

            deleteDepartmentConfirm (id) {
                this.loading = true

				axios.delete('departments/' + `${id}`)
				.then(response => {
					this.loading = false
					this.closeDelete()
					this.getDepartments()
				}).catch(error => {
					if (error.response.status == 422) {
                        this.loading = false
                        this.errors = error.response.data.errors
                    }
				})
            },

            close () {
                this.dialog = false
                this.$nextTick(() => {
                    this.editedDepartment = Object.assign({}, this.defaultDepartment)
                    this.editedIndex = -1
                })
            },

            closeDelete () {
                this.dialogDelete = false
                this.$nextTick(() => {
                    this.editedDepartment = Object.assign({}, this.defaultDepartment)
                    this.editedIndex = -1
                })
            },
        },
    }
</script>
