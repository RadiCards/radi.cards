<template>
  <div class="container">
    <h1 style=" margin-bottom:10px;">Card Foundry</h1>
    <p>Create your own unique card while supporting charity. Follow the steps below to compleate your card creation.</p>
    <div class="form-group row" v-if="formData.errors.length">
      <div class="col-sm-4">
        <blockquote>
          <b>Please correct the following error(s):</b>
        </blockquote>
        <ul>
          <li v-for="error in formData.errors">{{ error }}</li>
        </ul>
      </div>
    </div>
    <form>
      <!-- <form-wizard
        title
        subtitle
        color="#333333"
        @on-complete="giveBirth"
        finish-button-text="Create Card!"
      >
        <tab-content title="Select Card" icon="far fa-image">
          <div class="form-group row" v-if="cards && cards.length > 0">
            <h2>Choose your favourite radicard</h2>
            <p>All unique designs</p>

            <div class="card-slider" v-if="cards && cards.length > 0">
              <div v-for="item in cards" :key="item.tokenId">
                <div
                  @click="selectCard(item)"
                  v-bind:class="{'card-selected': formData.card == item}">
                  <card :cdata="item"></card>
                </div>
              </div>
            </div>
          </div>
          <br>
        </tab-content>
        <tab-content title="Gift Recipient" icon="fas fa-gift">
          <div class="form-group row">
            <br>
            <label for="recipient" class="col-sm-2 col-form-label">Recipient</label>
            <div class="col-sm-10">
              <input
                type="text"
                class="field"
                id="recipient"
                v-model="formData.recipient"
                placeholder="0x0abc"
              >
            </div>
            <br>
            <label for="message" class="col-sm-2 col-form-label">
              Message
              <span style="opacity: 0.3">(max 280 characters)</span>
            </label>
            <div class="col-sm-10">
              <b-form-textarea
                id="textarea1"
                v-model="formData.message"
                placeholder="Happy holidays..."
                :rows="3"
                :max-rows="6"
              ></b-form-textarea>
            </div>
          </div>
        </tab-content>
        <tab-content title="Donation Recipient" icon="fas fa-heart">
          <div class="form-group row" v-if="benefactors && benefactors.length > 0">
            <br>
            <label for="valueInETH" class="col-sm-2 col-form-label">Donation amount</label>
            <div class="col-sm-10">
              <input
                type="text"
                class="field"
                id="valueInETH"
                v-model="formData.valueInETH"
                placeholder="donation"
              >
            </div>
            <br>
            <label for="benefactor">Benefactor</label>
            <div class="col-sm-10">
              <select id="benefactor" class="field" v-model="formData.benefactor" required>
                <option disabled selected>Select a benefactor</option>
                <option v-for="benefactor in benefactors" :value="benefactor.id">{{benefactor.name}}</option>
              </select>
            </div>
          </div>
        </tab-content>
        <tab-content title="Send Card!" icon="fas fa-paper-plane">
          <code class="small">
            IPFS Metadata:
            <a
              target="_blank"
              :href="'https://ipfs.infura.io/ipfs/' + response.ipfsHash"
            >{{response.ipfsHash}}</a>
          </code>

          <clickable-transaction :transaction="uploadedHashs" class="small"></clickable-transaction>

          <div class="col text-center">
            <h2 v-if="formData.card">{{formData.card.name}}</h2>
            <img
              v-if="formData.card"
              :src="formData.card.image"
              class="img-thumbnail"
              style="max-height: 150px"
            >

            <h4 v-if="formData.card">{{formData.card.description}}</h4>

            <p v-if="formData.card && formData.message">
              <span class="text-muted small">Message:</span>
              {{formData.message}}
            </p>
            <p v-if="formData.card && formData.recipient">
              <span class="text-muted small">Recipient:</span>
              <code>{{formData.recipient}}</code>
            </p>
            <hr>
          </div>
        </tab-content>
      </form-wizard>-->
      <div role="tablist">
        <b-card class="mb-1">
          <b-card-header header-tag="header" v-b-toggle.accordion1>
            <!-- <b-btn block href="#" v-b-toggle.accordion1 variant="info">Accordion 1</b-btn> -->
            <h4 class="section__title">STEP ONE</h4>
            <h2>Choose your favourite radicard</h2>
          </b-card-header>
          <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <section class="section">
                <div class="form-group row" v-if="cards && cards.length > 0">
                  <p>All unique designs</p>

                  <div class="card-slider" v-if="cards && cards.length > 0">
                    <div v-for="item in cards" :key="item.tokenId">
                      <div
                        @click="selectCard(item)"
                        v-bind:class="{'card-selected': formData.card == item}"
                      >
                        <card :cdata="item"></card>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </b-card-body>
          </b-collapse>
        </b-card>
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-btn block href="#" v-b-toggle.accordion2 variant="info">Accordion 2</b-btn>
          </b-card-header>
          <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <section class="section">
                <h4 class="section__title">STEP TWO</h4>
                <h2>Choose a project to support</h2>
                <p>From environmental protection to online privacy rights</p>

                <div class="charities" v-if="benefactors && benefactors.length > 0">
                  <benefactor v-for="item in benefactors" :key="item.address" :benefactor="item"></benefactor>
                </div>
              </section>
            </b-card-body>
          </b-collapse>
        </b-card>
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-btn block href="#" v-b-toggle.accordion3 variant="info">Accordion 3</b-btn>
          </b-card-header>
          <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <section class="section">
                <h4 class="section__title">STEP THREE</h4>
                <h2>Send radicards to friends and family</h2>
                <p>Spread hope & joy</p>
                <samplequote></samplequote>
              </section>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import * as _ from "lodash";
import IPFS from "ipfs-api";
import Web3 from "web3";
import * as actions from "../../store/actions";
import ClickableTransaction from "../widgets/ClickableTransaction";
import Card from "../../components/widgets/Card";
import Benefactor from "../../components/widgets/Benefactor";
import Samplequote from "../../components/widgets/SampleQuote";

const ipfs = IPFS("ipfs.infura.io", "5001", { protocol: "https" });

export default {
  name: "creator",
  components: { ClickableTransaction, Card, Benefactor, Samplequote },
  data() {
    return {
      formData: {
        errors: [],
        card: {}
      },
      text: `
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
        richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
        brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
        tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
        assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore
        wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher
        vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic
        synth nesciunt you probably haven't heard of them accusamus labore VHS.
      `,
      response: {
        ipfsHash: null
      }
    };
  },
  computed: {
    ...mapState(["account", "uploadedHashs", "cards", "benefactors"])
  },
  mounted() {
    this.$nextTick(function() {
      this.formData.recipient = this.account;
    });
  },
  methods: {
    selectCard(card) {
      console.log("CARD SELECTED");
      console.log(card);
      if (this.formData.card === card) {
        this.formData.card = null;
        return;
      } else {
        this.formData.card = card;
        return;
      }
    },
    giveBirth: function() {
      this.checkForm();
      if (this.formData.errors.length === 0) {
        let recipient = this.formData.recipient;
        let valueInETH = this.formData.valueInETH;
        let benefactorIndex = this.formData.benefactor;
        let cardIndex = this.formData.card.cardIndex;
        let message = this.formData.message;
        let extra = "";

        this.$store.dispatch(actions.BIRTH, {
          recipient,
          benefactorIndex,
          cardIndex,
          message,
          extra,
          valueInETH
        });
      }
    },
    checkForm: function() {
      this.formData.errors = [];
      if (!this.formData.recipient) {
        this.formData.errors.push("Recipient is required.");
      } else if (!Web3.utils.isAddress(this.formData.recipient)) {
        this.formData.errors.push("Recipient not valid address.");
      }
      if (!this.formData.message) {
        this.formData.errors.push("Message is required.");
      }
      if (!this.formData.card) {
        this.formData.errors.push("Card is required.");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";
@import "../../styles/variables.scss";
.card-selected {
  margin-top: -25px;
  transition: all 0.2s ease-in-out;
}
</style>
