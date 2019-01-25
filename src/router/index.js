import Vue from "vue";
import Router from "vue-router";
import HomePage from "@/components/pages/HomePage";
import Creator from "@/components/pages/Creator";
import Account from "@/components/pages/Account";
import CardShop from "@/components/pages/CardShop";
import ViewCard from "@/components/pages/ViewCard";
import ClaimGift from "@/components/pages/ClaimGift";
import About from "@/components/pages/About";
import Charity from "@/components/pages/Charity";
import TermsOfService from "@/components/pages/TermsOfService";
import PrivacyPolicy from "@/components/pages/PrivacyPolicy";

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
      path: "/cardshop",
      name: "cardshop",
      component: CardShop
    },
    {
      path: "/account",
      name: "account",
      component: Account
    },
    {
      path: "/card/:id",
      name: "card",
      component: ViewCard
    },
    {
      path: "/claim/:pk",
      name: "card",
      component: ClaimGift
    },
    {
      path: "/about",
      name: "about",
      component: About
    },
    {
      path: "/charity",
      name: "charity",
      component: Charity
    },
    {
      path: "/terms-of-service",
      name: "terms-of-service",
      component: TermsOfService
    },
    {
      path: "/privacy-policy",
      name: "privacy-policy",
      component: PrivacyPolicy
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return {
        x: 0,
        y: 0
      };
    }
  }
});
