import Api from '@/services/Api'

export default {
  twitterApiRequest (params) {
    return Api().get('/twitter', {
      params: params
    })
  }
}
