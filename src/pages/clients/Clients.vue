<template>
    <div class="clients mx-4 mb-4">
        <h3 class="subheading grey--text">Clients</h3>

        <v-container class="my-3 white">
			<v-data-table :headers="headers" :search="search" :items="tableData" sort-by="calories" class="elevation-1 text-center">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Clients</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>

                        <v-spacer></v-spacer>
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>

                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn small depressed color="primary" v-bind="attrs" v-on="on">
                                    <v-icon left>mdi-plus</v-icon>
                                    <span>Add Client</span>
                                </v-btn>
                            </template>

                            <v-card>
                                <v-card-title class="grey lighten-3" v-if="editedIndex == -1">
                                    <span class="text-h5">{{ formTitle }}</span>
                                </v-card-title>

								<v-card-title class="grey lighten-3" v-else>
                                    <span class="text-h5">{{ formTitle }} {{ editedClient.client_names }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <form class="mx-4 mb-4">
                                            <v-row>
                                                <v-col cols="12" sm="12" md="12">
                                                    <v-text-field v-model="editedClient.client_names" label="Client's Name" ></v-text-field>

                                                    <span class="errors" v-if="errors && errors.client_names">
                                                        {{ errors.client_names[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-text-field v-model="editedClient.client_email" label="Client's Email" ></v-text-field>

                                                    <span class="errors" v-if="errors && errors.client_email">
                                                        {{ errors.client_email[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col cols="6" sm="4" md="4">
                                                    <v-autocomplete v-model="editedClient.phone_code" :items="countries"
                                                        item-text="PhoneCode" item-value="id" label="Area Code" placeholder="Select Code">
                                                    </v-autocomplete>

                                                    <span class="errors" v-if="errors && errors.phone_code">
                                                        {{ errors.phone_code[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col cols="6" sm="8" md="8">
                                                    <v-text-field v-model="editedClient.client_contact" label="Client's Contact" ></v-text-field>

                                                    <span class="errors" v-if="errors && errors.client_contact">
                                                        {{ errors.client_contact[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-autocomplete v-model="editedClient.product" :items="projects" label="Product"
                                                        item-text="project_name" item-value="id" placeholder="Select Product">
                                                    </v-autocomplete>

                                                    <span class="errors" v-if="errors && errors.product">
                                                        {{ errors.product[0] }}
                                                    </span>
                                                </v-col>
                                            </v-row>

                                            <v-layout row wrap class="mt-1">
                                                <v-flex xs12 md4></v-flex>
                                                <v-flex xs12 md4 class="text-center">
                                                    <v-btn v-if="editedIndex == -1" :loading="loading" type="submit" depressed @click.prevent="addClient" color="success" class="mr-4">
                                                        <v-icon left>mdi-check</v-icon>
                                                        <span>Submit</span>
                                                    </v-btn>

													<v-btn v-else :loading="loading" type="submit" depressed @click.prevent="updateClient(editedClient.id)" color="success" class="mr-4">
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
                                    Are you sure you want to delete Client {{ editedClient.client_names }}?
                                </v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn color="blue darken-1" text @click="closeDelete">NO</v-btn>
                                    <v-btn color="red darken-1" text @click="deleteClientConfirm(editedClient.id)">YES</v-btn>
                                    
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon color="primary accent-2" class="mr-2" @click="editeClient(item)">
                        mdi-pencil
                    </v-icon>
                    
                    <v-icon color="red accent-2" @click="deleteClient(item)">
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

                <template v-slot:[`item.product`]="{ item }">
                    {{ item.project.project_name }}
                </template>
            </v-data-table>
        </v-container>
    </div>
</template>

<script>
	import axios from 'axios'
    import moment from 'moment'

    export default {
        name: 'Clients',

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
                { text: 'Product', value: 'product' },
                { text: 'Added By', value: 'added_by' },
                { text: 'Added On', value: 'created_at' },
                { text: 'Updated At', value: 'updated_at' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            tableData: [],
            countries: [],
            projects: [],
            editedClient: {},
            defaultClient: {},
            errors: {}
        }),

		mounted() {
			this.getClients()
		},

		methods: {
            formatDate(value) {
                return moment(value).format("Do-MMM-YYYY")
            },

            getClients () {
                axios.get('clients/')
				.then(response => {
					this.tableData = response.data.clients
                    this.countries = response.data.countries
                    this.projects = response.data.projects
				})
				.catch(error => {
					if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
				})
            },

            addClient () {
                this.loading = true

				let clientForm = new FormData()
				clientForm.append('client_names', this.editedClient.client_names)
                clientForm.append('client_email', this.editedClient.client_email)
                clientForm.append('phone_code', this.editedClient.phone_code)
                clientForm.append('client_contact', this.editedClient.client_contact)
                clientForm.append('product', this.editedClient.product)

				axios.post('clients/', clientForm)
				.then(response => {
					this.loading = false
					this.dialog = false
					this.getClients()
				}).catch(error => {
					if (error.response.status == 422) {
                        this.loading = false
                        this.errors = error.response.data.errors
                    }
				})
            },

            editeClient (item) {
                this.editedIndex = this.tableData.indexOf(item)
                this.editedClient = Object.assign({}, item)
                this.dialog = true
            },

            updateClient(id) {
				this.loading = true

				axios.put(`clients/${id}/`, this.editedClient)
				.then(response => {
					this.loading = false
					this.dialog = false
					this.getClients()
				}).catch(error => {
					if (error.response.status == 422) {
                        this.loading = false
                        this.errors = error.response.data.errors
                    }
				})
			},

            deleteClient (item) {
                this.editedIndex = this.tableData.indexOf(item)
                this.editedClient = Object.assign({}, item)
                this.dialogDelete = true
            },

            deleteClientConfirm (id) {
                this.loading = true

				axios.delete(`clients/${id}/`)
				.then(response => {
					this.loading = false
					this.closeDelete()
					this.getClients()
				}).catch(error => {
					if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
				})
            },

            close () {
                this.dialog = false
                this.$nextTick(() => {
                    this.editedClient = Object.assign({}, this.defaultClient)
                    this.editedIndex = -1
                })
            },

            closeDelete () {
                this.dialogDelete = false
                this.$nextTick(() => {
                    this.editedClient = Object.assign({}, this.defaultClient)
                    this.editedIndex = -1
                })
            },
        },

		computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Add Client' : 'Edit Client'
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
