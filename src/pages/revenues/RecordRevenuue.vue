<template>
    <div class="record-revenue">
        <v-container class="my-3 white">
			<v-data-table :headers="headers" :search="search" :items="tableData" sort-by="calories" class="elevation-1 text-center">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Recorded Revenues</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>

                        <v-spacer></v-spacer>
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>

                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn small depressed color="primary" v-bind="attrs" v-on="on">
                                    <v-icon left>mdi-plus</v-icon>
                                    <span>Record A Revenue</span>
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
                                                    <v-autocomplete v-model="editedRecordedRevenue.client_id" :items="clients" label="Client"
                                                        item-text="client_names" item-value="id" placeholder="Select Client">
                                                    </v-autocomplete>

                                                    <span class="errors" v-if="errors && errors.client_id">
                                                        {{ errors.client_id[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-autocomplete v-model="editedRecordedRevenue.revenue_id" :items="revenues" label="Revenue"
                                                        item-text="revenue_name" item-value="id" placeholder="Select Revenue">
                                                    </v-autocomplete>
                                                    
                                                    <span class="errors" v-if="errors && errors.revenue_id">
                                                        {{ errors.revenue_id[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-autocomplete v-model="editedRecordedRevenue.revenue_type" :items="['Sell', 'Rent']" 
                                                        label="Revenue Type" placeholder="Select Revenue Type">
                                                    </v-autocomplete>

                                                    <span class="errors" v-if="errors && errors.revenue_type">
                                                        {{ errors.revenue_type[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col v-if="editedRecordedRevenue.revenue_type == 'Rent'" cols="12" sm="6" md="6">
                                                    <v-menu origin="center center" transition="scale-transition">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-text-field  v-bind="attrs" v-on="on" :value="editedRecordedRevenue.rent_from" label="Rent Period From"></v-text-field>
                                                        </template>

                                                        <v-list>
                                                            <v-list-item>
                                                                <v-date-picker v-model="editedRecordedRevenue.rent_from" flat></v-date-picker>
                                                            </v-list-item>
                                                        </v-list>
                                                    </v-menu>

                                                    <span class="errors" v-if="errors && errors.rent_from">
                                                        {{ errors.rent_from[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col v-if="editedRecordedRevenue.revenue_type == 'Rent'" cols="12" sm="6" md="6">
                                                    <v-menu origin="center center" transition="scale-transition">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-text-field  v-bind="attrs" v-on="on" :value="editedRecordedRevenue.rent_to" label="Rent Period To"></v-text-field>
                                                        </template>

                                                        <v-list>
                                                            <v-list-item>
                                                                <v-date-picker v-model="editedRecordedRevenue.rent_to" flat></v-date-picker>
                                                            </v-list-item>
                                                        </v-list>
                                                    </v-menu>

                                                    <span class="errors" v-if="errors && errors.rent_to">
                                                        {{ errors.rent_to[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-text-field v-model="editedRecordedRevenue.paid_amount" label="Paid Amount" ></v-text-field>

                                                    <span class="errors" v-if="errors && errors.paid_amount">
                                                        {{ errors.paid_amount[0] }}
                                                    </span>
                                                </v-col>
                                            </v-row>

                                            <v-layout row wrap class="mt-1">
                                                <v-flex xs12 md4></v-flex>
                                                <v-flex xs12 md4 class="text-center">
                                                    <v-btn v-if="editedIndex == -1" :loading="loading" type="submit" depressed @click.prevent="recordRevenue" color="success" class="mr-4">
                                                        <v-icon left>mdi-check</v-icon>
                                                        <span>Submit</span>
                                                    </v-btn>

													<v-btn v-else :loading="loading" type="submit" depressed @click.prevent="updateRevenue(editedRecordedRevenue.id)" color="success" class="mr-4">
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
                    </v-toolbar>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon color="primary accent-2" class="mr-2" @click="editRevenue(item)">
                        mdi-pencil
                    </v-icon>
                    
                    <v-icon color="success accent-2">
                        mdi-receipt
                    </v-icon>
                </template>

                <template v-slot:[`item.revenue_id`]="{ item }">
                    {{ item.revenue.revenue_name }}
                </template>

                <template v-slot:[`item.client_id`]="{ item }">
                    {{ item.client.client_names }}
                </template>

                <template v-slot:[`item.total_amount`]="{ item }">
                    {{ item.total_amount }}/=
                </template>

                <template v-slot:[`item.paid_amount`]="{ item }">
                    {{ item.paid_amount }}/=
                </template>

                <template v-slot:[`item.balance`]="{ item }">
                    {{ item.balance }}/=
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
        name: 'RecordRevenue',

        data: () => ({
			loading: false,
            dialog: false,
            editedIndex: -1,
            search: '',
            headers: [
                { text: 'Client', align: 'start', sortable: false, value: 'client_id', },
                { text: 'Revenue', value: 'revenue_id' },
                { text: 'Revenue Type', value: 'revenue_type' },
                { text: 'Total Amount', value: 'total_amount' },
                { text: 'Paid Amount', value: 'paid_amount' },
                { text: 'Balance', value: 'balance' },
                { text: 'Added By', value: 'added_by' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            tableData: [],
            revenues: [],
            clients: [],
            editedRecordedRevenue: {},
            defaultRecordedRevenue: {},
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
                axios.get('recorded-revenues/')
				.then(response => {
                    this.clients = response.data.clients
					this.revenues = response.data.revenues
                    this.tableData = response.data.r_revenues
				})
				.catch(error => {
					if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
				})
            },

            recordRevenue () {
                this.loading = true

				let revenueForm = new FormData()
				revenueForm.append('client_id', this.editedRecordedRevenue.client_id)
                revenueForm.append('revenue_id', this.editedRecordedRevenue.revenue_id)
                revenueForm.append('revenue_type', this.editedRecordedRevenue.revenue_type)
                revenueForm.append('rent_from', this.editedRecordedRevenue.rent_from)
                revenueForm.append('rent_to', this.editedRecordedRevenue.rent_to)
                revenueForm.append('paid_amount', this.editedRecordedRevenue.paid_amount)

				axios.post('recorded-revenues/', revenueForm)
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
                this.editedRecordedRevenue = Object.assign({}, item)
                this.dialog = true
            },

            updateRevenue(id) {
				this.loading = true

				axios.put(`recorded-revenues/${id}/`, this.editedRecordedRevenue)
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

            close () {
                this.dialog = false
                this.$nextTick(() => {
                    this.editedRecordedRevenue = Object.assign({}, this.defaultRecordedRevenue)
                    this.editedIndex = -1
                })
            },
        },

		computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Recorde A Revenue' : 'Edit Revenue'
            },
        },

		watch: {
            dialog (val) {
                val || this.close()
            },
            viewDialog (val) {
                val || this.closeDelete()
            },
        },
    }
</script>
