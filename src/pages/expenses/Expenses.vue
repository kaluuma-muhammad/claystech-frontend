<template>
    <div class="expenses mx-4 mb-4">
        <h3 class="subheading grey--text">Expenses</h3>

        <v-container class="my-3 white">
			<v-data-table :headers="headers" :search="search" :items="tableData" sort-by="calories" class="elevation-1 text-center">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Expenses</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>

                        <v-spacer></v-spacer>
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>

                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn small depressed color="primary" v-bind="attrs" v-on="on">
                                    <v-icon left>mdi-plus</v-icon>
                                    <span>Record An Expense</span>
                                </v-btn>
                            </template>

                            <v-card>
                                <v-card-title class="grey lighten-3" v-if="editedIndex == -1">
                                    <span class="text-h5">{{ formTitle }}</span>
                                </v-card-title>

								<v-card-title class="grey lighten-3" v-else>
                                    <span class="text-h5">{{ formTitle }} {{ editedExpense.expense_name }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <form class="mx-4 mb-4">
                                            <v-row>
                                                <v-col cols="12" sm="12" md="12">
                                                    <v-text-field v-model="editedExpense.expense_name" label="Expense Name" ></v-text-field>
                                                    
                                                    <span class="errors" v-if="errors && errors.expense_name">
                                                        {{ errors.expense_name[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-text-field v-model="editedExpense.expense_amount" label="Expense Amount" ></v-text-field>
                                                    
                                                    <span class="errors" v-if="errors && errors.expense_amount">
                                                        {{ errors.expense_amount[0] }}
                                                    </span>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-text-field v-model="editedExpense.quantity" label="Quantity" ></v-text-field>
                                                    
                                                    <span class="errors" v-if="errors && errors.quantity">
                                                        {{ errors.quantity[0] }}
                                                    </span>
                                                </v-col>
                                            </v-row>

                                            <v-layout row wrap class="mt-1">
                                                <v-flex xs12 md4></v-flex>
                                                <v-flex xs12 md4 class="text-center">
                                                    <v-btn v-if="editedIndex == -1" :loading="loading" type="submit" depressed @click.prevent="recordExpense" color="success" class="mr-4">
                                                        <v-icon left>mdi-check</v-icon>
                                                        <span>Submit</span>
                                                    </v-btn>

													<v-btn v-else :loading="loading" type="submit" depressed @click.prevent="updateExpense(editedExpense.id)" color="success" class="mr-4">
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
                                    Are you sure you want to delete Expense {{ editedExpense.expense_name }}?
                                </v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn color="blue darken-1" text @click="closeDelete">NO</v-btn>
                                    <v-btn color="red darken-1" text @click="deleteExpenseConfirm(editedExpense.id)">YES</v-btn>
                                    
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon color="primary accent-2" class="mr-2" @click="editeExpense(item)">
                        mdi-pencil
                    </v-icon>
                    
                    <v-icon color="red accent-2" @click="deleteExpense(item)">
                        mdi-delete
                    </v-icon>
                </template>

				<template v-slot:[`item.created_at`]="{ item }">
                    {{ formatDate(item.created_at) }}
                </template>

                <template v-slot:[`item.updated_at`]="{ item }">
                    {{ formatDate(item.updated_at) }}
                </template>

                <template v-slot:[`item.expense_amount`]="{ item }">
                    {{ item.expense_amount }}/=
                </template>

                <template v-slot:[`item.total_amount`]="{ item }">
                    {{ item.total_amount }}/=
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
        name: 'Expenses',

        data: () => ({
			loading: false,
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            search: '',
            headers: [
                { text: 'Expense Name', align: 'start', sortable: false, value: 'expense_name', },
                { text: 'Quantity', value: 'quantity' },
                { text: 'Amount', value: 'expense_amount' },
                { text: 'Total Amount', value: 'total_amount' },
                { text: 'Recorded By', value: 'recorded_by' },
                { text: 'Added On', value: 'created_at' },
                { text: 'Updated At', value: 'updated_at' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            tableData: [],
            editedExpense: {},
            defaultExpense: {},
            errors: {}
        }),

		mounted() {
			this.getExpenses()
		},

		methods: {
            formatDate(value) {
                return moment(value).format("Do-MMM-YYYY")
            },

            getExpenses () {
                axios.get('expenses/')
				.then(response => {
					this.tableData = response.data
				})
				.catch(error => {
					if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
				})
            },

            recordExpense () {
                this.loading = true

				let expenseForm = new FormData()
				expenseForm.append('expense_name', this.editedExpense.expense_name)
                expenseForm.append('expense_amount', this.editedExpense.expense_amount)
                expenseForm.append('quantity', this.editedExpense.quantity)

				axios.post('expenses/', expenseForm)
				.then(response => {
					this.loading = false
					this.dialog = false
					this.getExpenses()
				}).catch(error => {
					if (error.response.status == 422) {
                        this.loading = false
                        this.errors = error.response.data.errors
                    }
				})
            },

            editeExpense (item) {
                this.editedIndex = this.tableData.indexOf(item)
                this.editedExpense = Object.assign({}, item)
                this.dialog = true
            },

            updateExpense(id) {
				this.loading = true

				axios.put(`expenses/${id}/`, this.editedExpense)
				.then(response => {
					this.loading = false
					this.dialog = false
					this.getExpenses()
				}).catch(error => {
					if (error.response.status == 422) {
                        this.loading = false
                        this.errors = error.response.data.errors
                    }
				})
			},

            deleteExpense (item) {
                this.editedIndex = this.tableData.indexOf(item)
                this.editedExpense = Object.assign({}, item)
                this.dialogDelete = true
            },

            deleteExpenseConfirm (id) {
                this.loading = true

				axios.delete(`expenses/${id}/`)
				.then(response => {
					this.loading = false
					this.closeDelete()
					this.getExpenses()
				}).catch(error => {
					if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
				})
            },

            close () {
                this.dialog = false
                this.$nextTick(() => {
                    this.editedExpense = Object.assign({}, this.defaultExpense)
                    this.editedIndex = -1
                })
            },

            closeDelete () {
                this.dialogDelete = false
                this.$nextTick(() => {
                    this.editedExpense = Object.assign({}, this.defaultExpense)
                    this.editedIndex = -1
                })
            },
        },

		computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Record An Expense' : 'Edit Expense'
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
