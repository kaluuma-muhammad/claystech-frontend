<template>
  <v-footer dark padless>
    <v-card class="flex" flat tile>
        <v-card-text class="py-2 black--text text-center grey lighten-2">
            <strong>&copy;</strong> {{ new Date().getFullYear() }}
				<a href="javascript:;" class="font-italic">Claystech</a>
        </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
  export default {
    data: () => ({
    }),
  }
</script>