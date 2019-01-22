
<template>
  <div class="container">
    <section class="section section--hero">
      <blockquote class="blockquote--hero">
        <h1 class="hero">Send your Ethereum hongbao</h1>
        <h1 class="hero">via WeChat</h1>

        <!--- <img src="/static/images/title2.png">
        <br>
        <img src="/static/images/title1.png">-->
      </blockquote>

      <router-link :to="{ name: 'cardshop' }" class="btn">Send Ether Hongbao</router-link>

      <div class="compatible">
        <h5>COMPATIBLE WITH</h5>
        <div class="icons">
          <div>
            <img src="/static/icons/wechat.svg">
            <span>WeChat</span>
          </div>
          <div>
            <img src="/static/icons/imToken.svg">
            <span>imToken</span>
          </div>
          <div>
            <img src="/static/icons/DAI.svg">
            <span>DAI</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <windy-title text="Send Hongbao in 3 Easy Steps"></windy-title>
      <div class="steps">
        <div>
          <img src="/static/images/sombreros.png">
          <h5>Choose</h5>
          <span>cool hangbao design from
            <br>artists around the word
          </span>
        </div>
        <div>
          <img src="/static/images/deposit.svg">
          <h5>Deposit</h5>
          <span>ether or DAI &amp;
            <br>generate hongbao
          </span>
        </div>
        <div>
          <img src="/static/images/sombreros.png">
          <h5>Send</h5>
          <span>hongbao to friends via
            <br>WeChat &amp; Email
          </span>
        </div>
      </div>
    </section>

    <section class="section">
      <windy-title text="Choose from a collection of hongbao art"></windy-title>

      <div class="card-slider" v-if="cards && cards.length > 0">
        <card
          style="margin-right: 1rem;"
          v-for="item in cards"
          :key="item.tokenId"
          :cdata="item"
        >{{item}}</card>
      </div>

      <div v-else class="loading-container">
        <div class="loading-spinner">
          <div class="loading-spinner-inner">
            <div class="holder">
              <div class="box"></div>
            </div>
            <div class="holder">
              <div class="box"></div>
            </div>
            <div class="holder">
              <div class="box"></div>
            </div>
          </div>
        </div>
        <span class="text">Getting cards...</span>
      </div>
    </section>

    <section class="section section--credits">
      <windy-title text="Buidl-t with <3 on Ethereum and IPFS"/>
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
            <li>
              <a href="https://volca.tech" target="_blank">volca</a>
            </li>
            <li>
              <a href="https://www.gustav.tech" target="_blank">gustav tech</a>
            </li>
            <li>
              <a href="https://www.chris.seifert.space" target="_blank">chris seifert</a>
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

    <cookiebanner></cookiebanner>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import * as actions from "../../store/actions";
import Buidlers from "../../components/widgets/Buidlers";
import Card from "../../components/widgets/Card";
import Samplequote from "../../components/widgets/SampleQuote";
import Benefactor from "../../components/widgets/Benefactor";
import Cookiebanner from "../../components/widgets/CookieBanner";
import WindyTitle from "../widgets/WindyTitle";

export default {
  name: "home",
  components: {
    Card,
    Benefactor,
    Samplequote,
    Buidlers,
    Cookiebanner,
    WindyTitle
  },
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
    ...mapState([
      "totalSupply",
      "totalGifted",
      "usdPrice",
      "cards",
      "benefactors"
    ])
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
@import "../../styles/mixins.scss";

.blockquote--hero {
  img {
    max-width: 100%;
  }
}
// Page-specific style
.hero {
  font-size: 3.9rem;
  color: $darkgray;
}

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
    margin-bottom: 0.1rem;
    padding: 0;
    color: $darkgray;
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

.steps {
  display: flex;
  align-items: center;
  justify-content: space-between;

  h5 {
    font-size: 25px;
  }

  span {
    font-size: 20px;
  }

  img {
    margin-bottom: 10px;
  }
}

.compatible {
  h5 {
    margin-top: 30px;
    font-size: 15px;
  }

  .icons {
    display: flex;
    margin-top: 30px;

    div {
      margin-right: 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      img {
        margin-top: 20px;
        height: 40px;
        width: 40px;
        margin-bottom: 10px;
      }

      span {
        font-family: Helvetica;
        line-height: 11px;
        font-size: 12px;

        color: #414141;
      }
    }
  }
}
</style>