<template>
  <section class="section section--about">

    <h2>Terms of Service</h2>

    <p>Radi.Cards Terms of Service</p>

    <h4>Radi.Cards </h4>
    <p><i>Last Updated: 15 December, 2018</i></p>

    <p>[...]</p>
    
    <h6>14. Privacy Policy</h6>
    <p>Our <router-link :to="{ name: 'privacy-policy' }">Privacy Policy</router-link> describes the ways we collect, use, store and disclose your personal information, and is hereby incorporated by this reference into these Terms. You agree to the collection, use, storage, and disclosure of your data in accordance with our Privacy Policy</p>

    <p>Users with questions, complaints or claims with respect to the App may contact us at <a href="mailto:hello@radi.cards.io">hello@radi.cards.io</a>.</p>

    <p>&copy; 2018 Radi.Cards — Made with ETH & IPFS </p>

  </section>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import * as actions from "../../store/actions";

export default {
  name: "terms-of-service",
  computed: {},
  created() {}
};
</script>

<style lang="scss" scoped>
.section--about {
  h1, h2 {
    margin-bottom: 2rem;
  }
  p, h3, h4, ul, ol {
    margin-bottom: 1rem;
  }
  ul {
    list-style: square;
    padding-left: 1rem;

    li {
      margin-bottom: 0.25rem;
    }
  }
}
</style>
