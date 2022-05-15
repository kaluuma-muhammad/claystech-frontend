<template>
    <div class="departments mx-4 mb-4">
        <h3 class="subheading grey--text">Job Posts</h3>

        <v-container class="my-3 white lighten-2">
            <v-data-table :headers="headers" :search="search" :items="tableData" sort-by="calories" class="elevation-1">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Job Posts</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn small depressed color="primary" v-bind="attrs" v-on="on">
                                    <v-icon left>mdi-plus</v-icon>
                                    <span>Add Post</span>
                                </v-btn>
                            </template>

                            <v-card>
                                <v-card-title class="grey lighten-3" v-if="editedIndex == -1">
                                    <span class="text-h5">{{ formTitle }}</span>
                                </v-card-title>

								<v-card-title class="grey lighten-3" v-else>
                                    <span class="text-h5">{{ formTitle }} {{ editedPost.post_title }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <form class="mx-4 mb-4">
                                            <v-row>
                                                <v-col cols="12" sm="12" md="12">
                                                    <v-text-field v-model="editedPost.post_title" label="Job Post Title"></v-text-field>

                                                    <span class="errors" v-if="errors && errors.post_title">
                                                        {{ errors.post_title[0] }}
                                                    </span>
                                                </v-col>
                                            </v-row>

                                            <v-layout row wrap class="mt-1">
                                                <v-flex xs12 md4></v-flex>
                                                <v-flex xs12 md4 class="text-center">
                                                    <v-btn v-if="editedIndex == -1" :loading="loading" type="submit" depressed @click.prevent="addPost" color="success" class="mr-4">
                                                        <v-icon left>mdi-check</v-icon>
                                                        <span>Submit</span>
                                                    </v-btn>

													<v-btn v-else :loading="loading" type="submit" depressed @click.prevent="updatePost(editedPost.id)" color="success" class="mr-4">
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
									Are you sure you want to delete post {{ editedPost.post_title }}?
								</v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                    <v-btn color="red darken-1" text @click.prevent="deletePostConfirm(editedPost.id)">OK</v-btn>
                                    
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon color="primary accent-2" class="mr-2" @click="editPost(item)">
                        mdi-pencil
                    </v-icon>

                    <v-icon  color="red accent-2" @click="deletePost(item)">
                        mdi-delete
                    </v-icon>
                </template>

                <template v-slot:[`item.added_by`]="{ item }">
                    {{ item.user.fname }}
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
    import {toast} from 'bulma-toast'
    export default {
        name: "Posts",
        data: () => ({
            loading: false,
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            search: '',
            headers: [
                { text: 'Post Title', align: 'start', sortable: false, value: 'post_title', },
                { text: 'Added By', value: 'added_by' },
                { text: 'Added On', value: 'created_at' },
                { text: 'Updated At', value: 'updated_at' },
                { text: 'Actions', value: 'actions' },
            ],
            tableData: [],
            editedPost: {},
			defaultPost: {},
            errors: {},
        }),

        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Add New Job Post' : 'Edit Job Post'
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
			this.getPosts()
		},

        methods: {
            formatDate(value) {
                return moment(value).format("Do-MMM-YYYY")
            },

            getPosts() {
				axios.get('posts/')
				.then(response => {
					this.tableData = response.data
				})
				.catch(error => {
					console.log(error)
				})
			},

			addPost() {
				this.loading = true

				let postForm = new FormData()
				postForm.append('post_title', this.editedPost.post_title)

				axios.post('posts', postForm)
				.then(response => {
					this.loading = false
					this.dialog = false
					this.getPosts()
				}).catch(error => {
					if (error.response.status == 422) {
                        this.loading = false
                        this.errors = error.response.data.errors
                    }
				})
			},

            editPost (item) {
                this.editedIndex = this.tableData.indexOf(item)
				this.editedPost = Object.assign({}, item)
				this.dialog = true
            },

			updatePost(id) {
				this.loading = true

				axios.put('posts/' + `${id}`, this.editedPost)
				.then(response => {
					this.editedPost.post_title = ''
					this.loading = false
					this.dialog = false
					this.getPosts()
				}).catch(error => {
					if (error.response.status == 422) {
                        this.loading = false
                        this.errors = error.response.data.errors
                    }
				})
			},

            deletePost (item) {
                this.editedIndex = this.tableData.indexOf(item)
                this.editedPost = Object.assign({}, item)
                this.dialogDelete = true
            },

            deletePostConfirm (id) {
                this.loading = true

				axios.delete('posts/' + `${id}`)
				.then(response => {
					this.loading = false
					this.closeDelete()
					this.getPosts()
				}).catch(error => {
					console.log(error);
				})
            },

            close () {
                this.dialog = false
                this.$nextTick(() => {
                    this.editedPost = Object.assign({}, this.defaultPost)
                    this.editedIndex = -1
                })
            },

            closeDelete () {
                this.dialogDelete = false
                this.$nextTick(() => {
                    this.editedPost = Object.assign({}, this.defaultPost)
                    this.editedIndex = -1
                })
            },
        },
    }
</script>
