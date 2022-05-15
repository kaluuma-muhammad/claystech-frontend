<template>
    <div class="project mx-4 mb-4">
        <h3 class="subheading grey--text">Projects</h3>

        <v-container class="my-3 white lighten-2">
            <v-card flat>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn small depressed color="primary" v-bind="attrs" v-on="on">
                                <v-icon left>mdi-plus</v-icon>
                                <span>Add Project</span>
                            </v-btn>
                        </template>

                        <v-card>
                            <v-card-title class="grey lighten-3" v-if="editedIndex == -1">
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-title class="grey lighten-3" v-else>
                                <span class="text-h5">{{ formTitle }} {{ editedProject.project_name }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <form class="mx-2 mb-4">
                                        <v-row>
                                            <v-col cols="6" sm="12" md="6">
                                                <v-text-field v-model="editedProject.project_name" label="Project Name"></v-text-field>

                                                <span class="errors" v-if="errors && errors.project_name">
                                                    {{ errors.project_name[0] }}
                                                </span>
                                            </v-col>

                                            <v-col cols="6" sm="12" md="6">
                                                <v-autocomplete v-model="editedProject.head_of_project" :items="users" label="Head of Project"
                                                    item-text="fname" item-value="id" placeholder="Select Head Of Project">
                                                </v-autocomplete>

                                                <span class="errors" v-if="errors && errors.head_of_project">
                                                    {{ errors.head_of_project[0] }}
                                                </span>
                                            </v-col>

                                            <v-col cols="6" sm="12" md="6">
                                                <v-textarea height="127" v-model="editedProject.project_details" label="Project Details"></v-textarea>

                                                <span class="errors" v-if="errors && errors.project_details">
                                                    {{ errors.project_details[0] }}
                                                </span>
                                            </v-col>

                                            <v-col cols="6" sm="12" md="6">
                                                <v-row>
                                                    <v-col cols="12" sm="12" md="12">
                                                        <v-autocomplete v-model="editedProject.project_type" :items="['Website', 'System', 'Website and System']"
                                                            label="Project Type" placeholder="Select Project Type">
                                                        </v-autocomplete>

                                                        <span class="errors" v-if="errors && errors.project_type">
                                                            {{ errors.project_type[0] }}
                                                        </span>
                                                    </v-col>

                                                    <v-col cols="12" sm="12" md="12">
                                                        <v-autocomplete v-model="editedProject.stage" :items="['Development', 'Testing', 'Complete', 'Paused']"
                                                            label="Project Stage" placeholder="Select Project's Stage">
                                                        </v-autocomplete>

                                                        <span class="errors" v-if="errors && errors.stage">
                                                            {{ errors.stage[0] }}
                                                        </span>
                                                    </v-col>
                                                </v-row>
                                                
                                            </v-col>
                                            
                                            <v-col cols="6" sm="12" md="6">
                                                <v-text-field v-model="editedProject.progress" label="Project's Progress"></v-text-field>

                                                <span class="errors" v-if="errors && errors.progress">
                                                    {{ errors.progress[0] }}
                                                </span>
                                            </v-col>

                                            <v-col cols="6" sm="12" md="6">
                                                <v-menu origin="center center" transition="scale-transition">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field  v-bind="attrs" v-on="on" :value="editedProject.due_date" label="Due Date"></v-text-field>
                                                    </template>

                                                    <v-list>
                                                        <v-list-item>
                                                            <v-date-picker v-model="editedProject.due_date" flat></v-date-picker>
                                                        </v-list-item>
                                                    </v-list>
                                                </v-menu>

                                                <span class="errors" v-if="errors && errors.due_date">
                                                    {{ errors.due_date[0] }}
                                                </span>
                                            </v-col>
                                            
                                        </v-row>

                                        <v-layout row wrap class="mt-1">
                                            <v-flex xs12 md4></v-flex>
                                            <v-flex xs12 md4 class="text-center">
                                                <v-btn v-if="editedIndex == -1" :loading="loading" @click.prevent="addProject" type="submit" depressed color="success" class="mr-4">
                                                    <v-icon left>mdi-check</v-icon>
                                                    <span>Submit</span>
                                                </v-btn>

                                                <v-btn v-else :loading="loading" @click.prevent="updateProject(editedProject.id)" type="submit" depressed color="success" class="mr-4">
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
                                Are you sure you want to delete project {{ editedProject.project_name }}?
                            </v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>

                                <v-btn color="blue darken-1" text @click="closeDelete">NO</v-btn>
                                <v-btn color="red darken-1" text @click="deleteProjectConfirm(editedProject.id)">YES</v-btn>
                                
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-actions>
            </v-card>

            <v-layout row wrap class="pt-1">
				<v-flex xs12 sm6 md6 lg6 v-for="p in projects" :key="p.id">
					<v-hover v-slot="{ hover }">
						<v-card flat :elevation="hover ? 10 : 2" :class="{ 'on-hover': hover }" class="grey lighten-3 text-center ma-3">

							<v-card-text>
                                <div class="pt-2">
                                    <h2 class="bold--text"> {{ p.project_name }} </h2>
                                    <v-row wrap>
                                        <v-col cols="12" sm="6" md="6">
                                            <h4 class="subheading">Created On</h4>
                                            <i> {{ formatDate(p.created_at) }} </i>
                                        </v-col>

                                        <v-col cols="12" sm="6" md="6">
                                            <h4 class="subheading">Last Updated</h4>
                                            <i> {{ formatDate(p.updated_at) }} </i>
                                        </v-col>
                                    </v-row>
                                </div>

                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <div class="details">
                                            <p> {{ p.project_details }} </p>
                                        </div>
                                    </v-col>
                                </v-row>

                                <v-row wrap>
                                    <v-col cols="12" sm="6" md="4">
                                        <h3 class="bold--text">Project Type</h3>
                                        <p> {{ p.project_type }} </p>
                                    </v-col>

                                    <v-col cols="12" sm="6" md="4">
                                        <h3 class="bold--text">Stage</h3>
                                        <p> {{ p.stage }} </p>
                                    </v-col>

                                    <v-col cols="12" sm="6" md="4">
                                        <h3 class="bold--text">Head Of Project</h3>
                                        <p> {{ p.user.fname }} {{ p.user.lname }} </p> 
                                    </v-col>
                                </v-row>

                                <v-row wrap>
                                    <v-col cols="12" sm="6" md="4">
                                        <h3 class="bold--text">Due Date</h3>
                                        <p> {{ formatDate(p.due_date) }} </p>
                                    </v-col>

                                    <v-col cols="12" sm="6" md="8">
                                        <h3 class="bold--text pb-1">Progress</h3>
                                        <v-progress-linear height="10" :value="p.progress" color="success"></v-progress-linear>
                                    </v-col>
                                </v-row>
							</v-card-text>

							<v-card-actions>
                                <v-btn @click="editProject(p)" text depressed small class="primary--text">
                                    <v-icon small left>mdi-pencil</v-icon>
                                    <span>Edit</span>
                                </v-btn>

								<v-spacer></v-spacer>

                                <v-btn @click="deleteProject(p)" depressed small class="red--text">
                                    <v-icon small left>mdi-delete</v-icon>
                                    <span>Delete</span>
                                </v-btn>
							</v-card-actions>
						</v-card>
					</v-hover>
				</v-flex>
			</v-layout>
        </v-container>
    </div>
</template>

<script>
	import axios from 'axios'
    import moment from 'moment'
    export default {
        name: "Projects",

        data: () => ({
            loading: false,
            dialog: false,
            errors: {},
            projects: [],
            editedIndex: -1,
            users: [],
            editedProject: {},
            defaultProject: {},
            dialogDelete: false,
        }),

        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Add New Project' : 'Edit Project'
            },
        },

        mounted() {
            this.getProjects()
		},

        methods: {
            formatDate(value) {
                return moment(value).format("Do-MMM-YYYY")
            },

            getProjects () {
                axios.get('projects/')
				.then(response => {
                    this.users = response.data.users
                    this.projects = response.data.projects
				})
				.catch(error => {
					console.log(error)
				})
            },

            addProject() {
                this.loading = true

                let projectForm = new FormData()
				projectForm.append('project_name', this.editedProject.project_name)
                projectForm.append('head_of_project', this.editedProject.head_of_project)
                projectForm.append('project_details', this.editedProject.project_details)
                projectForm.append('project_type', this.editedProject.project_type)
                projectForm.append('stage', this.editedProject.stage)
                projectForm.append('progress', this.editedProject.progress)
                projectForm.append('due_date', this.editedProject.due_date)

                axios.post('projects/', projectForm)
				.then(response => {
					this.loading = false
                    this.project = {}
                    this.errors = {}
                    this.dialog = false
                    this.getProjects()
				}).catch(error => {
                    if (error.response.status == 422) {
                        this.loading = false
                        this.errors = error.response.data.errors
                    }
				})
            },

            editProject (p) {
                this.editedIndex = this.projects.indexOf(p)
                this.editedProject = Object.assign({}, p)
                this.dialog = true
            },

            updateProject(id) {
				this.loading = true

				axios.put(`projects/${id}/`, this.editedProject)
				.then(response => {
					this.loading = false
					this.dialog = false
					this.getProjects()
				}).catch(error => {
					if (error.response.status == 422) {
                        this.loading = false
                        this.errors = error.response.data.errors
                    }
				})
			},

            deleteProject (p) {
                this.editedIndex = this.projects.indexOf(p)
                this.editedProject = Object.assign({}, p)
                this.dialogDelete = true
            },

            deleteProjectConfirm (id) {
                this.loading = true

				axios.delete(`projects/${id}/`)
				.then(response => {
					this.loading = false
					this.closeDelete()
					this.getProjects()
				}).catch(error => {
					console.log(error);
				})
            },

            close () {
                this.dialog = false
                this.$nextTick(() => {
                    this.editedProject = Object.assign({}, this.defaultDepartment)
                    this.editedIndex = -1
                })
            },

            closeDelete () {
                this.dialogDelete = false
                this.$nextTick(() => {
                    this.editedProject = Object.assign({}, this.defaultDepartment)
                    this.editedIndex = -1
                })
            }
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
