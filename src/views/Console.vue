<template>
    <div class="view-console">
        <div class="container-fluid">
            <b-row class="mt-5" v-if="errorDisplay">
                <div class="container">
                <div class="row">
                <b-col>
                    <b-alert show>Something went wrong :( {{ errorDisplay }}</b-alert>
                </b-col>
                    </div><!-- /.row -->
                </div><!-- /.container -->
            </b-row>
            <div class="row bg-dark">
                <div class="col text-light">
                    <h1 class="my-2">Console</h1>
                </div><!-- /.col -->
            </div><!-- /.row -->

            <div class="row">
            <div class="col-md-4 py-5" style="background-color: #efefef;">
           <div class="row">
                <div class="col">
                    <h2>Request Builder</h2>
                    <label>Choose endpoint:</label>
                        <v-select v-model="selectedTwitterEndpointName" :options="twitterEndpointUrls"></v-select>
                </div><!-- /.col -->
            </div><!-- /.row mt-5 -->
            <template v-if="Object.keys(selectedTwitterEndpoint).length !== 0">
                <div class="row mt-5">
                    <div class="col">
                        <h3>
                            {{ selectedTwitterEndpoint.method }} {{ selectedTwitterEndpoint.endpoint }}
                            <a :href="selectedTwitterEndpoint.documentationUrl" target="_blank"><i class="material-icons">open_in_new</i></a>
                        </h3>
                        <span class="text-secondary">Resource URL: </span><code>{{ selectedTwitterEndpoint.resourceUrl }}</code>
                    </div><!-- /.col -->
                </div><!-- /.row mt-5 -->

                <div class="row mt-3">
                    <div class="col">
                        <div v-html="selectedTwitterEndpoint.description" class="bg-light p-2 mb-3 rounded">
                        </div>
                        <div v-if="selectedTwitterEndpoint.parameters.length">
                            <h4>Parameters</h4>
                            <form @submit.prevent="makeTwitterApiRequest()">
                                <template v-for="parameter in selectedTwitterEndpoint.parameters">
                                    <div class="form-group" :key="selectedTwitterEndpoint.endpoint + parameter.Name">
                                        <label><strong>{{ parameter.Name }} </strong><span :class="badgeClass(parameter.Required)">{{ parameter.Required }}</span></label>
                                        <input v-if="parameter.Name === 'stringify_ids'" type="text" class="form-control" value="true" readonly>
                                        <input v-else type="text" class="form-control" @input="updateRequestParameters(parameter, $event)">
                                        <small class="form-text text-muted" v-html="parameter.Description"></small>
                                    </div>
                                </template>
                            <button type="submit" class="btn btn-primary" @click="makeTwitterApiRequest()">Send request</button>
                            </form>
                        </div>
                    </div><!-- /.col -->
                </div><!-- /.row mt-3 -->

                <div class="row mt-5 mb-5">
                    <div class="col">
                        <vue-json-pretty :data="request"></vue-json-pretty>
                    </div><!-- /.col -->
                </div><!-- /.row mt-5 -->

                </template><!-- /.col -->

        </div>
            <div class="col">
                <div class="row">
                    <div class="col p-5 bg-light">
                        <h2>Result</h2>
                        <!-- <div v-if="responseIsTwitterError" class="alert alert-warning" role="alert">Check your request - the Twitter API returned an error.</div> -->
                        <div v-if="responseIsTwitterError" class="alert alert-warning" role="alert">{{ response[0].message }}<br><br>Please check your request. You can also <a href="https://github.com/jonasjancarik/twitter-tools-front/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc">file an issue</a> on GitHub.</div><!-- /.alert -->
                        <vue-json-pretty :data="response"></vue-json-pretty>
                    </div><!-- /.col -->
                </div><!-- /.row mt-5 -->
            </div><!-- /.col -->
</div><!-- /.row -->
        </div><!-- /.container -->
    </div><!-- /.view-console -->
</template>

<script>
// @ is an alias to /src
import vSelect from 'vue-select'
import VueJsonPretty from 'vue-json-pretty'

import { twitterApiEndpoints } from '@/helpers/twitterApiEndpoints'
import TwitterService from '@/services/TwitterService'

export default {
  name: 'console',
  components: {
    'v-select': vSelect,
    'vue-json-pretty': VueJsonPretty
  },
  data () {
    return {
      twitterApiEndpoints: twitterApiEndpoints,
      twitterEndpointUrls: ['oauth/authorize', 'oauth/access_token'],
      selectedTwitterEndpointName: '',
      selectedTwitterEndpoint: {},
      request: {
        endpoint: '',
        parameters: {
          stringify_ids: true
        },
        twitterCredentials: {
          accessToken: this.$store.state.auth.credential.accessToken,
          secret: this.$store.state.auth.credential.secret
        }
      },
      response: '',
      responseIsTwitterError: false,
      errorDisplay: ''
    }
  },
  mounted () {
    this.listEndpointURLs()
  },
  methods: {
    async makeTwitterApiRequest () {
      try {
        var result = await TwitterService.twitterApiRequest(this.request)
      } catch (error) {
        this.errorDisplay = error.message
        this.loaderShow = false
      }

      if (result.data.twitterError) {
        this.responseIsTwitterError = true
        this.response = result.data.twitterError
      } else {
        this.responseIsTwitterError = false
        this.response = result.data
      }
    },
    listEndpointURLs () {
      this.twitterApiEndpoints.forEach(endpoint => {
        this.twitterEndpointUrls.push(endpoint.endpoint)
      })
    },
    updateRequest: function () {
      // todo: e.g. feedback/show/:id.json doesn't include the id parameter in the documentation, so it should be added on the fly as a form field
      var endpoint = this.selectedTwitterEndpoint.endpoint

      endpoint = endpoint.split(' ')[0]

      if (endpoint.endsWith('.json')) {
        endpoint = endpoint.substring(0, endpoint.indexOf('.json'))
      }

      if (endpoint.endsWith(':place_id')) {
        endpoint = endpoint.substring(0, endpoint.indexOf('/:place_id'))
      }

      if (endpoint.indexOf(':slug')) {
        endpoint = endpoint.replace(':slug', this.request.parameters.slug)
        // endpoint = endpoint.substring(0, endpoint.indexOf('/:slug'))
      }

      if (endpoint.endsWith('/:id')) {
        endpoint = endpoint.substring(0, endpoint.indexOf('/:id'))
        if (this.selectedTwitterEndpoint.parameters.length === 0) { // todo: too crude, need to check if there are endpoints where the doc lists params but not the id one
          this.selectedTwitterEndpoint.parameters.push({ Name: 'id', Required: 'required' })
        }
      }

      //   this.$set(this.request, 'endpoint', endpoint)
      this.request.endpoint = endpoint
      this.request.method = this.selectedTwitterEndpoint.method
    },
    updateRequestParameters: function (parameter, event) {
      this.$set(this.request.parameters, parameter.Name, event.target.value)
      if (parameter.Name === 'slug') {
        this.updateRequest() // for :slug
      }
    },
    badgeClass (level) {
      switch (level) {
        case 'required':
          return 'badge badge-danger'

        case 'semi-optional':
          return 'badge badge-warning'

        case 'optional':
          return 'badge badge-info'

        default:
          return 'badbe badge-secondary'
      }
    }
  },
  watch: {
    selectedTwitterEndpointName: function (val) {
      var vm = this
      this.selectedTwitterEndpoint = this.$_.find(this.twitterApiEndpoints, function (o) { return o.endpoint === vm.selectedTwitterEndpointName })
      this.updateRequest()
      this.request.parameters = {
        stringify_ids: true
      }
    }
  }
}
</script>

<style>
.v-select .dropdown-toggle .clear {
    top: 3px;
    position: relative;
}

.dropdown-toggle .clear {
    display: none !important;
}

.dropdown-toggle::after {
    display: none !important;
}

.v-select.single.open .selected-tag {
    top: 7px;
}
</style>
