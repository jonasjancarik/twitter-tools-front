<template>
  <div id="app">
        <b-navbar toggleable="md" type="light" variant="light" sticky>

            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

            <b-navbar-brand :to="{ name: 'Home' }">Twitter Tools</b-navbar-brand>

            <b-collapse is-nav id="nav_collapse">

                <b-navbar-nav>
                    <b-nav-item :to="{ name: 'Console' }">Console</b-nav-item>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">

                <b-nav-item-dropdown v-if="(typeof $store.state.auth === 'object' && Object.keys($store.state.auth).length !== 0)" right>
                  <template slot="button-content">
                    <em>@{{ $store.state.auth.additionalUserInfo.profile.screen_name }}</em>
                  </template>
                  <b-dropdown-item :to="{ name: 'User' }">User Profile</b-dropdown-item>
                  <b-dropdown-item @click="logOut()">Signout</b-dropdown-item>
                </b-nav-item-dropdown>

                </b-navbar-nav>

            </b-collapse>

        </b-navbar>
    <router-view/>
  </div>
</template>

<script>
// import firebase from 'firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import { config } from './helpers/firebaseConfig'
export default {
  name: 'App',
  data () {
    return {
    }
  },
  created () {
    firebase.initializeApp(config)
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$router.push({ name: 'User' })
      }
      // else {
      //   this.$router.push({name: 'Login'})
      // }
    })
  },
  mounted () {
  },
  methods: {
    logOut () {
      this.$store.commit({ type: 'updateAuth', data: {} })
      firebase.auth().signOut()
      this.$router.push({ name: 'Login' })
    }
  },
  watch: {
    $route (to, from) {
      if (this.$route.params.screenName) {
        // this.screenName = this.$route.params.screenName
        // this.getUser({ screen_name: this.$route.params.screenName })
      }
    }
  }
}
</script>

<style>
@import url(https://fonts.googleapis.com/icon?family=Material+Icons);

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
