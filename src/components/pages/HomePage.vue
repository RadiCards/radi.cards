<template>
  <div class="container">
    <h1>
      <span style="position: absolute; left: -9999px;">RadiCards</span>
      <img src="/static/images/logo.svg" alt="" />
    </h1>
    <blockquote><p>
      Send unique greeting eCards<br/>
      built on Ethereum & IPFS
    </p></blockquote>

    <section class="section">

      <h4 class="section__title">STEP ONE</h4>
      <h2>Choose your favourite radicard</h2>
      <p>All unique designs</p>

      <div class="card-slider">
        <card v-for="item in 10"></card>
      </div>

    </section>

    <section class="section">

      <h4 class="section__title">STEP TWO</h4>
      <h2>Choose a project to support</h2>
      <p>From environmental protection to online privacy rights</p>

      <div class="card-slider">
        <card v-for="item in 3"></card>
      </div>

    </section>

    <section class="section">

      <h4 class="section__title">STEP THREE</h4>
      <h2>Send radicards to friends and family</h2>
      <p>Spread hope & joy</p>

      <div class="card-slider">
        <card></card>
      </div>

    </section>

    <div class="row">
      <div class="col">
        <span class="mt-5" v-if="totalSupply">There are currently <span class="badge badge-primary pl-2 pr-2 ml-2 mr-2">{{ totalSupply }}</span> cards in existence</span>
      </div>
    </div>
  </div>

</template>

<script>

  import { mapGetters, mapState } from 'vuex';
  import * as actions from '../../store/actions';
  import Card from "../../components/widgets/Card";

  export default {
    name: 'home',
    components: { Card },
    data () {
      return {};
    },
    computed: {
      ...mapState(['totalSupply'])
    },
    methods: {},
  };
</script>

<style lang="scss" scoped>
</style>
