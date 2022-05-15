<template>
    <div class="employees mx-4 mb-4">
        <nav class="breadcrumb mt-1" aria-label="breadcrumbs">
            <ul>
                <li class="is-active"><router-link to="/employees">Employees</router-link></li>
            </ul>
        </nav>

        <v-container class="my-3 white lighten-2">
            <v-card flat>
				<v-card-actions>
					<v-btn v-if="component == 'EmployeeGrid'" @click="component = 'EmployeeTable'" depressed rounded color="grey lighten-2">
						<v-icon left>mdi-table</v-icon>
						<span>View</span>
					</v-btn>

                    <v-btn v-else @click="component = 'EmployeeGrid'" depressed rounded color="grey lighten-2">
						<v-icon left>mdi-grid</v-icon>
						<span>View</span>
					</v-btn>

					<v-spacer></v-spacer>

					<router-link to="add-employee">
						<v-btn small depressed color="primary">
							<v-icon left>mdi-plus</v-icon>
							<span>Add Employee</span>
						</v-btn>
					</router-link>
					
				</v-card-actions>
			</v-card>

            <keep-alive>
                <component v-bind:is="component" />
            </keep-alive>
        </v-container>
    </div>
</template>
<script>
    import EmployeeGrid from './EmployeesGrid.vue'
    import EmployeeTable from './EmployeesTable.vue'

    export default {
        name: 'Employees',
        
        components: {
            EmployeeGrid,
            EmployeeTable
        },

        data: () => ({
            component: "EmployeeGrid",
        })
    }
</script>