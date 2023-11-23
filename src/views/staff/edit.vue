<template>
  <staff-detail :is-edit="true" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import StaffDetail from './components/StaffDetail.vue'

@Component({
  name: 'EditArticle',
  components: {
    StaffDetail
  }
})
export default class extends Vue {}
</script>
