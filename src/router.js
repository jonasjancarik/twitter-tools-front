import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app'
import 'firebase/auth'

import Home from './views/Home'
import Login from './views/Login'
import User from './views/User'
import Console from './views/Console'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/user',
      name: 'User',
      component: User,
      meta: { requiresAuth: false }
    },
    {
      path: '/console',
      name: 'Console',
      component: Console,
      meta: { requiresAuth: true }
    }    
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!firebase.auth().currentUser) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
