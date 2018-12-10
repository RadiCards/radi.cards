<template>
  <div class="container">
    <h1>
      <span style="position: absolute; left: -9999px;">RadiCards</span>
      <img src="/static/images/logo.svg" style=" margin-bottom:10px;" alt>
    </h1>
    <blockquote>
      <p>Send unique greeting eCards
        <br>built on Ethereum & IPFS
      </p>
    </blockquote>

    <section class="section">
      <h4 class="section__title">STEP ONE</h4>
      <h2>Choose your favourite radicard</h2>
      <p>All unique designs</p>

      <div class="card-slider" v-if="cards && cards.length > 0">
        <card v-for="item in cards" :key="item.tokenId" :cdata="item">{{item}}</card>
      </div>
    </section>

    <section class="section">
      <h4 class="section__title">STEP TWO</h4>
      <h2>Choose a project to support</h2>
      <p>From environmental protection to online privacy rights</p>

      <div class="charities" v-if="benefactors && benefactors.length > 0">
        <benefactor v-for="item in benefactors" :key="item.address" :benefactor="item"></benefactor>
      </div>
    </section>

    <section class="section">
      <h4 class="section__title">STEP THREE</h4>
      <h2>Send radicards to friends and family</h2>
      <p>Spread hope & joy</p>
      <div class="card-slider" v-if="cards && cards.length > 0">
        <cardsmall v-for="(item, index) in cards" :key="index" :cdata="item">{{item}}</cardsmall>
      </div>
    </section>

    <section class="section">
      <h4 class="section__title">Buidl-ers</h4>
      <!-- <h2>Send radicards to friends and family</h2> -->
      <p>All of us from the NFT and Web3 family!</p>
      <buidlers></buidlers>
    </section>

    <div class="row">
      <div class="col">
        <span class="mt-5" v-if="totalSupply">
          There are currently
          <span class="badge badge-primary pl-2 pr-2 ml-2 mr-2">{{ totalSupply }}</span> cards in existence
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import * as actions from "../../store/actions";
import Buidlers from "../../components/widgets/Buidlers";
import Card from "../../components/widgets/Card";
import Cardsmall from "../../components/widgets/CardSmall";
import Benefactor from "../../components/widgets/Benefactor";

export default {
  name: "home",
  components: { Card, Benefactor, Cardsmall, Buidlers },
  data() {
    return {};
  },
  computed: {
    ...mapState(["totalSupply", "cards", "benefactors"])
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
