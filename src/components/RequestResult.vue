<template>
  <vue-json-pretty :data="data"></vue-json-pretty>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
export default {
  name: 'RequestResult',
  components: {
    'vue-json-pretty': VueJsonPretty
  },
  props: {
    data: Object
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
