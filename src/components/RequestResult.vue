<template>
  <div>
      <!-- <vuetable ref="vuetable"
    api-url="https://vuetable.ratiw.net/api/users"
    :fields="['name', 'email', 'birthdate']"
  ></vuetable> -->
    <div class="table-responsive">
      <vuetable v-if="dataForVuetable.length" ref="vuetable" :data="{data: dataForVuetable}" data-path="data" :fields="fields" :api-mode="false"></vuetable>
    </div><!-- /.table-responsive -->
    <vue-json-pretty :data="data"></vue-json-pretty>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import Vuetable from 'vuetable-2/src/components/Vuetable'

export default {
  name: 'RequestResult',
  components: {
    VueJsonPretty,
    Vuetable
  },
  props: {
    data: Object
  },
  data () {
    return {
      dataForVuetable: [],
      fields: []
    }
  },
  watch: {
    data: function (newVal) {
      if (!Array.isArray(newVal)) {
        this.dataForVuetable = [newVal]
      } else {
        this.dataForVuetable = newVal
      }

      // decide where to take fields from
      var fieldsSource = Array.isArray(newVal) ? newVal[0] : newVal

      for (const key in fieldsSource) {
        if (fieldsSource.hasOwnProperty(key)) {
          // const element = fieldsSource[key]
          this.fields.push(key)
        }
      }
    }
  }
  // computed: {
  //   fields: function () {
  //     var fields = []
  //     for (const key in this.data[0]) {
  //       if (this.data[0].hasOwnProperty(key)) {
  //         // const element = this.data[0][key]
  //         fields.push(key)
  //       }
  //     }
  //     return fields
  //   }
  // }
  // methods: {
  //   getFields () {

  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
