import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Web3 from "web3";
import {
  Wallet,
  providers,
  Contract,
  utils
} from "ethers";

import * as actions from "./actions";
import * as mutations from "./mutation-types";
import createLogger from "vuex/dist/logger";
import moment from "moment";
import {
  getEtherscanAddress,
  getNetIdString,
  getDaiContractAddress
} from "../utils";
import _ from "lodash";

import truffleContract from "truffle-contract";
import RadiCardsABI from "../../build/contracts/RadiCards.json";
import DaiERC20ABI from "../../build/contracts/ERC20.json"

const RadiCards = truffleContract(RadiCardsABI);
const DaiErc20 = truffleContract(DaiERC20ABI);

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
    uploadedHash: null,
    searchResult: null,
    notFound: null,
    benefactors: null,
    cards: null,
    deepUrlCardNumber: null,
    deepUrlCard: null,
    transfers: [],
    giftingStatus: {},
    transferStatus: "EMPTY",
    totalSupply: null,
    usdPrice: 0,
    donatedInEth: 0,
    donatedInDai: 0,
    giftedInEth: 0,
    giftedInDai: 0,
    ephemeralAddressFee: 0,
    ethBalance: 0,
    daiContractAddress: null,
    daiBalance: 0,
    daiAllowance: 0,
    ephemeralPrivateKey: null
  },
  getters: {
    getGiftingStatus: state => (from, cardIndex) => {
      return state.giftingStatus[`${from}_${cardIndex}`] || {};
    },
    getTransferStatus: state => () => {
      console.log(state.transferStatus);
      return state.transferStatus || "";
    }
  },
  mutations: {
    [mutations.SET_BENEFACTORS](state, benefactors) {
      state.benefactors = benefactors;
    },
    [mutations.SET_DEEP_URL_CARD](state, card) {
      state.deepUrlCard = card;
    },
    [mutations.SET_DEEP_URL_CARD_NUMBER](state, cardNo) {
      state.deepUrlCardNumber = cardNo;
    },
    [mutations.SET_ACCOUNT](state, account) {
      state.account = account;
    },
    [mutations.SET_CARDS](state, cards) {
      state.cards = cards;
    },
    [mutations.SET_USD_PRICE](state, price) {
      console.log(price);
      console.log(state);
      state.usdPrice = price;
    },
    [mutations.SET_CURRENT_NETWORK](state, currentNetwork) {
      state.currentNetwork = currentNetwork;
    },
    [mutations.SET_ETHERSCAN_NETWORK](state, etherscanBase) {
      state.etherscanBase = etherscanBase;
    },
    [mutations.SET_WEB3]: async function (state, {
      web3,
      contract
    }) {
      state.web3 = web3;
      state.contract = contract;
      state.contractAddress = (await RadiCards.deployed()).address;
    },
    [mutations.SET_UPLOAD_HASH](state, hash) {
      state.uploadedHash = hash;
    },
    [mutations.SET_TOTAL_SUPPLY](state, totalSupply) {
      state.totalSupply = totalSupply;
    },
    [mutations.SET_TOTAL_DONATED_IN_ETH](state, totalDonatedInEth) {
      state.donatedInEth = totalDonatedInEth;
    },
    [mutations.SET_TOTAL_DONATED_IN_DAI](state, totalDonatedInDai) {
      state.donatedInDai = totalDonatedInDai;
    },
    [mutations.SET_TOTAL_GIFTED_IN_ETH](state, totalGiftedInEth) {
      state.giftedInEth = totalGiftedInEth;
    },
    [mutations.SET_TOTAL_GIFTED_IN_DAI](state, totalGiftedInDai) {
      state.giftedInDai = totalGiftedInDai;
    },
    [mutations.SET_EPHEMERAL_ADDRESS_FEE](state, ephemeralAddressFee) {
      state.ephemeralAddressFee = ephemeralAddressFee;
    },
    [mutations.SET_ACCOUNT_CARDS](state, accountCards) {
      state.accountCards = accountCards;
    },
    [mutations.PUSH_ACCOUNT_CARD](state, accountCard) {
      state.accountCards.push(accountCard);
    },
    [mutations.SET_DAI_CONTRACT_ADDRESS](state, daiContractAddress) {
      state.daiContractAddress = daiContractAddress;
    },
    [mutations.SET_ACCOUNT_ETH_BALANCE](state, ethBalance) {
      state.ethBalance = ethBalance;
    },
    [mutations.SET_ACCOUNT_DAI_BALANCE](state, daiBalance) {
      state.daiBalance = daiBalance;
    },
    [mutations.SET_ACCOUNT_DAI_ALLOWANCE](state, daiAllowance) {
      state.daiAllowance = daiAllowance;
    },
    [mutations.SET_TRANSFER](state, transfer) {
      Vue.set(state, "transfers", state.transfers.concat(transfer));
    },
    [mutations.SET_TRANSFER_STATUS](state, data) {
      state.transferStatus = data.status;
    },
    [mutations.SET_EPHEMERAL_PRIVATE_KEY](state, ephemeralPrivateKey) {
      state.ephemeralPrivateKey = ephemeralPrivateKey;
    },
    [mutations.CLEAR_TRANSFER_STATUS](state) {
      Vue.set(state, `transferStatus`, "");
    },
    [mutations.SET_GIFT_STATUS](state, data) {
      const {
        cardIndex,
        from
      } = data;
      var arrayIndex = `${state.web3.utils.toChecksumAddress(from)}_${cardIndex}`;
      const newState = {
        ...state.giftingStatus[arrayIndex],
        ...data
      };
      Vue.set(
        state.giftingStatus,
        `${state.web3.utils.toChecksumAddress(from)}_${cardIndex}`,
        newState
      );
    },
    [mutations.CLEAR_GIFT_STATUS](state) {
      Vue.set(state, `giftingStatus`, {});
    },
  },
  actions: {
    [actions.GET_CURRENT_NETWORK]: function ({
      commit,
      dispatch,
      state
    }) {
      getNetIdString().then(currentNetwork => {
        commit(mutations.SET_CURRENT_NETWORK, currentNetwork);
      });

      getEtherscanAddress().then(etherscanBase => {
        commit(mutations.SET_ETHERSCAN_NETWORK, etherscanBase);
      });

      getDaiContractAddress().then(daiContractAddress => {
        commit(mutations.SET_DAI_CONTRACT_ADDRESS, daiContractAddress);
      });
    },
    [actions.INIT_APP]: async function ({
      commit,
      dispatch,
      state
    }, web3) {
      RadiCards.setProvider(web3.currentProvider);
      DaiErc20.setProvider(web3.currentProvider);

      //dirty hack for web3@1.0.0 support for localhost testrpc, see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
      if (typeof RadiCards.currentProvider.sendAsync !== "function") {
        RadiCards.currentProvider.sendAsync = function () {
          return RadiCards.currentProvider.send.apply(
            RadiCards.currentProvider,
            arguments
          );
        };
      }

      // Set the web3 instance
      commit(mutations.SET_WEB3, {
        web3,
        contract: RadiCards
      });

      dispatch(actions.GET_CURRENT_NETWORK);

      let accounts = await web3.eth.getAccounts();

      let account = accounts[0];

      const refreshHandler = async () => {
        let updatedAccounts = await web3.eth.getAccounts();

        if (updatedAccounts[0] !== account) {
          account = updatedAccounts[0];
          commit(mutations.SET_ACCOUNT, account);
        }

        let ethBalance = web3.utils.fromWei((await web3.eth.getBalance(account)), 'ether');
        if (state.ethBalance !== ethBalance) {
          commit(mutations.SET_ACCOUNT_ETH_BALANCE, ethBalance);
        }
        let contract = await RadiCards.deployed();
        let daiContract = await DaiErc20.at(state.daiContractAddress);

        let daiBalance = web3.utils.fromWei((await daiContract.balanceOf(state.account)).toString("10"), 'ether');
        if (state.daiBalance !== daiBalance) {
          commit(mutations.SET_ACCOUNT_DAI_BALANCE, daiBalance);
        }

        let daiAllowance = web3.utils.fromWei((await daiContract.allowance(state.account, contract.address)).toString("10"), 'ether');
        if (state.daiAllowance !== daiAllowance) {
          commit(mutations.SET_ACCOUNT_DAI_ALLOWANCE, daiAllowance);
        }

        let totalSupply = (await contract.totalSupply()).toString("10");
        if (state.totalSupply !== totalSupply) {
          commit(mutations.SET_TOTAL_SUPPLY, totalSupply);
        }

        let currentEthPriceInUSD = web3.utils.fromWei((await contract.getEtherPrice()).toString("10"), 'ether');
        if (state.usdPrice !== currentEthPriceInUSD) {
          commit(mutations.SET_USD_PRICE, currentEthPriceInUSD);
        }

        let totalGiftedInEth = web3.utils.fromWei((await contract.totalGiftedInWei()).toString("10"), 'ether');
        if (state.giftedInEth !== totalGiftedInEth) {
          commit(mutations.SET_TOTAL_GIFTED_IN_ETH, totalGiftedInEth)
        }

        let totalDonatedInEth = web3.utils.fromWei((await contract.totalDonatedInWei()).toString("10"), 'ether');
        if (state.donatedInEth !== totalDonatedInEth) {
          commit(mutations.SET_TOTAL_DONATED_IN_ETH, totalDonatedInEth)
        }
        let totalGiftedInDai = web3.utils.fromWei((await contract.totalGiftedInAtto()).toString("10"), 'ether');

        if (state.giftedInDai !== totalGiftedInDai) {
          commit(mutations.SET_TOTAL_GIFTED_IN_DAI, totalGiftedInDai)
        }

        let totalDonatedInDai = web3.utils.fromWei((await contract.totalDonatedInAtto()).toString("10"), 'ether');
        if (state.donatedInDai !== totalDonatedInDai) {
          commit(mutations.SET_TOTAL_DONATED_IN_DAI, totalDonatedInDai)
        }

        let ephemeralAddressFee = web3.utils.fromWei((await contract.EPHEMERAL_ADDRESS_FEE()).toString("10"), 'ether');
        if (state.ephemeralAddressFee !== ephemeralAddressFee) {
          commit(mutations.SET_EPHEMERAL_ADDRESS_FEE, ephemeralAddressFee)
        }
      };

      // Every second check if the main account has changed
      setInterval(refreshHandler, 5000);

      if (account) {
        commit(mutations.SET_ACCOUNT, account);
      }
    },

    [actions.RESET_GIFT_STATUS]: async function ({
      commit,
      dispatch,
      state
    }) {
      commit(mutations.SET_GIFT_STATUS, {});
    },

    async [actions.MINT_CARD]({
      commit,
      dispatch,
      state
    }, {
      currency,
      recipient,
      benefactorIndex,
      cardIndex,
      message,
      donationAmount,
      giftAmount,
      claimableLink,
      transactionValue
    }) {
      console.log(
        currency,
        recipient,
        benefactorIndex,
        cardIndex,
        message,
        donationAmount,
        giftAmount,
        claimableLink,
        transactionValue
      )

      console.log("store mint dispatch")

      const contract = await state.contract.deployed();
      const daiContract = await DaiErc20.at(state.daiContractAddress);
      commit(mutations.CLEAR_GIFT_STATUS);

      commit(mutations.SET_GIFT_STATUS, {
        status: "TRIGGERED",
        from: state.account,
        cardIndex: cardIndex
      });

      if (claimableLink) {
        let ephemeralAccount = web3.eth.accounts.create();
        console.log("generating ephemeralAccount")
        console.log(ephemeralAccount);
        recipient = ephemeralAccount.address;
        commit(mutations.SET_EPHEMERAL_PRIVATE_KEY, ephemeralAccount.privateKey)
      }

      // if the donation is in dai we must check that they have a sufficient approved allowance to gift the card
      if (currency === "DAI" && (donationAmount + giftAmount) > state.daiAllowance) {
        console.log("Insufficient allowance. requesting increase")
        let requiredApproval = parseFloat(donationAmount) + parseFloat(giftAmount) + parseFloat(state.daiAllowance)
        let requiredApprovalAtto = web3.utils.toWei(requiredApproval.toString(), "ether")
        let approvalTransaction = await daiContract.approve(contract.address, requiredApprovalAtto, {
          from: state.account,
          value: 0
        })
      }
      //submit the tx. using sendTransaction as this returns a tx hash as soon as the tx is submitted.
      // if rejected, catch in fail
      try {
        let transaction
        switch (currency) {
          case "ETH":
            transaction = await contract.gift.sendTransaction(
              recipient,
              benefactorIndex,
              cardIndex,
              message,
              state.web3.utils.toWei(donationAmount, "ether"),
              state.web3.utils.toWei(giftAmount, "ether"),
              claimableLink, {
                from: state.account,
                value: state.web3.utils.toWei(transactionValue, "ether")
              }
            );
            break;
          case "DAI":
            transaction = await contract.giftInDai.sendTransaction(
              recipient,
              benefactorIndex,
              cardIndex,
              message,
              state.web3.utils.toWei(donationAmount, "ether"),
              state.web3.utils.toWei(giftAmount, "ether"),
              claimableLink, {
                from: state.account,
                value: state.web3.utils.toWei(transactionValue, "ether")
              }
            );
            break;
        }
        console.log("transaction submitted");
        commit(mutations.SET_GIFT_STATUS, {
          status: "SUBMITTED",
          from: state.account,
          cardIndex: cardIndex,
          tx: transaction
        });
      } catch (e) {
        console.log("rejection/error");
        console.log(e)
        commit(mutations.SET_GIFT_STATUS, {
          status: "FAILURE",
          from: state.account,
          cardIndex: cardIndex
        });
      }
      //if the link was set to claimable then we need to listen for the contract address
      //receiving the card
      if (claimableLink) {
        recipient = contract.address
      }

      const blockNumber = await state.web3.eth.getBlockNumber();
      console.log("bn")
      console.log(blockNumber)
      // Watch for the transfer event from ZERO address to the recipient immediately after
      const transferEvent = await contract.CardGifted({
        _to: recipient,
        _cardIndex: cardIndex
      }, {
        fromBlock: blockNumber,
        toBlock: "latest" // wait until event comes through
      });
      console.log(transferEvent)

      transferEvent.watch(function (error, event) {
        if (!error) {
          console.log("Transfer event found", event);
          const {
            args
          } = event;
          const {
            _from,
            _to,
            _tokenId
          } = args;
          commit(mutations.SET_GIFT_STATUS, {
            status: "SUCCESS",
            from: state.account,
            cardIndex: cardIndex,
            tokenId: _tokenId
          });

          dispatch(actions.LOAD_ACCOUNT_CARDS, {
            account: state.account
          });
        } else {
          console.log("failure", error);
          commit(mutations.SET_GIFT_STATUS, {
            status: "FAILURE",
            from: state.account,
            cardIndex: cardIndex
          });
          transferEvent.stopWatching();
        }
      });
    },
    [actions.TRANSFER_CARD]: async function ({
      commit,
      dispatch,
      state
    }, {
      recipient,
      tokenId
    }) {
      const contract = await state.contract.deployed();
      commit(mutations.CLEAR_TRANSFER_STATUS);
      const blockNumber = await state.web3.eth.getBlockNumber();

      console.log(recipient);
      console.log("transfering card...", recipient, tokenId);
      const transaction = contract.safeTransferFrom(
        state.account,
        recipient,
        tokenId, {
          from: state.account
        }
      );

      const transferEvent = contract.Transfer({
        _from: state.account,
        _to: recipient
      }, {
        fromBlock: blockNumber,
        toBlock: "latest" // wait until event comes through
      });

      transferEvent.watch(function (error, event) {
        if (!error) {
          console.log("Transfer event found", event);
          const {
            args
          } = event;
          commit(mutations.SET_TRANSFER_STATUS, {
            status: "SUCCESS"
          });

          dispatch(actions.LOAD_ACCOUNT_CARDS, {
            account: state.account
          });
        } else {
          console.log("failure", error);
          commit(mutations.SET_TRANSFER_STATUS, {
            status: "FAILURE"
          });
          transferEvent.stopWatching();
        }
      });
    },

    [actions.RESET_TRANSFER_STATUS]: async function ({
      commit,
      dispatch,
      state
    }) {
      commit(mutations.SET_TRANSFER_STATUS, {});
    },
    [actions.GET_USD_PRICE]: async function ({
      commit
    }) {
      axios
        .get("https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=USD")
        .then(
          response => {
            let currentPriceInUSD = response.data[0].price_usd;
            console.log(response.data);
            commit(mutations.SET_USD_PRICE, currentPriceInUSD);
          },
          response => {
            console.error(response);
          }
        );
    },
    [actions.RESET_TRANSFER_STATUS]: async function ({
      commit,
      dispatch,
      state
    }) {
      commit(mutations.SET_TRANSFER_STATUS, {});
    },

    [actions.LOAD_ACCOUNT_CARDS]: async function ({
      commit,
      dispatch,
      state
    }, {
      account
    }) {
      const contract = await state.contract.deployed();
      let tokenIds = await contract.tokensOf(account);
      const tokenDetails = tokenIds.map(id => contract.tokenDetails(id));
      let tokenDetailsArray = await Promise.all(tokenDetails);
      let tokenDetailsArrayProcessed = [];
      let loopIndex = 0;
      tokenDetailsArray.forEach(function (accountToken) {
        let gifter = accountToken[0];
        let message = accountToken[1];
        let daiDonation = accountToken[2];
        let giftAmount = accountToken[3].toNumber();
        let donationAmount = accountToken[4].toNumber();
        let status = accountToken[5].toNumber();
        let cardIndex = accountToken[6];
        let benefactorIndex = accountToken[7].toNumber();
        let tokenId = tokenIds[loopIndex].toNumber();
        let statuses = ["Empty", "Deposited", "Claimed", "Cancelled"]
        let decodedStatus = statuses[status]
        if (state.cards) {
          let cardInformation = state.cards.filter(card => {
            return card.cardIndex === cardIndex.toNumber();
          });
          let accountCreatedCard =
            web3.utils.toChecksumAddress(account) ===
            web3.utils.toChecksumAddress(gifter); //if the current account created the card
          let allCardInformation = {
            ...{
              gifter: gifter,
              message: message,
              daiDonation: daiDonation,
              giftAmount: giftAmount / 1000000000000000000,
              donationAmount: donationAmount / 1000000000000000000,
              status: decodedStatus,
              cardInded: cardIndex,
              BenefactorIndex: benefactorIndex,
              accountCreatedCard: accountCreatedCard,
              tokenId: tokenId
            },
            ...cardInformation[0]
          };
          tokenDetailsArrayProcessed.push(allCardInformation);
        }
        loopIndex++;
      });
      commit(mutations.SET_ACCOUNT_CARDS, tokenDetailsArrayProcessed);
    },
    [actions.LOAD_DEEP_URL_CARD]: async function ({
      commit,
      dispatch,
      state
    }, {
      tokenId
    }) {
      if (state.deepUrlCardNumber === null) {
        commit(mutations.SET_DEEP_URL_CARD_NUMBER, tokenId);
      }
      if (state.contract) {
        const contract = await state.contract.deployed();
        let accountToken = await contract.tokenDetails(tokenId);
        let gifter = accountToken[0];
        let message = accountToken[1];
        let daiDonation = accountToken[2];
        let giftAmount = accountToken[3].toNumber();
        let donationAmount = accountToken[4].toNumber();
        let status = accountToken[5].toNumber();
        let cardIndex = accountToken[6];
        let benefactorIndex = accountToken[7].toNumber();
        let statuses = ["Empty", "Deposited", "Claimed", "Cancelled"]
        let decodedStatus = statuses[status]
        if (state.cards) {
          let cardInformation = state.cards.filter(card => {
            return card.cardIndex === cardIndex.toNumber();
          });
          let accountCreatedCard =
            web3.utils.toChecksumAddress(state.account) ===
            web3.utils.toChecksumAddress(gifter); //if the current account created the card

          let allCardInformation = {
            ...{
              gifter: gifter,
              message: message,
              daiDonation: daiDonation,
              giftAmount: giftAmount / 1000000000000000000,
              donationAmount: donationAmount / 1000000000000000000,
              status: decodedStatus,
              cardInded: cardIndex,
              BenefactorIndex: benefactorIndex,
              accountCreatedCard: accountCreatedCard,
              tokenId: tokenId
            },
            ...cardInformation[0]
          };
          commit(mutations.SET_DEEP_URL_CARD, allCardInformation);
          if (this.state.ephemeralPrivateKey) {
            dispatch(actions.CLAIM_GIFT, {
              privateKey: this.state.ephemeralPrivateKey
            });
          }
        }
      }

    },
    [actions.LOAD_BENEFACTORS]: async function ({
      commit,
      dispatch,
      state
    }) {
      const contract = await state.contract.deployed();
      let benefactorIds = await contract.benefactorsKeys();

      let benefactorsPromises = await _.map(benefactorIds, async id => {
        let results = await contract.benefactors.call(id);
        let result = mapBenefactorDetails(results, id);
        return result;
      });
      const benefactors = await Promise.all(benefactorsPromises);
      commit(mutations.SET_BENEFACTORS, benefactors);
    },
    [actions.LOAD_CARDS]: async function ({
      commit,
      dispatch,
      state
    }) {
      if (state.contract) {
        const contract = await state.contract.deployed();
        let cardIds = await contract.cardsKeys();
        let ipfsPrefix = await contract.tokenBaseURI();

        let cardPromises = await _.map(cardIds, async id => {
          let results = await contract.cards.call(id);
          let result = mapTokenDetails(results, ipfsPrefix, id);
          return result;
        });
        let cards = await Promise.all(cardPromises);
        cards.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

        commit(mutations.SET_CARDS, cards);
        if (this.state.account) {
          dispatch(actions.LOAD_ACCOUNT_CARDS, {
            account: this.state.account
          });
        }
        if (this.state.deepUrlCardNumber) {
          dispatch(actions.LOAD_DEEP_URL_CARD, {
            tokenId: this.state.deepUrlCardNumber
          });
        }
        if (this.state.ephemeralPrivateKey) {
          dispatch(actions.CLAIM_GIFT, {
            privateKey: this.state.ephemeralPrivateKey
          });
        }
      }
    },
    [actions.CLAIM_GIFT]: async function ({
      commit,
      dispatch,
      state,
      scope
    }, {
      privateKey
    }) {
      if (state.ephemeralPrivateKey === null) {
        commit(mutations.SET_EPHEMERAL_PRIVATE_KEY, privateKey);
        commit(mutations.SET_TRANSFER_STATUS, {
          status: "TRIGGERED"
        });
      } else {
        //load the ephemeral wallet from the private key using ethers.js
        const contract = await state.contract.deployed();
        let networkId = await window.web3.eth.net.getId()
        let providerAddress;
        switch (networkId) {
          case 1:
            providerAddress = "https://mainnet.infura.io"
            break;
          case 42:
            providerAddress = "https://kovan.infura.io"
            break;
        }
        const provider = new providers.JsonRpcProvider(providerAddress);
        const transitWallet = new Wallet(privateKey, provider);

        let ethersContract = new Contract(RadiCardsABI['networks'][networkId]["address"], RadiCardsABI['abi'], provider);
        let contractWithSigner = ethersContract.connect(transitWallet);

        // next we grab the card index to check it hasent been claimed before
        let tokenId = await contract.ephemeralWalletCards(transitWallet.address)
        console.log("inded")
        console.log(tokenId.toString())
        if (!state.deepUrlCard) {
          dispatch(actions.LOAD_DEEP_URL_CARD, {
            tokenId: tokenId
          });
        }
        // wait until the deep url for the claimable card has been loaded
        if (state.deepUrlCard) {
          if (state.deepUrlCard.status === 'Claimed') {
            commit(mutations.SET_TRANSFER_STATUS, {
              status: "CLAIMED"
            });
          }
          // only if the card is in the deposited state and there is an unlocked account do we preform the claim transaction
          if (state.deepUrlCard.status === 'Deposited' && state.account != null) {
            const tx = await contractWithSigner.claimGift(state.account);
            commit(mutations.SET_TRANSFER_STATUS, {
              status: "SUBMITTED",

            });
            console.log("CLAIMING")
            ethersContract.on("LogClaimGift", (ephemeralAddress, sender, tokenId, receiver, giftAmount, daiDonation, event) => {
              console.log("ANYTHING IN THIS")
              console.log(ephemeralAddress);
              if (transitWallet.address === ephemeralAddress) {
                commit(mutations.SET_TRANSFER_STATUS, {
                  status: "TRANSFERRED",
                });
                //  once transferred need to reload the account cards
                commit(mutations.PUSH_ACCOUNT_CARD, state.deepUrlCard)
              }
            });
          }
        }
      }
    },
  }
});
async function mapTokenDetails(results, ipfsPrefix, id) {
  var dataResp = (await axios.get(ipfsPrefix + results[0])).data;
  dataResp.cardIndex = id.toNumber();
  dataResp.cardActive = results[1];
  dataResp.cardMinted = results[2].toNumber();
  dataResp.cardMaxQnty = results[3].toNumber();
  dataResp.cardMinPrice = web3.utils.fromWei(results[4].toString("10"), 'ether');
  return dataResp;
}

function mapBenefactorDetails(results, id) {
  console.log(results);
  let data = {
    address: results[0],
    name: results[1],
    website: results[2],
    image: results[3],
    id: id.toNumber()
  };
  return data;
}

export default store;
