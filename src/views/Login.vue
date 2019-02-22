<template>
<b-container class="mt-5">
    <b-row>
        <b-col class="text-center">
            <h1>Login</h1>
                <div class="mt-5" id="firebaseui-auth-container"></div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import * as firebaseui from 'firebaseui'
export default {
  name: 'Login',
  mounted () {
    var vm = this
    var uiConfig = {
      signInOptions: [
        firebase.auth.TwitterAuthProvider.PROVIDER_ID
      ],
      signInFlow: 'popup',
      callbacks: {
        signInSuccessWithAuthResult: function (authResult) {
          vm.$store.commit({ type: 'updateAuth', data: authResult })
          return true
        }
      }
    }
    var ui = new firebaseui.auth.AuthUI(firebase.auth())
    // console.log(ui.isPendingRedirect())
    ui.start('#firebaseui-auth-container', uiConfig)
  }
}
</script>
