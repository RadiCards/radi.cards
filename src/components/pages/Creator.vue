<template>
  <div class="container">
    <h1>Card Foundry</h1>

    <div class="row">
      <div class="col">
        <form>
          <div class="form-group row" v-if="formData.errors.length">
            <div class="col-sm-4">
              <b>Please correct the following error(s):</b>
              <ul>
                <li v-for="error in formData.errors">{{ error }}</li>
              </ul>
            </div>
          </div>

          <div class="form-group row">
            <label for="colour" class="col-sm-2 col-form-label">Cards</label>
            <div class="col-sm-10">
              <select class="form-control" id="colour" v-model="formData.card">
                <option v-for="card in formLookupData.cards" :value="card">{{card.name}}</option>
              </select>
            </div>
          </div>

          <div class="form-group row">
            <label for="recipient" class="col-sm-2 col-form-label">Recipient</label>
            <div class="col-sm-10">
              <input
                type="text"
                class="form-control"
                id="recipient"
                v-model="formData.recipient"
                placeholder="0x0abc"
              >
            </div>
          </div>

          <div class="form-group row">
            <label for="message" class="col-sm-2 col-form-label">Message</label>
            <div class="col-sm-10">
              <input
                type="text"
                class="form-control"
                id="message"
                v-model="formData.message"
                placeholder="Happy holidays..."
              >
              <input
                type="text"
                class="form-control"
                id="valueInETH"
                v-model="formData.valueInETH"
                placeholder="donation"
              >
              <select id="benefactor" v-model="formData.benefactor">
                <option value="1">EEF</option>
                <option value="2">Freedom of the Press Foundation</option>
              </select>
            </div>
          </div>

          <button type="button" class="btn btn-primary" v-on:click="giveBirth">Create</button>

          <hr>

          <code class="small">
            IPFS Metadata:
            <a
              target="_blank"
              :href="'https://ipfs.infura.io/ipfs/' + response.ipfsHash"
            >{{response.ipfsHash}}</a>
          </code>

          <clickable-transaction :transaction="uploadedHashs" class="small"></clickable-transaction>
        </form>
      </div>
      <div class="col text-center">
        <h2 v-if="formData.card">{{generateIpfsData().name}}</h2>
        <img
          v-if="formData.card"
          :src="'https://ipfs.infura.io/ipfs/' + formData.card.hash"
          class="img-thumbnail"
          style="max-height: 150px"
        >

        <h4 v-if="formData.card">{{generateIpfsData().description}}</h4>

        <p v-if="formData.card && formData.message">
          <span class="text-muted small">Message:</span>
          {{formData.message}}
        </p>
        <p v-if="formData.card && formData.recipient">
          <span class="text-muted small">Recipient:</span>
          <code>{{formData.recipient}}</code>
        </p>

        <hr>

        <pre class="small">{{generateIpfsData()}}</pre>
      </div>
    </div>
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
      formLookupData: {
        cards: [
          {
            name: "Grinch",
            description: "Ho ho ho...NO!",
            hash: "QmUyLttKRZxneFmmoETXoVfy3X1dmoimQ2PFLrSNM5EDMR",
            uri:
              "https://ipfs.infura.io/ipfs/QmUyLttKRZxneFmmoETXoVfy3X1dmoimQ2PFLrSNM5EDMR"
          }
        ]
      },
      formData: {
        errors: []
      },
      response: {
        ipfsHash: null
      }
    };
  },
  computed: {
    ...mapState(["account", "uploadedHashs"])
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
        let ipfsData = this.generateIpfsData();
        let recipient = this.formData.recipient;
        let valueInETH = this.formData.valueInETH;
        let benefactor = this.formData.benefactor;

        let buffer = Buffer.from(JSON.stringify(ipfsData));
        ipfs
          .add(buffer)
          .then(
            function(response) {
              console.log(response);
              this.response.ipfsHash = response[0].hash;
              this.$store.dispatch(actions.BIRTH, {
                recipient,
                tokenURI: response[0].hash,
                ipfsData,
                valueInETH,
                benefactor
              });
            }.bind(this)
          )
          .catch(error => console.error(error));
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
    },
    generateIpfsData: function() {
      return {
        name: _.get(this.formData, "card.name"),
        description: _.get(this.formData, "card.description"),
        image: _.get(this.formData, "card.uri"),
        attributes: {
          message: _.get(this.formData, "message")
        },
        external_uri: "https://radicards.io"
      };
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
