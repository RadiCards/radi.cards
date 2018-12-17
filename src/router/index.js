import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/pages/HomePage'
import Creator from '@/components/pages/Creator'
import Account from '@/components/pages/Account'
import CardShop from '@/components/pages/CardShop'
import ViewCard from '@/components/pages/ViewCard'
import About from '@/components/pages/About'

Vue.use(Router);

export default new Router({
  mode: "history",
  linkActiveClass: "is-active",
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage
    },
    {
      path: "/create/:cardIndex",
      name: "create",
      component: Creator
    },
    {
      path: '/cardshop',
      name: 'cardshop',
      component: CardShop
    },
    {
      path: '/account',
      name: 'account',
      component: Account
    },
    {
      path: '/card/:id',
      name: 'card',
      component: ViewCard
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
});
