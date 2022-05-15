<template>
    <div class="dashboard mx-4 mb-4">
        <h3 class="subheading grey--text">Dashboard</h3>

        <v-container class="my-3 white">
            <v-row dense>
                <v-col cols="12">
                    <v-card color="white lighten-4 black--text" flat dark>
                        <v-layout row wrap class="black--text darken-1">
                            <v-flex xs12 md6>
                                <v-card-title class="text-h5"> Project Title </v-card-title>

                                <v-card-subtitle class="black--text">
                                    Design a website
                                </v-card-subtitle>
                            </v-flex>

                            <v-flex xs6 sm4 md2>
                                <v-card-title class="text-h5"> Person </v-card-title>
                                
                                <v-card-subtitle class="black--text">
                                    Meddy Clays
                                </v-card-subtitle>
                            </v-flex>

                            <v-flex xs6 sm4 md2>
                                <v-card-title class="text-h5"> Due By </v-card-title>
                                
                                <v-card-subtitle class="black--text">
                                    21 Aug 2021
                                </v-card-subtitle>
                            </v-flex>

                            <v-flex xs6 sm4 md2>
                                <v-card-title class="text-h5"> Status </v-card-title>
                                
                                <v-card-subtitle class="black--text">
                                    Ongiong
                                </v-card-subtitle>
                            </v-flex>                            
                        </v-layout>
                        
                    </v-card>
                </v-col>
                <v-divider></v-divider>
                <v-col cols="12">
                    <v-card color="white lighten-4 black--text" flat dark>
                        <v-layout row wrap class="black--text darken-1">
                            <v-flex xs12 md6>
                                <v-card-title class="text-h5"> Project Title </v-card-title>

                                <v-card-subtitle class="black--text">
                                    Design a website
                                </v-card-subtitle>
                            </v-flex>

                            <v-flex xs6 sm4 md2>
                                <v-card-title class="text-h5"> Person </v-card-title>
                                
                                <v-card-subtitle class="black--text">
                                    Meddy Clays
                                </v-card-subtitle>
                            </v-flex>

                            <v-flex xs6 sm4 md2>
                                <v-card-title class="text-h5"> Due By </v-card-title>
                                
                                <v-card-subtitle class="black--text">
                                    21 Aug 2021
                                </v-card-subtitle>
                            </v-flex>

                            <v-flex xs6 sm4 md2>
                                <v-card-title class="text-h5"> Status </v-card-title>
                                
                                <v-card-subtitle class="black--text">
                                    Ongiong
                                </v-card-subtitle>
                            </v-flex>                            
                        </v-layout>
                        
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    export default {
        name: 'Dashboard',
        data () {
            return {
                projects: [
                    {title: 'Design a website', person: 'Meddy Clays', due: '21 Aug 2021', status: 'Ongoing', content: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis, eligendi placeat officia error repudiandae fugiat id asperiores magnam ex velit tempore dicta eius odio? Reiciendis eveniet obcaecati accusantium nam architecto?'},
                    {title: 'Code up a homepage', person: 'Chun Li', due: '25 April 2018', status: 'Complete', content: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis, eligendi placeat officia error repudiandae fugiat id asperiores magnam ex velit tempore dicta eius odio? Reiciendis eveniet obcaecati accusantium nam architecto?'},
                    {title: 'Design video thumbnails', person: 'Ryu Mat', due: '11 Sept 2019', status: 'Complete', content: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis, eligendi placeat officia error repudiandae fugiat id asperiores magnam ex velit tempore dicta eius odio? Reiciendis eveniet obcaecati accusantium nam architecto?'},
                    {title: 'Create a community forum', person: 'Gouken Han', due: '22 Dec 2021', status: 'ongoing', content: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis, eligendi placeat officia error repudiandae fugiat id asperiores magnam ex velit tempore dicta eius odio? Reiciendis eveniet obcaecati accusantium nam architecto?'}
                ],
            }
        }
    }
</script>
