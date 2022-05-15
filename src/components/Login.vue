<template>
    <div class="login">
        <v-container class="my-5 grey lighten-2 text-center">
            <v-layout row wrap>
                <v-flex xs1 sm2 md3 lg4></v-flex>
				<v-flex xs10 sm8 md6 lg4>
                    <v-card flat class="text-center ma-15">
                        <v-card-title>
                            <v-responsive class="text-center">
                                <span class="font-weight-bold">Login</span>
                            </v-responsive>
                        </v-card-title>
                        <v-divider></v-divider>

                        <v-card-text>
                            <v-form ref="form">    
                                <v-col cols="12" >
                                    <v-text-field type="email" v-model="form.email" label="E-mail" :rules="[rules.email]"
                                    ></v-text-field>
                                </v-col>

                                <v-col cols="12" >
                                    <v-text-field type="password" v-model="form.password" :rules="[rules.password]" label="Password" required
                                    ></v-text-field>
                                </v-col>
                                
                                <v-btn type="submit" depressed color="primary" @click.prevent="submit">
                                    <v-icon left>mdi-lock-open-outline</v-icon>
                                    <span class="font-weight-capitalize">Login</span>
                                </v-btn>
                                
                            </v-form>
                        </v-card-text>

                        <v-card-actions>
                            <a href="javascript:;">Forgot Password?</a>

                            <v-spacer></v-spacer>

                            <a href="javascript:;">Register</a>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex xs1 sm2 md3 lg4></v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import { mapActions } from "vuex"

    export default {
        name: 'Login',
        data() {
            return {
                form: {
                    email: "",
                    password: "",
                },
                showError: false,
                rules: {
                    email: v => !!(v || '').match(/@/) || 'Please enter a valid email',
                    password: v => v.length >= 5 || 'Password must be 5 characters long'
                }
            }
        },
        methods: {
            ...mapActions(["LogIn"]),

            submit() {
                const User = new FormData();
                User.append("email", this.form.email);
                User.append("password", this.form.password);

                try {
                    this.LogIn(User);
                } catch (error) {
                    this.showError = true
                }
            },
        }
    }
</script>