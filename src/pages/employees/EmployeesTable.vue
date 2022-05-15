<template>
    <div class="employees-table">
		<v-container class="my-3 white lighten-2">
            <v-data-table :headers="headers" :search="search" :items="tableData" sort-by="names" class="pt-1 elevation-1">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Employees</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer><v-spacer></v-spacer>
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                    </v-toolbar>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <router-link :to="{ name: 'employee', params: { id: item.id }}">
                        <v-icon color="info accent-2" class="mr-2">
                            mdi-eye
                        </v-icon>
                    </router-link>
                </template>

                <template v-slot:[`item.image`]="{ item }">
                    <v-responsive>
						<v-avatar size="40" class="grey lighten-2">
                            <img :src="item.image">
                        </v-avatar>
                    </v-responsive>
                </template>

                <template v-slot:[`item.added_by`]="{ item }">
                    {{ item.user.fname }}
                </template>

                <template v-slot:[`item.role_post`]="{ item }">
                    {{ item.post.post_title }}
                </template>
                
                <template v-slot:[`item.created_at`]="{ item }">
                    {{ formatDate(item.created_at) }}
                </template>
            </v-data-table>
        </v-container>
    </div>
</template>

<script>
    import axios from 'axios'
    import moment from 'moment'
	export default {
		name: 'Employees',
        data: () => ({
            search: '',
            headers: [
                { text: 'Image', align: 'start', sortable: false, value: 'image', },
                { text: 'Names', value: 'names', },
                { text: 'Email', value: 'email' },
                { text: 'Role', value: 'role_post' },
                { text: 'Added By', value: 'added_by' },
                { text: 'Added On', value: 'created_at' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            tableData: []
        }),

        mounted() {
        this.getEmployees()
		},
		
		methods: {
            formatDate(value) {
                return moment(value).format("Do-MMM-YYYY")
            },

			getEmployees() {
				axios.get('employees/')
				.then(response => {
					this.tableData = response.data.employees
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
