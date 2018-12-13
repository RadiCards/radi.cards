<template>
  <div class="container">
    <section class="section section--hero">
      <blockquote class="blockquote--hero">
        <p>
          We want to fight against
          <s>internet surveillance</s> and
          <s>censorship</s> and so do you
        </p>
        <span
          class="cheeky-comment"
        >with the power of laughter, memes, cats, hackers and crypto (jokes)</span>
      </blockquote>
      <br>
      <p>NFT eCards for greater fun and greater good.</p>
      <p>Fun goes to you. Income goes to non-profit projects that
        <br>fight to keep our Internet Freedom alive.
      </p>
    </section>

    <section class="section section--credits">
      <div class="container">
        <div class="col-md-4 col-xs-12">
          <h4>Buidl-t on Ethereum and IPFS by the crypto collectible family</h4>
          <ul>
            <li>
              <a href="https://cryptodecks.co" target="_blank">cryptodecks.co</a>
            </li>
            <li>
              <a href="https://knownorigin.io" target="_blank">knownorigin.io</a>
            </li>
            <li>
              <a href="https://pheme.app" target="_blank">pheme.app</a>
            </li>
            <li>
              <a href="https://d1labs.com" target="_blank">d1labs.com</a>
            </li>
            <li>
              <a href="https://blockrocket.tech" target="_blank">blockrocket.tech</a>
            </li>
            <li>
              <a href="https://mbdoesthings.com" target="_blank">mbdoesthings.com</a>
            </li>
          </ul>
        </div>

        <div class="col-md-4 col-xs-12">
          <h4>In partnership with</h4>
          <ul>
            <li>
              <a href="https://superrare.co" target="_blank">superrare.co</a>
            </li>
            <li>
              <a href="https://pixura.io" target="_blank ">pixura.io</a>
            </li>
            <li>
              <a href="https://bounties.network" target="_blank">bounties.network</a>
            </li>
            <li>
              <a href="https://twitter.com/ETHBerlin" target="_blank ">ethberlin</a>
            </li>
            <li>
              <a href="https://blockcities.co" target="_blank">blockcities.co</a>
            </li>
            <li>
              <a href="https://blockpunk.net" target="_blank ">blockpunk.net</a>
            </li>
            <li>
              <a href="https://0xcert.org" target="_blank">0xcert.org</a>
            </li>
            <li>
              <a href="https://churchofconsensus.org" target="_blank ">churchofconsensus.org</a>
            </li>
            <li>
              <a href="https://twitter.com/meta_cartel" target="_blank">metacartel</a>
            </li>
            <li>
              <a href="https://opensea.io/" target="_blank">opensea.io</a>
            </li>
            <li>
              <a href="https://colony.io/" target="_blank">colony.io</a>
            </li>
          </ul>
        </div>

        <div class="col-md-4 col-xs-12">
          <h4>All donations go to</h4>
          <ul>
            <li>
              <a href="https://eff.org" target="_blank">eff.org</a>
            </li>
            <li>
              <a href="https://torproject.org" target="_blank">torproject.org</a>
            </li>
          </ul>
        </div>
      </div>
      <!-- <h2>Choose your favourite radicard</h2>
      <p>All unique designs</p>

      <div class="card-slider" v-if="cards && cards.length > 0">
        <card v-for="item in cards" :key="item.tokenId" :cdata="item">{{item}}</card>
      </div>-->
    </section>

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
      <samplequote></samplequote>
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
import Samplequote from "../../components/widgets/SampleQuote";
import Benefactor from "../../components/widgets/Benefactor";

export default {
  name: "home",
  components: { Card, Benefactor, Samplequote, Buidlers },
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
@import "../../styles/variables.scss";
@import "../../styles/mixins.scss";

// Page-specific style
.section--hero .cheeky-comment {
  position: absolute;
  top: 130%;
  left: 15%;
  width: 14rem;
  transform: rotate(6deg);

  font-weight: bold;

  @include tabletAndUp() {
    top: 100%;
    left: 60%;
    width: 20rem;
    font-size: 1.5rem;
    line-height: 1.5rem;
  }

  &:before {
    content: "";
    position: absolute;
    top: -2rem;
    right: 100%;
    width: 3.5rem;
    height: 3.5rem;
    background: url("/static/images/red-arrow.svg");
    background-size: 85%;
    background-repeat: no-repeat;

    @include tabletAndUp() {
      width: 5rem;
      height: 5rem;
    }
  }
}
.section--credits {
  h4 {
    margin-bottom: 1rem;
    padding: 0 1rem;
    border-left: 2px solid $black;
    color: $gray;
  }
  .container {
    display: flex;
    flex-direction: column;

    .col {
      margin-bottom: 2rem;
    }

    @include tabletAndUp() {
      flex-direction: row;

      .col {
        flex-basis: percentage(1/3);
      }
    }
  }
}
</style>
