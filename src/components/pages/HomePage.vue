
<template>
  <div class="container">
    <section class="section section--hero">
        
      <blockquote class="blockquote--hero">
        <p>We want to change the world & fight for good.</p>
        <p>Want to help?</p>
        <span class="cheeky-comment">with the power of memes, cats, hackers and crypto (jokes)</span>
      </blockquote>
      <br>
      <p
        style="max-width: 24rem; margin-bottom: 1rem;"
      >Share NFT eCards with friends and family for FREE (well almost, you just pay the gas) and donate to the charities you wish to support</p>

      <router-link :to="{ name: 'cardshop' }" class="btn">Send a card</router-link>
    </section>

    <section class="section section--credits">
      <div class="container" style="margin: 0 -2rem;">
        <div class="col-md-4 col-xs-12">
          <h5>Buidl-t on Ethereum and IPFS by the crypto collectible community</h5>
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
              <a href="http://blockrocket.tech" target="_blank">blockrocket.tech</a>
            </li>
            <li>
              <a href="https://mbdoesthings.com" target="_blank">mbdoesthings.com</a>
            </li>
            <li>
              <a href="https://github.com/SoIidarity" target="_blank">chris maree</a>
            </li>
          </ul>
        </div>

        <div class="col-md-4 col-xs-12">
          <h5>Community buidl-ing and creative partnership</h5>
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
            <li>
              <a href="https://www.astroledger.org" target="_blank">astroledger.org</a>
            </li>
          </ul>
        </div>

        <div class="col-md-4 col-xs-12">
          <h5>All donations go to</h5>
          <ul>
            <li>
              <a href="https://eff.org" target="_blank">eff.org</a>
            </li>
            <li>
              <a href="https://enlawfoundation.org" target="_blank">enlawfoundation.org</a>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section">
      <h4 class="section__title">STEP ONE</h4>
      <h2>Choose and personalise your RadiCards</h2>
      <p>Send to any ETH addresses and emails</p>

      <div class="card-slider" v-if="cards && cards.length > 0">
        <card v-for="item in cards" :key="item.tokenId" :cdata="item">{{item}}</card>
      </div>

      <div v-else class="loading-container">
        <div class="loading-spinner">
          <div class="loading-spinner-inner">
            <div class="holder"><div class="box"></div></div>
            <div class="holder"><div class="box"></div></div>
            <div class="holder"><div class="box"></div></div>
          </div>
        </div>
        <span class="text">Getting cards...</span>
      </div>
      
    </section>

    <section class="section">
      <h4 class="section__title">STEP TWO</h4>
      <h2>Choose a project you wish to support</h2>
      <p>All profit goes directly to the charity (excludes GAS cost)</p>

      <div class="charities" v-if="benefactors && benefactors.length > 0">
        <benefactor v-for="item in benefactors" :key="item.address" :benefactor="item"></benefactor>
      </div>
    </section>

    <section class="section">
      <h4 class="section__title">STEP THREE</h4>
      <h2>Share radiCards with friends and donate to good causes</h2>
      <p>Help spread hope and joy with eCards</p>
      <!-- <img src="/static/images/step3.png" alt class="img--placeholder" height="450"> -->
      <!-- <samplequote></samplequote> -->
      <div class="row text-center pt-3">
        <div class="col"/>
        <div class="col">
          <card :cdata="cardData"/>
        </div>
        <div class="col"/>
      </div>
      
    </section>

    <div class="row">
      <div class="col">
        <span v-if="totalSupply">
          There
          <span v-if="totalSupply !== 1">are</span>
          <span v-else>is</span> currently
          <span class="badge badge-primary ml-1 mr-1">{{ totalSupply }}</span>
          card<span v-if="totalSupply !== 1">s</span> in existence
        </span>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col">
        <span v-if="totalSupply">
          Want to help buidl-ing? <a href="https://t.me/joinchat/GBiop1dC2yYsgFwo4O3gMA">Join our Telegram group!</a>
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
    return {
      cardData: {
        extra: "",
        giftAmount: 0.1,
        message:
          "We don't need more fiat, but love for this holiday!\n\n Enjoy the festive season.",
        BenefactorIndex: 1,
        accountCreatedCard: false,
        tokenId: 28,
        name: "Privacy Forever",
        description: "Forever be with me my privacy.",
        image:
          "https://ipfs.infura.io/ipfs/QmNRUjkackbZcnkxhjDcF81dAHDdNK9yuZShHPGCi4Eih4",
        attributes: { artist: "Hernan Wave" },
        external_uri: "https://radi.cards",
        cardIndex: 11
      }
    };
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
  top: 140%;
  left: 40%;
  width: 14rem;
  transform: rotate(6deg);

  font-weight: bold;

  @include tabletAndUp() {
    top: 110%;
    left: 70%;
    width: 20rem;
    font-size: 1.5rem;
    line-height: 1.5rem;
  }

  &:before {
    content: "";
    position: absolute;
    top: -3rem;
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
  h5 {
    margin-bottom: 1rem;
    padding: 0 1rem;
    border-left: 2px solid $gray;
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