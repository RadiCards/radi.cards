import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Web3 from "web3";
import * as actions from "./actions";
import * as mutations from "./mutation-types";
import createLogger from "vuex/dist/logger";
import moment from "moment";
import { getEtherscanAddress, getNetIdString } from "../utils";
import _ from "lodash";

import truffleContract from "truffle-contract";
import RadiCardsABI from "../../build/contracts/RadiCards.json";

const RadiCards = truffleContract(RadiCardsABI);

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [createLogger()],
  state: {
    web3: null,
    contract: null,
    contractAddress: null,
    account: null,
    accountCards: [],
    currentNetwork: null,
    etherscanBase: null,
    totalSupply: null,
    uploadedHashs: null,
    searchResult: null,
    notFound: null,
    benefactors: null,
    cards: null,
    transfers: []
  },
  getters: {},
  mutations: {
    [mutations.SET_BENEFACTORS](state, benefactors) {
      state.benefactors = benefactors;
    },
    [mutations.SET_ACCOUNT](state, account) {
      state.account = account;
    },
    [mutations.SET_CARDS](state, cards) {
      state.cards = cards;
    },
    [mutations.SET_CURRENT_NETWORK](state, currentNetwork) {
      state.currentNetwork = currentNetwork;
    },
    [mutations.SET_ETHERSCAN_NETWORK](state, etherscanBase) {
      state.etherscanBase = etherscanBase;
    },
    [mutations.SET_WEB3]: async function(state, { web3, contract }) {
      state.web3 = web3;
      state.contract = contract;
      state.contractAddress = (await RadiCards.deployed()).address;
    },
    [mutations.SET_UPLOAD_HASH](state, hash) {
      state.uploadedHashs = hash;
    },
    [mutations.SET_TOTAL_SUPPLY](state, totalSupply) {
      state.totalSupply = totalSupply;
    },
    [mutations.SET_ACCOUNT_CARDS](state, accountCards) {
      state.accountCards = accountCards;
    },
    [mutations.SET_TRANSFER](state, transfer) {
      Vue.set(state, "transfers", state.transfers.concat(transfer));
    }
  },
  actions: {
    [actions.GET_CURRENT_NETWORK]: function({ commit, dispatch, state }) {
      getNetIdString().then(currentNetwork => {
        commit(mutations.SET_CURRENT_NETWORK, currentNetwork);
      });

      getEtherscanAddress().then(etherscanBase => {
        commit(mutations.SET_ETHERSCAN_NETWORK, etherscanBase);
      });
    },
    [actions.INIT_APP]: async function({ commit, dispatch, state }, web3) {
      RadiCards.setProvider(web3.currentProvider);

      //dirty hack for web3@1.0.0 support for localhost testrpc, see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
      if (typeof RadiCards.currentProvider.sendAsync !== "function") {
        RadiCards.currentProvider.sendAsync = function() {
          return RadiCards.currentProvider.send.apply(
            RadiCards.currentProvider,
            arguments
          );
        };
      }

      // Set the web3 instance
      commit(mutations.SET_WEB3, { web3, contract: RadiCards });

      dispatch(actions.GET_CURRENT_NETWORK);

      let accounts = await web3.eth.getAccounts();

      let account = accounts[0];

      const refreshHandler = async () => {
        let updatedAccounts = await web3.eth.getAccounts();
        let contract = await RadiCards.deployed();

        let totalSupply = (await contract.totalSupply()).toString("10");
        commit(mutations.SET_TOTAL_SUPPLY, totalSupply);

        if (updatedAccounts[0] !== account) {
          account = updatedAccounts[0];
          commit(mutations.SET_ACCOUNT, account);
        }
      };

      // Every second check if the main account has changed
      setInterval(refreshHandler, 5000);

      if (account) {
        commit(mutations.SET_ACCOUNT, account);
      }

      // dispatch(actions.WATCH_TRANSFERS);
    },
    [actions.BIRTH]: async function(
      { commit, dispatch, state },
      { ipfsData, tokenURI, recipient, valueInETH, benefactor }
    ) {
      const contract = await state.contract.deployed();

      let { attributes } = ipfsData;
      let { message, name } = attributes;

      console.log(recipient, tokenURI, name, message);

      const { tx } = await contract.gift(recipient, tokenURI, benefactor, {
        from: state.account,
        value: web3.utils.toWei(valueInETH, "ether")
      });

      console.log(tx);

      commit(mutations.SET_UPLOAD_HASH, tx);
    },
    [actions.LOAD_ACCOUNT_CARDS]: async function(
      { commit, dispatch, state },
      { account }
    ) {
      const contract = await state.contract.deployed();
      let tokenIds = await contract.tokensOf(account);

      commit(mutations.SET_ACCOUNT_CARDS, tokenIds);
    },
    [actions.LOAD_BENEFACTORS]: async function({ commit, dispatch, state }) {
      const contract = await state.contract.deployed();
      let benefactorIds = await contract.benefactorsKeys();

      let benefactorsPromises = await _.map(benefactorIds, async id => {
        let results = await contract.benefactors.call(id);
        let result = mapBenefactorDetails(results, id);
        return result;
      });
      const benefactors = await Promise.all(benefactorsPromises);

      console.log(benefactors);
      commit(mutations.SET_BENEFACTORS, benefactors);
    },
    [actions.LOAD_CARDS]: async function({ commit, dispatch, state }) {
      const contract = await state.contract.deployed();
      let cardIds = await contract.cardsKeys();
      let ipfsPrefix = await contract.tokenBaseURI();

      let cardPromises = await _.map(cardIds, async id => {
        let results = await contract.cards.call(id);
        let result = mapTokenDetails(results, ipfsPrefix, id);
        return result;
      });
      const cards = await Promise.all(cardPromises);

      commit(mutations.SET_CARDS, cards);
    },
    [actions.WATCH_TRANSFERS]: async function({ commit, dispatch, state }) {
      const contract = await state.contract.deployed();

      let transferEvent = contract.Transfer(
        {},
        {
          fromBlock: 0,
          toBlock: "latest" // wait until event comes through
        }
      );

      transferEvent.watch(function(error, anEvent) {
        if (!error) {
          console.log(`Transfer event`, anEvent);
          commit(mutations.SET_TRANSFER, anEvent);
        } else {
          console.log("Failure", error);
          transferEvent.stopWatching();
        }
      });
    }
  }
});

async function mapTokenDetails(results, ipfsPrefix, id) {
  var dataResp = (await axios.get(ipfsPrefix + results[0])).data;
  return dataResp;
}

function mapBenefactorDetails(results, id) {
  let data = {
    address: results[0],
    name: results[1],
    website: results[2],
    id: id
  };
  return data;
}

export default store;
