import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/pages/HomePage'
import Creator from '@/components/pages/Creator'
import Account from '@/components/pages/Account'

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkActiveClass: 'is-active',
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/create',
      name: 'create',
      component: Creator
    },
    {
      path: '/account',
      name: 'account',
      component: Account
    }
  ]
})
