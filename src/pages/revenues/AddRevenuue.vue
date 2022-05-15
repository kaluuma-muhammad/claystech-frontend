<template>
    <div class="add-revenue">
        <v-container class="my-3 white">
			<v-data-table :headers="headers" :search="search" :items="tableData" sort-by="calories" class="elevation-1 text-center">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Revenues</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>

                        <v-spacer></v-spacer>
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>

                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn small depressed color="primary" v-bind="attrs" v-on="on">
                                    <v-icon left>mdi-plus</v-icon>
                                    <span>Add A Revenue</span>
                                </v-btn>
                            </template>

                            <v-card>
                                <v-card-title class="grey lighten-3" v-if="editedIndex == -1">
                                    <span class="text-h5">{{ formTitle }}</span>
                                </v-card-title>

								<v-card-title class="grey lighten-3" v-else>
                                    <span class="text-h5">{{ formTitle }} {{ editedRevenue.revenue_name }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <form class="mx-4 mb-4">
                                            <v-row>
                                                <v-col cols="12" sm="12" md="12">
                                                    <v-text-field v-model="editedRevenue.revenue_name" label="Revenue Name" ></v-text-field>

                                                    <span class="errors" v-if="errors && errors.revenue_name">
                                                        {{ errors.revenue_name[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-autocomplete v-model="editedRevenue.product" :items="products" label="Product"
                                                        item-text="project_name" item-value="id" placeholder="Select Product">
                                                    </v-autocomplete>

                                                    <span class="errors" v-if="errors && errors.product">
                                                        {{ errors.product[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-text-field v-model="editedRevenue.sell_amount" label="Sell Amount" ></v-text-field>

                                                    <span class="errors" v-if="errors && errors.sell_amount">
                                                        {{ errors.sell_amount[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-text-field v-model="editedRevenue.rent_amount" label="Rent Amount" ></v-text-field>

                                                    <span class="errors" v-if="errors && errors.rent_amount">
                                                        {{ errors.rent_amount[0] }}
                                                    </span>
                                                </v-col>
                                            </v-row>

                                            <v-layout row wrap class="mt-1">
                                                <v-flex xs12 md4></v-flex>
                                                <v-flex xs12 md4 class="text-center">
                                                    <v-btn v-if="editedIndex == -1" :loading="loading" type="submit" depressed @click.prevent="addRevenue" color="success" class="mr-4">
                                                        <v-icon left>mdi-check</v-icon>
                                                        <span>Submit</span>
                                                    </v-btn>

													<v-btn v-else :loading="loading" type="submit" depressed @click.prevent="updateRevenue(editedRevenue.id)" color="success" class="mr-4">
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
                                    Are you sure you want to delete Revenue {{ editedRevenue.revenue_name }}?
                                </v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn color="blue darken-1" text @click="closeDelete">NO</v-btn>
                                    <v-btn color="red darken-1" text @click="deleteRevenueConfirm(editedRevenue.id)">YES</v-btn>
                                    
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon color="primary accent-2" class="mr-2" @click="editRevenue(item)">
                        mdi-pencil
                    </v-icon>
                    
                    <v-icon color="red accent-2" @click="deleteRevenue(item)">
                        mdi-delete
                    </v-icon>
                </template>

				<template v-slot:[`item.created_at`]="{ item }">
                    {{ formatDate(item.created_at) }}
                </template>

                <template v-slot:[`item.updated_at`]="{ item }">
                    {{ formatDate(item.updated_at) }}
                </template>

                <template v-slot:[`item.product`]="{ item }">
                    {{ item.project.project_name }}
                </template>

                <template v-slot:[`item.rent_amount`]="{ item }">
                    {{ item.rent_amount }}/=
                </template>

                <template v-slot:[`item.sell_amount`]="{ item }">
                    {{ item.sell_amount }}/=
                </template>

                <template v-slot:[`item.added_by`]="{ item }">
                    {{ item.user.fname }}
                </template>
            </v-data-table>
        </v-container>
    </div>
</template>

<script>
	import axios from 'axios'
    import moment from 'moment'

    export default {
        name: 'AddRevenue',

        data: () => ({
			loading: false,
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            search: '',
            headers: [
                { text: 'Revenue Name', align: 'start', sortable: false, value: 'revenue_name', },
                { text: 'Product', value: 'product' },
                { text: 'Rent Amount', value: 'rent_amount' },
                { text: 'Sell Amount', value: 'sell_amount' },
                { text: 'Added By', value: 'added_by' },
                { text: 'Added On', value: 'created_at' },
                { text: 'Updated At', value: 'updated_at' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            tableData: [],
            products: [],
            editedRevenue: {},
            defaultRevenue: {},
            errors: {}
        }),

		mounted() {
			this.getRevenues()
		},

		methods: {
            formatDate(value) {
                return moment(value).format("Do-MMM-YYYY")
            },

            getRevenues () {
                axios.get('revenues/')
				.then(response => {
					this.tableData = response.data.revenues
                    this.products = response.data.products
				})
				.catch(error => {
					if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
				})
            },

            addRevenue () {
                this.loading = true

				let revenueForm = new FormData()
				revenueForm.append('revenue_name', this.editedRevenue.revenue_name)
                revenueForm.append('product', this.editedRevenue.product)
                revenueForm.append('sell_amount', this.editedRevenue.sell_amount)
                revenueForm.append('rent_amount', this.editedRevenue.rent_amount)

				axios.post('revenues/', revenueForm)
				.then(response => {
					this.loading = false
					this.dialog = false
					this.getRevenues()
				}).catch(error => {
					if (error.response.status == 422) {
                        this.loading = false
                        this.errors = error.response.data.errors
                    }
				})
            },

            editRevenue (item) {
                this.editedIndex = this.tableData.indexOf(item)
                this.editedRevenue = Object.assign({}, item)
                this.dialog = true
            },

            updateRevenue(id) {
				this.loading = true

				axios.put(`revenues/${id}/`, this.editedRevenue)
				.then(response => {
					this.loading = false
					this.dialog = false
					this.getRevenues()
				}).catch(error => {
					if (error.response.status == 422) {
                        this.loading = false
                        this.errors = error.response.data.errors
                    }
				})
			},

            deleteRevenue (item) {
                this.editedIndex = this.tableData.indexOf(item)
                this.editedRevenue = Object.assign({}, item)
                this.dialogDelete = true
            },

            deleteRevenueConfirm (id) {
                this.loading = true

				axios.delete(`revenues/${id}/`)
				.then(response => {
					this.loading = false
					this.closeDelete()
					this.getRevenues()
				}).catch(error => {
					if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
				})
            },

            close () {
                this.dialog = false
                this.$nextTick(() => {
                    this.editedRevenue = Object.assign({}, this.defaultRevenue)
                    this.editedIndex = -1
                })
            },

            closeDelete () {
                this.dialogDelete = false
                this.$nextTick(() => {
                    this.editedRevenue = Object.assign({}, this.defaultRevenue)
                    this.editedIndex = -1
                })
            },
        },

		computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Add A Revenue' : 'Edit Revenue'
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
