<template>
  <div class="container">
    <h1>Card Foundry</h1>
    <div class="form-group row" v-if="formData.errors.length">
      <div class="col-sm-4">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in formData.errors">{{ error }}</li>
        </ul>
      </div>
    </div>
    <form>
      <form-wizard title subtitle color="#333333" 
      @on-complete="giveBirth"
      finish-button-text="Create Card!"
>
        <tab-content title="Select Card" icon="far fa-image">
          <div class="form-group row" v-if="cards && cards.length > 0">
            <label for="colour" class="col-sm-2 col-form-label">Cards</label>
            <div class="col-sm-10">
              <select class="field" id="colour" v-model="formData.card">
                <option v-for="card in cards" :value="card">{{card.name}}</option>
              </select>
            </div>
          </div>

          <img
            v-if="formData.card"
            :src="formData.card.image"
            class="img-thumbnail"
            style="max-height: 150px"
          >

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
            <!-- <pre class="small">{{generateIpfsData()}}</pre> -->
          </div>
          <!-- <button type="button" class="btn btn-primary" v-on:click="giveBirth">Create</button> -->
        </tab-content>
      </form-wizard>
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

const ipfs = IPFS("ipfs.infura.io", "5001", { protocol: "https" });

export default {
  name: "creator",
  components: { ClickableTransaction },
  data() {
    return {
      formData: {
        errors: []
      },
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
    giveBirth: function() {
      this.checkForm();
      if (this.formData.errors.length === 0) {
        let recipient = this.formData.recipient;
        let valueInETH = this.formData.valueInETH;
        let benefactorIndex = this.formData.benefactor.toNumber();
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
</style>
