import axios from 'axios'
// import store from '@/store'

export default () => {
  return axios.create({
    baseURL: process.env.VUE_APP_API_ROOT
    // headers: { 'Authorization': 'Bearer ' + store.state.auth.token }
  })
}
