<template>
    <div class="revenues mx-4 mb-4">
		<h3 class="subheading grey--text">Revenues</h3>

        <v-container class="my-3 white lighten-2">
            <v-card flat>
				<v-card-actions>
					<v-btn v-if="component == 'RecordRevenuue'" @click="component = 'AddRevenuue'" depressed rounded color="grey lighten-2">
						<span>Add A Revenue</span>
					</v-btn>

                    <v-btn v-else @click="component = 'RecordRevenuue'" depressed rounded color="grey lighten-2">
						<span>Record A Revenue</span>
					</v-btn>
				</v-card-actions>
			</v-card>

            <keep-alive>
                <component v-bind:is="component" />
            </keep-alive>
        </v-container>
    </div>
</template>
<script>
    import RecordRevenuue from './RecordRevenuue.vue'
    import AddRevenuue from './AddRevenuue.vue'

    export default {
        name: 'Revenues',
        
        components: {
            RecordRevenuue,
            AddRevenuue
        },

        data: () => ({
            component: "RecordRevenuue",
        })
    }
</script>