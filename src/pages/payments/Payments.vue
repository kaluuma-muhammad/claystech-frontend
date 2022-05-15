<template>
    <div class="record-payments mx-4 mb-4">
        <h3 class="subheading grey--text">Payments</h3>

        <v-container class="my-3 white lighten-2">
			<v-data-table :headers="headers" :search="search" :items="tableData" sort-by="calories" class="elevation-1 text-center">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Payments</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>

                        <v-spacer></v-spacer>
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>

                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn small depressed color="primary" v-bind="attrs" v-on="on">
                                    <v-icon left>mdi-plus</v-icon>
                                    <span>Record A Payment</span>
                                </v-btn>
                            </template>

                            <v-card>
                                <v-card-title class="grey lighten-3" v-if="editedIndex == -1">
                                    <span class="text-h5">{{ formTitle }}</span>
                                </v-card-title>

								<v-card-title class="grey lighten-3" v-else>
                                    <span class="text-h5">{{ formTitle }} {{ editedPayment.employee.names }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <form class="mx-4 mb-4">
                                            <v-row>
                                                <v-col cols="12" sm="12" md="12">
                                                    <v-autocomplete v-model="editedPayment.employee_id" :items="employees" label="Employee"
                                                        item-text="names" item-value="id" placeholder="Select Employee">
                                                    </v-autocomplete>

                                                    <span class="errors" v-if="errors && errors.employee_id">
                                                        {{ errors.employee_id[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-text-field v-model="editedPayment.paid_amount" label="Paid Amount" ></v-text-field>

                                                    <span class="errors" v-if="errors && errors.amount">
                                                        {{ errors.amount[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-autocomplete v-model="editedPayment.payment_method" :items="['Mobile Money', 'Cash', 'PayPal', 'Cheque']"
                                                        label="Payment Method" placeholder="Select Payment Method">
                                                    </v-autocomplete>

                                                    <span class="errors" v-if="errors && errors.payment_method">
                                                        {{ errors.payment_method[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col v-if="editedPayment.payment_method == 'PayPal' || editedPayment.payment_method == 'Cheque'" cols="12" sm="12" md="12">
                                                    <v-text-field v-model="editedPayment.account_num" label="Account Number" ></v-text-field>

                                                    <span class="errors" v-if="errors && errors.account_num">
                                                        {{ errors.account_num[0] }}
                                                    </span>
                                                </v-col>
                                            </v-row>

                                            <v-layout row wrap class="mt-1">
                                                <v-flex xs12 md4></v-flex>
                                                <v-flex xs12 md4 class="text-center">
                                                    <v-btn v-if="editedIndex == -1" :loading="loading" type="submit" depressed @click.prevent="recordPayment" color="success" class="mr-4">
                                                        <v-icon left>mdi-check</v-icon>
                                                        <span>Submit</span>
                                                    </v-btn>

													<v-btn v-else :loading="loading" type="submit" depressed @click.prevent="updatePayment(editedPayment.id)" color="success" class="mr-4">
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
                    <v-icon color="primary accent-2" class="mr-2" @click="editPayment(item)">
                        mdi-pencil
                    </v-icon>

                    <v-icon color="success accent-2">
                        mdi-receipt
                    </v-icon>
                </template>

                <template v-slot:[`item.employee_id`]="{ item }">
                    {{ item.employee.names }}
                </template>

                <template v-slot:[`item.paid_amount`]="{ item }">
                    {{ item.paid_amount }}/=
                </template>

                <template v-slot:[`item.balance`]="{ item }">
                    {{ item.balance }}/=
                </template>

                <template v-slot:[`item.created_at`]="{ item }">
                    {{ formatDate(item.created_at) }}
                </template>

                <template v-slot:[`item.recorded_by`]="{ item }">
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
        name: 'recordPayment',

        data: () => ({
			loading: false,
            dialog: false,
            editedIndex: -1,
            search: '',
            headers: [
                { text: 'Employee', align: 'start', sortable: false, value: 'employee_id', },
                { text: 'Salary', value: 'salary' },
                { text: 'Paid Amount', value: 'paid_amount' },
                { text: 'Balance', value: 'balance' },
                { text: 'Method', value: 'payment_method' },
                { text: 'Recorded_on', value: 'created_at' },
                { text: 'Recorded By', value: 'recorded_by' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            tableData: [],
            employees: [],
            editedPayment: {},
            defaultPayment: {},
            errors: {}
        }),

		mounted() {
			this.getPayments()
		},

		methods: {
            formatDate(value) {
                return moment(value).format("Do-MMM-YYYY")
            },

            getPayments () {
                axios.get('payments/')
				.then(response => {
                    this.employees = response.data.employees
                    this.tableData = response.data.payments
				})
				.catch(error => {
					if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
				})
            },

            recordPayment () {
                this.loading = true

				let paymentForm = new FormData()
				paymentForm.append('employee_id', this.editedPayment.employee_id)
                paymentForm.append('paid_amount', this.editedPayment.paid_amount)
                paymentForm.append('payment_method', this.editedPayment.payment_method)
                paymentForm.append('account_num', this.editedPayment.account_num)

				axios.post('payments/', paymentForm)
				.then(response => {
					this.loading = false
					this.dialog = false
					this.getPayments()
				}).catch(error => {
                    if (error.response.status == 422) {
                        this.loading = false
                        this.errors = error.response.data.errors
                    }
				})
            },

            editPayment (item) {
                this.editedIndex = this.tableData.indexOf(item)
                this.editedPayment = Object.assign({}, item)
                this.dialog = true
            },

            updatePayment(id) {
				this.loading = true

				axios.put(`payments/${id}/`, this.editedPayment)
				.then(response => {
					this.loading = false
					this.dialog = false
					this.getPayments()
				}).catch(error => {
                    if (error.response.status == 422) {
                        this.loading = false
                        this.errors = error.response.data.errors
                    }
				})
			},

            close () {
                this.dialog = false
                this.loading = false
                this.$nextTick(() => {
                    this.editedPayment = Object.assign({}, this.defaultPayment)
                    this.editedIndex = -1
                })
            },
        },

		computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Recorde A Payment' : 'Edit Payment For'
            },
        },

		watch: {
            dialog (val) {
                val || this.close()
            },
        }
    }
</script>
