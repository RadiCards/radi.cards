const {
  assertRevert
} = require("../helpers/assertRevert");
const {
  sendTransaction
} = require("../helpers/sendTransaction");
const etherToWei = require("../helpers/etherToWei");

const advanceBlock = require("../helpers/advanceToBlock");

const _ = require("lodash");

const BigNumber = web3.BigNumber;
const RadiCards = artifacts.require("RadiCards");
const DaiContract = artifacts.require("ERC20Mock.sol");
const MedianizerContract = artifacts.require("MedianizerMock.sol")

require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();

contract("RadiCards ERC721 Custom", function (accounts) {
  const owner = accounts[0];
  const account1 = accounts[1];
  const account2 = accounts[2];
  //create a new blank account with no ether in it. this represents the ephemeral claimable wallet
  let ephemeralAddress = web3.personal.newAccount()

  const firstTokenId = 0;
  const secondTokenId = 1;
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  const benefactorEFF = 1;
  const benefactorFPF = 2;

  const cardOne = 1;
  const cardTwo = 2;
  const cardThree = 3;

  // The dai ERC20 token uses the same number of basis SI units (1*10-18) as Ether
  // with the Atto representing 1*10-18 dai.
  // This means we can use the etherToWei helper to get full units of dai.
  // etherToWei(1) = 10^18 Atto = 1 dai = 1 usd
  const oneUSDInAtto = etherToWei(1); //
  // The price per ether is hardcoded to 130 in the MediaizerMock contract.
  // Thus if we take the number of wei in 1 ether (etherToWei(1)) divided
  // by the price per ether we get the number of wei in one usd of ether.
  const oneUSDInWei = etherToWei(1).dividedToIntegerBy(130);

  const ephemeralAddressFee = etherToWei(0.01)

  const message = "Happy Xmas";

  const cardOneUri = "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy";

  const name = "RadiCards";
  const symbol = "RADI";

  const TOKEN_URI = "123abcHash";
  const BASE_URI = "https://ipfs.infura.io/ipfs/";

  before(async function () {
    await advanceBlock();
  });

  beforeEach(async function () {
    // First, deploy the radicards contract
    this.token = await RadiCards.new({
      from: owner
    });

    // Next, add benefactors
    await this.token.addBenefactor(
      1,
      "0xb189f76323678E094D4996d182A792E52369c005",
      "Electronic Frontier Foundation",
      "https://www.eff.org/pages/ethereum-and-litecoin-donations",
      "https://ipfs.infura.io/ipfs/QmY9ECy55kWevPJQ2RDYJxDmB16h5J8SfhEyuEUAUnAyGU"
    );

    await this.token.addBenefactor(
      2,
      "0x904f56d3c5D0C622f7f27D374ED7A07c5dEe887D",
      "EnLAW Foundation",
      "https://enlawfoundation.org",
      "https://ipfs.infura.io/ipfs/QmaQkbvPMxVyNto6JBqqK7YPN9Lk3kgjTqcXYbNS7jCLfS"
    );

    // Next, add one basic card with no max mint and a min price of oneUSDInAtto.
    await this.token.addCard(
      cardOne, //cardIndex
      "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy", //tokenURI
      true, //active state of card
      0, //max quantity that can be minted (0 indicates no limit)
      oneUSDInAtto, //minimum price per card (0 indicates no min)
      {
        from: owner
      }
    );

    // Next, Create the sample ERC20 contract to represent dai functionality,
    // and approve the contract to transfer tokens on the user's behalf.
    // This would be done in by the UI right before the gift function is called.
    this.daiContract = await DaiContract.new(account1, etherToWei(100), {
      from: owner
    });

    await this.daiContract.approve(this.token.address, etherToWei(50), {
      from: account1
    });
    // Set the dai contract address in the radicards contract.
    await this.token.setDaiContractAddress(this.daiContract.address, {
      from: owner
    });

    // last step is to create an instance of the Medianizer contract. this acts as a price oracle
    // for the radicards contract to define the minimum price of cards in dai (USD). This is the makerdao
    // implementation interface used in production, modified to return a fixed 130 usd/eth when the read() function is called.
    this.medianizerContract = await MedianizerContract.new({
      from: owner
    })

    await this.token.setMedianizerContractAddress(this.medianizerContract.address, {
      from: owner
    })
  });


  describe("custom radi.cards logic", function () {
    beforeEach(async function () {
      //create one card where half of the funds go the the charity and half go to the recipient
      await this.token.gift(
        account2, //recipient
        benefactorEFF, //charity
        cardOne, //card index
        message,
        oneUSDInWei, // value intended for the charity
        oneUSDInWei, // value intended for the recipient
        false, {
          from: account1,
          value: oneUSDInWei * 2 // total ether sent with tx (msg.value==charity+recipient)
        }
      );
    });

    context("should have two benefactors initially", function () {
      it("returns indexes", async function () {
        const indexes = await this.token.benefactorsKeys();
        indexes.length.should.be.bignumber.equal(2);
      });
    });

    context("should have one cards initially", function () {
      it("returns indexes", async function () {
        const indexes = await this.token.cardsKeys();
        indexes.length.should.be.bignumber.equal(1);
      });
    });

    context("should set data", function () {
      it("returns message and data", async function () {
        const [
          _gifter,
          _message,
          _daiDonation,
          _giftingAmount,
          _donatingAmount,
          _status,
          _cardIndex,
          _benefactorIndex
        ] = await this.token.tokenDetails(firstTokenId);
        _gifter.should.be.equal(account1);
        _message.should.be.equal(message);
        _daiDonation.should.be.equal(false);
        _giftingAmount.should.be.bignumber.equal(oneUSDInWei);
        _donatingAmount.should.be.bignumber.equal(oneUSDInWei);
        //the status enum for claimed (as this card created was set without a claimable link, this is claimed by default)
        _status.should.be.bignumber.equal(2);
        _cardIndex.should.be.bignumber.equal(cardOne);
        _benefactorIndex.should.be.bignumber.equal(benefactorEFF);
      });

      it("returns token URI", async function () {
        const uri = await this.token.tokenURI(firstTokenId);
        uri.should.be.equal(BASE_URI + cardOneUri);
      });
    });

    context("valid gift", function () {
      it("can send minimum contribution (ETH)", async function () {
        await this.token.gift(
          account2,
          benefactorEFF,
          cardOne,
          message,
          oneUSDInWei / 2,
          oneUSDInWei / 2,
          false, {
            from: account1,
            value: oneUSDInWei
          }
        );
      });
      it("can send minimum contribution (DAI)", async function () {
        // we have already approved the contract to transact ERC20 dai tokens on our behalf
        // (note that this is done for account1 aproving the this.token contract)
        await this.token.giftInDai(
          account2,
          benefactorEFF,
          cardOne,
          message,
          oneUSDInAtto / 2,
          oneUSDInAtto / 2,
          false, {
            from: account1,
            value: 0
          }
        );
      });
    });

    context("should allow whitelisted to change min price for a card", function () {
      it("reverts if not whitelisted", async function () {
        await assertRevert(
          this.token.setMinPrice(cardOne, oneUSDInAtto * 2, {
            from: account1
          })
        );
      });

      it("can set minimum contribution", async function () {
        await this.token.setMinPrice(cardOne, oneUSDInAtto * 2, {
          from: owner
        });
        let card = await this.token.cards(cardOne, {
          from: owner
        });
        const newMin = card[4]
        newMin.should.be.bignumber.equal(oneUSDInAtto * 2);
      });
    });

    context("should allow card to be set to active and inactive", function () {
      it("reverts if not whitelisted", async function () {
        await assertRevert(
          this.token.setActive(cardOne, true, {
            from: account1
          })
        );
      });

      it("reverts if no card", async function () {
        await assertRevert(
          this.token.setActive(999, true, {
            from: owner
          })
        );
      });

      it("can deactivate card", async function () {
        let card = await this.token.cards(cardOne, {
          from: owner
        });
        card[1].should.be.equal(true);

        await this.token.setActive(cardOne, false, {
          from: owner
        });
        card = await this.token.cards(cardOne, {
          from: owner
        });
        card[1].should.be.equal(false);
      });
    });

    context(
      "should allow change of max quantity of each card after creation",
      function () {
        it("reverts if not whitelisted", async function () {
          await assertRevert(
            this.token.setMaxQuantity(cardOne, 10, {
              from: account1
            })
          );
        });

        it("reverts if no card", async function () {
          await assertRevert(
            this.token.setMaxQuantity(999, 10, {
              from: owner
            })
          );
        });

        it("can change max quantity", async function () {
          let card = await this.token.cards(cardOne);
          card[3].should.be.bignumber.equal(0);

          await this.token.setMaxQuantity(cardOne, 100, {
            from: owner
          });
          card = await this.token.cards(cardOne);
          card[3].should.be.bignumber.equal(100);
        });
      }
    );

    context(
      "should allow change of min price of each card after creation",
      function () {
        it("reverts if not whitelisted", async function () {
          await assertRevert(
            this.token.setMinPrice(cardOne, oneUSDInAtto * 5, {
              from: account1
            })
          );
        });

        it("reverts if no card", async function () {
          await assertRevert(
            this.token.setMinPrice(999, oneUSDInAtto * 5, {
              from: owner
            })
          );
        });

        it("can change min price", async function () {
          let card = await this.token.cards(cardOne);
          card[4].should.be.bignumber.equal(oneUSDInAtto);

          await this.token.setMinPrice(cardOne, oneUSDInAtto * 10);
          card = await this.token.cards(cardOne);
          card[4].should.be.bignumber.equal(oneUSDInAtto * 10);
        });
      }
    );

    context(
      "should correctly split funds sent between recipient and charity",
      function () {
        it("can send minimum contribution split between user and charity (ETH)", async function () {
          let benefactor = await this.token.benefactors(benefactorEFF);
          let benefactorAddress = benefactor[0];
          let benefactorBalanceBefore = await web3.eth.getBalance(
            benefactorAddress
          );

          let recipientBalanceBefore = await web3.eth.getBalance(account2);
          //set the donation amount to the msg.value. In this case all funds should go to the charity
          //and the balance of the benefactor should be the the sum of the balance before and the new
          //donation amount.
          await this.token.gift(
            account2,
            benefactorEFF,
            cardOne,
            message,
            oneUSDInWei,
            oneUSDInWei,
            false, {
              from: account1,
              value: oneUSDInWei * 2
            }
          );

          let benefactorBalanceAfter = await web3.eth.getBalance(
            benefactorAddress
          );
          benefactorBalanceAfter.should.be.bignumber.equal(
            benefactorBalanceBefore.add(oneUSDInWei)
          );

          let recipientBalanceAfter = await web3.eth.getBalance(account2);
          recipientBalanceAfter.should.be.bignumber.equal(
            recipientBalanceBefore.add(oneUSDInWei)
          );
        });
        it("can send minimum contribution split between user and charity (DAI)", async function () {
          // Store the account balances of the benefactor and recipient
          // to check each got the correct values from the card creation
          let benefactor = await this.token.benefactors(benefactorEFF);
          let benefactorAddress = benefactor[0];
          let benefactorBalanceBefore = await this.daiContract.balanceOf(
            benefactorAddress
          );
          let recipientBalanceBefore = await this.daiContract.balanceOf(
            account2
          );

          // we have already approved the contract to transact ERC20 dai tokens on our behalf
          // (note that this is done for account1 aproving the this.token contract)
          let value = await this.token.giftInDai(
            account2,
            benefactorEFF,
            cardOne,
            message,
            oneUSDInAtto / 2,
            oneUSDInAtto / 2,
            false, {
              from: account1,
              value: 0
            }
          );

          // Grab the balances of the benefactor and the recipient and check that they match up
          // with the amount of dai sent to them
          let benefactorBalanceAfter = await this.daiContract.balanceOf(
            benefactorAddress
          );
          let recipientBalanceAfter = await this.daiContract.balanceOf(
            account2
          );

          benefactorBalanceAfter.should.be.bignumber.equal(
            benefactorBalanceBefore.plus(oneUSDInAtto / 2)
          );
          recipientBalanceAfter.should.be.bignumber.equal(
            recipientBalanceBefore.plus(oneUSDInAtto / 2)
          );
        });
      }
    );


    context("should not allow invalid gift (ETH)", function () {
      it("reverts if invalid recipient", async function () {
        await assertRevert(
          this.token.gift(
            ZERO_ADDRESS,
            benefactorFPF,
            cardOne,
            message,
            oneUSDInWei / 2,
            oneUSDInWei,
            false, {
              from: owner,
              value: oneUSDInWei
            }
          )
        );
      });

      it("reverts if no benefactor", async function () {
        await assertRevert(
          this.token.gift(
            account2,
            999,
            cardOne,
            message,
            oneUSDInWei / 2,
            oneUSDInWei,
            false, {
              from: account1,
              value: oneUSDInWei
            }
          )
        );
      });

      it("reverts if no card", async function () {
        await assertRevert(
          this.token.gift(
            account2,
            benefactorEFF,
            999,
            message,
            oneUSDInWei / 2,
            oneUSDInWei,
            false, {
              from: account1,
              value: oneUSDInWei
            }
          )
        );
      });

      it("reverts if below minimum amount", async function () {
        //the total sent with this card is less than the min cost of 1 card (1usd)
        await assertRevert(
          this.token.gift(
            account2,
            benefactorEFF,
            cardOne,
            message,
            oneUSDInWei / 4,
            oneUSDInWei / 4,
            false, {
              from: account1,
              value: oneUSDInWei / 2
            }
          )
        );
      });

      it("reverts if not active", async function () {
        // add a new card but set the activity to false such that no new cards can be gifted
        await this.token.addCard(
          cardTwo,
          "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy",
          false,
          0,
          0, {
            from: owner
          }
        );
        await assertRevert(
          this.token.gift(
            account2,
            benefactorEFF,
            cardTwo,
            message,
            oneUSDInWei / 2,
            oneUSDInWei,
            false, {
              from: account1,
              value: oneUSDInWei
            }
          )
        );
      });

      it("reverts if invalid donation & gift amount combo amount", async function () {
        //total transferred in wei is different from requested donation & gift
        await assertRevert(
          this.token.gift(
            account2,
            benefactorEFF,
            cardOne,
            message,
            oneUSDInWei * 2,
            oneUSDInWei,
            false, {
              from: account1,
              value: oneUSDInWei
            }
          )
        );

        // transferer in wei is less than the gift & requested together
        await assertRevert(
          this.token.gift(
            account2,
            benefactorEFF,
            cardOne,
            message,
            oneUSDInWei,
            oneUSDInWei,
            false, {
              from: account1,
              value: oneUSDInWei
            }
          )
        );
      });

      it("reverts if maximum number of cards minted", async function () {
        // add a new card and set the maximum number of minted to 1. can then create one card but should not be able
        // to create the second card as at the maximum.
        await this.token.addCard(
          cardTwo,
          "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy",
          true,
          1,
          0, {
            from: owner
          }
        );

        //should be able to create the first card as less than max of 1
        await this.token.gift(
          account2,
          benefactorEFF,
          cardTwo,
          message,
          oneUSDInWei / 2,
          oneUSDInWei / 2,
          false, {
            from: account1,
            value: oneUSDInWei
          }
        );

        // the second card should fail as the max is set to 1 and 1 card has already been minted
        await assertRevert(
          this.token.gift(
            account2,
            benefactorEFF,
            cardTwo,
            message,
            oneUSDInWei / 2,
            oneUSDInWei,
            false, {
              from: account1,
              value: oneUSDInWei
            }
          )
        );
      });
    });

    context("should not allow invalid gift (DAI)", function () {
      it("reverts if invalid recipient", async function () {
        await assertRevert(
          this.token.giftInDai(
            ZERO_ADDRESS,
            benefactorFPF,
            cardTwo,
            message,
            oneUSDInAtto / 2,
            oneUSDInAtto / 2,
            false, {
              from: account1,
              value: 0
            }
          )
        );
      });

      it("reverts if no benefactor", async function () {
        await assertRevert(
          this.token.giftInDai(
            account1,
            999,
            cardTwo,
            message,
            oneUSDInAtto / 2,
            oneUSDInAtto / 2,
            false, {
              from: account1,
              value: 0
            }
          )
        );
      });

      it("reverts if no card", async function () {
        await assertRevert(
          this.token.giftInDai(
            account1,
            benefactorEFF,
            999,
            message,
            oneUSDInAtto / 2,
            oneUSDInAtto / 2,
            false, {
              from: account1,
              value: 0
            }
          )
        );
      });

      it("reverts if below minimum amount", async function () {
        await assertRevert(
          this.token.giftInDai(
            account1,
            benefactorEFF,
            cardOne,
            message,
            //the minimum amount for this card is etherToWei(1). The sum of charity
            //and gift is les
            false,
            oneUSDInAtto * 0.4,
            oneUSDInAtto * 0.5, {
              from: account1,
              value: 0
            }
          )
        );
      });
      it("reverts if above approved amount", async function () {
        // 50 dai has been approved for transfer by account1. should revert
        // if more than this is requested
        await assertRevert(
          this.token.giftInDai(
            account1,
            benefactorEFF,
            cardOne,
            message,
            //the minimum amount for this card is etherToWei(1). The sum of charity
            //and gift is les
            false,
            oneUSDInAtto * 55,
            oneUSDInAtto * 10, {
              from: account1,
              value: 0
            }
          )
        );
      });

      it("reverts if not active", async function () {
        // add a new card but set the activity to false such that no new cards can be giftInDaied
        await this.token.addCard(
          cardTwo,
          "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy",
          false,
          0,
          0, {
            from: owner
          }
        );
        await assertRevert(
          this.token.giftInDai(
            account1,
            benefactorEFF,
            cardTwo,
            message,
            oneUSDInAtto / 2,
            oneUSDInAtto / 2,
            false, {
              from: account1,
              value: 0
            }
          )
        );
      });

      it("reverts if maximum number of cards minted", async function () {
        // add a new card and set the maximum number of minted to 1. can then create one card but should not be able
        // to create the second card as at the maximum.
        await this.token.addCard(
          cardTwo,
          "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy",
          true,
          1,
          0, {
            from: owner
          }
        );

        //should be able to create the first card as less than max of 1
        await this.token.giftInDai(
          account1,
          benefactorEFF,
          cardTwo,
          message,
          oneUSDInAtto / 2,
          oneUSDInAtto / 2,
          false, {
            from: account1,
            value: 0
          }
        );

        // the second card should fail as the max is set to 1 and 1 card has already been minted
        await assertRevert(
          this.token.giftInDai(
            account1,
            benefactorEFF,
            cardTwo,
            message,
            oneUSDInAtto / 2,
            oneUSDInAtto / 2,
            false, {
              from: account1,
              value: 0
            }
          )
        );
      });
    });

    context("should tally up all gifted and donations (ETH)", function () {
      // the before each creates exactly one card and sends oneUSDInWei to the charity
      // and oneUSDInWei to the recipient
      it("correctly keeps a record of donations", async function () {
        const totalDonatedInWei = await this.token.totalDonatedInWei();
        totalDonatedInWei.should.be.bignumber.equal(
          oneUSDInWei
        );
      });

      it("correctly keeps a record of gifts", async function () {
        const totalGiftedInWei = await this.token.totalGiftedInWei();
        totalGiftedInWei.should.be.bignumber.equal(oneUSDInWei);
      });
    });

    context("should tally up all gifted and donations (DAI)", function () {
      // we need to create a new card and send the gift and donation in DAI
      it("correctly keeps a record of donations", async function () {
        await this.token.giftInDai(
          account2,
          benefactorEFF,
          cardOne,
          message,
          oneUSDInAtto,
          oneUSDInAtto,
          false, {
            from: account1,
            value: 0
          }
        );
        const totalDonatedInAtto = await this.token.totalDonatedInAtto();
        totalDonatedInAtto.should.be.bignumber.equal(
          oneUSDInAtto
        );
      });

      it("correctly keeps a record of gifts", async function () {
        await this.token.giftInDai(
          account2,
          benefactorEFF,
          cardOne,
          message,
          oneUSDInAtto,
          oneUSDInAtto,
          false, {
            from: account1,
            value: 0
          }
        );
        const totalGiftedInAtto = await this.token.totalGiftedInAtto();
        totalGiftedInAtto.should.be.bignumber.equal(oneUSDInAtto);
      });
    });
    context("Should allow for the creation of a ephemeral wallet and escrow (ETH)", function () {
      beforeEach(async function () {
        //create a new ephemeral account for each test
        ephemeralAddress = web3.personal.newAccount()
      })
      it("reverts if ephemeral fee is not added to donation and gift amounts", async function () {
        await assertRevert(this.token.gift(ephemeralAddress,
          benefactorEFF,
          cardOne,
          message,
          oneUSDInWei,
          oneUSDInWei,
          true, //this bool defines if the card should be set as claimable
          {
            from: account1,
            value: oneUSDInWei * 2
          }))
      });
      it("correctly allocates gift status to deposited", async function () {

        await this.token.gift(ephemeralAddress,
          benefactorEFF,
          cardOne,
          message + "via ephemeral",
          oneUSDInWei,
          oneUSDInWei,
          true, //this bool defines if the card should be set as claimable
          {
            from: account1,
            value: oneUSDInWei * 2 + ephemeralAddressFee.toNumber()
          })

        let token = await this.token.tokenDetails(secondTokenId); //grab information for the second token
        let tokenStatus = token[5] //status is in array location 5 from the radicards struct
        tokenStatus.should.be.bignumber.equal(1) //1 corresponds to the deposited state in the enum
      });
      it("correctly keeps the card and ether in escrow", async function () {
        let contractBalanceBefore = await web3.eth.getBalance(
          this.token.address
        );

        await this.token.gift(ephemeralAddress,
          benefactorEFF,
          cardOne,
          message + "via ephemeral",
          oneUSDInWei,
          oneUSDInWei,
          true, //this bool defines if the card should be set as claimable
          {
            from: account1,
            value: oneUSDInWei * 2 + ephemeralAddressFee.toNumber()
          })
        // get the tokenid's of the tokens owned by the radicards contract. this returns an array of bignum ID's
        let tokensOwnedByRadiContract = await this.token.tokensOf(this.token.address)
        // the card created above should have tokenid=1 (the second card created after the before each initially)
        // and should be owned by the contract, held in escrow. need to index the tokensOwnedByRadiContract at 0
        // as tokensOf returns an array of all token ID's owned
        tokensOwnedByRadiContract[0].should.be.bignumber.equal(1)

        // next, we must check that the eth is held by the contract. expecting the balance to have gone up by
        // the gift amount exactly. the charity should also have been paid out at the same time
        let contractBalanceAfter = await web3.eth.getBalance(
          this.token.address
        );
        contractBalanceAfter.should.be.bignumber.equal(contractBalanceBefore.add(oneUSDInWei))
      });
      it("correctly funds the ephemeral wallet with ephemeral address fee", async function () {
        let ephemeralBalanceBefore = await web3.eth.getBalance(
          ephemeralAddress
        );

        ephemeralBalanceBefore.should.be.bignumber.equal(0) //ephemeral account is new and should be empty to start with

        await this.token.gift(ephemeralAddress,
          benefactorEFF,
          cardOne,
          message + "via ephemeral",
          oneUSDInWei,
          oneUSDInWei,
          true, //this bool defines if the card should be set as claimable
          {
            from: account1,
            value: oneUSDInWei * 2 + ephemeralAddressFee.toNumber()
          })

        let ephemeralBalanceAfter = await web3.eth.getBalance(
          ephemeralAddress
        );
        ephemeralBalanceAfter.should.be.bignumber.equal(ephemeralAddressFee)
      });
    });
    context("Should allow for the creation of a ephemeral wallet and escrow (DAI)", function () {
      beforeEach(async function () {
        //create a new ephemeral account for each test
        ephemeralAddress = web3.personal.newAccount()
      })
      it("reverts if ephemeral fee is not added to donation and gift amounts", async function () {
        await assertRevert(this.token.giftInDai(ephemeralAddress,
          benefactorEFF,
          cardOne,
          message,
          oneUSDInAtto,
          oneUSDInAtto,
          true, //this bool defines if the card should be set as claimable
          {
            from: account1,
            value: 0
          }))
      });
      it("correctly allocates gift status to deposited", async function () {

        await this.token.giftInDai(ephemeralAddress,
          benefactorEFF,
          cardOne,
          message + "via ephemeral",
          oneUSDInAtto,
          oneUSDInAtto,
          true, //this bool defines if the card should be set as claimable
          {
            from: account1,
            value: ephemeralAddressFee
          })

        let token = await this.token.tokenDetails(secondTokenId); //grab information for the second token
        let tokenStatus = token[5] //status is in array location 5 from the radicards struct
        tokenStatus.should.be.bignumber.equal(1) //1 corresponds to the deposited state in the enum
      });
      it("correctly keeps the card and dai in escrow", async function () {
        //this balance should not change between gifting as user is sending in dai
        let contractETHBalanceBefore = await web3.eth.getBalance(
          this.token.address
        );
        //this balance should increase by oneUSDInAtto as contract is holding in escrow
        let contractDAIBalanceBefore = await this.daiContract.balanceOf(
          this.token.address
        );

        await this.token.giftInDai(ephemeralAddress,
          benefactorEFF,
          cardOne,
          message + "via ephemeral",
          oneUSDInAtto,
          oneUSDInAtto,
          true, //this bool defines if the card should be set as claimable
          {
            from: account1,
            value: ephemeralAddressFee
          })
        // get the tokenid's of the tokens owned by the radicards contract. this returns an array of bignum ID's
        let tokensOwnedByRadiContract = await this.token.tokensOf(this.token.address)
        // the card created above should have tokenid=1 (the second card created after the before each initially)
        // and should be owned by the contract, held in escrow. need to index the tokensOwnedByRadiContract at 0
        // as tokensOf returns an array of all token ID's owned
        tokensOwnedByRadiContract[0].should.be.bignumber.equal(1)

        // next, we must check that the eth is held by the contract = 0 and the dai = gift amount
        let contractETHBalanceAfter = await web3.eth.getBalance(
          this.token.address
        );
        contractETHBalanceAfter.should.be.bignumber.equal(contractETHBalanceBefore)

        let contractDAIBalanceAfter = await this.daiContract.balanceOf(
          this.token.address
        );

        contractDAIBalanceAfter.should.be.bignumber.equal(contractDAIBalanceBefore.add(oneUSDInAtto))

      });

      it("correctly funds the ephemeral wallet with ephemeral address fee", async function () {
        let ephemeralBalanceBefore = await web3.eth.getBalance(
          ephemeralAddress
        );

        ephemeralBalanceBefore.should.be.bignumber.equal(0) //ephemeral account is new and should be empty to start with

        await this.token.giftInDai(ephemeralAddress,
          benefactorEFF,
          cardOne,
          message + "via ephemeral",
          oneUSDInAtto,
          oneUSDInAtto,
          true, //this bool defines if the card should be set as claimable
          {
            from: account1,
            value: ephemeralAddressFee
          })

        let ephemeralBalanceAfter = await web3.eth.getBalance(
          ephemeralAddress
        );
        ephemeralBalanceAfter.should.be.bignumber.equal(ephemeralAddressFee)
      });
    });
    context("should allow for the cancellation of a gift", function () {
      beforeEach(async function () {
        // create a new ephemeral account for each test
        ephemeralAddress = web3.personal.newAccount("password")
        // all tests that follow require a simple, standard gift
        await this.token.gift(ephemeralAddress,
          benefactorEFF,
          cardOne,
          message + "via ephemeral",
          oneUSDInWei,
          oneUSDInWei,
          true, //this bool defines if the card should be set as claimable
          {
            from: account1,
            value: oneUSDInWei * 2 + ephemeralAddressFee.toNumber()
          })
      })
      it("reverts if not gifter", async function () {
        // account1 created the gift. only this account should be able to cancel it
        await assertRevert(this.token.cancelGift(ephemeralAddress, {
          from: account2
        }))
      });

      it("reverts if no card associated with ephemeral address", async function () {
        // account2 is not associated with an ephemeral address
        await assertRevert(this.token.cancelGift(account2, {
          from: account1
        }))
      });
      // it("reverts if gift already claimed", async function () {

      //   web3.personal.unlockAccount(ephemeralAddress, "password")
      //   //first, claim gift. this can only be done from the ephemeral account
      //   await this.token.claimGift(account2, {
      //     from: ephemeralAddress,
      //     value: 0
      //   })

      //   await assertRevert(this.token.cancelGift(ephemeralAddress, {
      //     from: account1
      //   }))
      // });

      it("can cancel gift if gifter and funds are returned (ETH)", async function () {
        let contractBalanceBefore = await web3.eth.getBalance(
          this.token.address
        );

        let gifterBalanceBefore = await web3.eth.getBalance(
          account1
        );
        let txHash = await this.token.cancelGift(ephemeralAddress, {
          from: account1
        })
        // as the account1 is getting a refund we need to double check that they get back all their
        // eth. however, they spend some within their wallet on gas for the cancel call!
        // to get the total eth spent on gas we multiply the gasUsed for the gasPrice
        let receipt = await web3.eth.getTransaction(txHash.tx);
        let totalSpentOnGas = receipt.gasPrice * (txHash.receipt.gasUsed)

        let contractBalanceAfter = await web3.eth.getBalance(
          this.token.address
        );
        contractBalanceAfter.should.be.bignumber.equal(contractBalanceBefore.minus(oneUSDInWei))

        let gifterBalanceAfter = await web3.eth.getBalance(
          account1
        );
        //check that the gifter account is equal to the refund - the amount spent on gas
        gifterBalanceAfter.should.be.bignumber.equal(gifterBalanceBefore.plus(oneUSDInWei).minus(totalSpentOnGas))
      })

      it("can cancel gift if gifter and funds are returned (DAI)", async function () {
        // we need to create a new ephemeraladdress and gift for the dai test as the before each uses
        // the eth donation method

        ephemeralAddress = web3.personal.newAccount("password")

        await this.token.giftInDai(ephemeralAddress,
          benefactorEFF,
          cardOne,
          message + "via ephemeral",
          oneUSDInAtto,
          oneUSDInAtto,
          true, //this bool defines if the card should be set as claimable
          {
            from: account1,
            value: ephemeralAddressFee
          })

        let contractBalanceBefore = await this.daiContract.balanceOf(
          this.token.address
        );

        let gifterBalanceBefore = await this.daiContract.balanceOf(
          account1
        );

        await this.token.cancelGift(ephemeralAddress, {
          from: account1
        })

        let contractBalanceAfter = await this.daiContract.balanceOf(
          this.token.address
        );
        contractBalanceAfter.should.be.bignumber.equal(contractBalanceBefore.minus(oneUSDInAtto))

        let gifterBalanceAfter = await this.daiContract.balanceOf(
          account1
        );
        //check that the gifter account is equal to the refund dai amount
        gifterBalanceAfter.should.be.bignumber.equal(gifterBalanceBefore.plus(oneUSDInAtto))
      })
    })

    context("should allow for the claiming of a gift", function () {
      beforeEach(async function () {
        // create a new ephemeral account for each test
        ephemeralAddress = await web3.personal.newAccount("password")
        // console.log("VAAA")
        // console.log(web3)
        // console.log(newaccount2)
        // all tests that follow require a simple, standard gift with claimable link turned to true
        await this.token.gift(ephemeralAddress,
          benefactorEFF,
          cardOne,
          message + " via ephemeral",
          oneUSDInWei,
          oneUSDInWei,
          true, //this bool defines if the card should be set as claimable
          {
            from: account1,
            value: oneUSDInWei * 2 + ephemeralAddressFee.toNumber()
          })
      })
      it("reverts if not ephemeral Address", async function () {
        // account1 created the gift and it was sent to the ephemeralAddress
        // only the ephemeral address should be able to make this call
        await assertRevert(this.token.claimGift(account2, {
          from: account2
        }))
      });
      it("reverts if not gift is already claimed", async function () {
        await assertRevert(this.token.claimGift(account2, {
          from: account2
        }))
      });
      it("should transfer token and funds to new owner", async function () {
        web3.personal.unlockAccount(ephemeralAddress, "password")

        // initially the token owns the token (before transfer)
        let ownerOfToken = await this.token.ownerOf(1)
        ownerOfToken.should.be.bignumber.equal(this.token.address)

        // we also need to check the token balances of the contract and the recipient
        // address to check it was transfers correctly

        let contractBalanceBefore = await web3.eth.getBalance(
          this.token.address
        );
        // we want to claim the token and eth to account2
        let recipientBalanceBefore = await web3.eth.getBalance(
          account2
        );

        await this.token.claimGift(account2, {
          from: ephemeralAddress,
          value: 0
        })

        // after the claim we can check that the owner is now account2
        ownerOfToken = await this.token.ownerOf(1)
        ownerOfToken.should.be.bignumber.equal(account2)

        // check the fund transfer happened correctly
        let contractBalanceAfter = await web3.eth.getBalance(
          this.token.address
        );
        contractBalanceAfter.should.be.bignumber.equal(contractBalanceBefore.minus(oneUSDInWei))

        // we want to claim the token and eth to account2
        let recipientBalanceAfter = await web3.eth.getBalance(
          account2
        );
        recipientBalanceAfter.should.be.bignumber.equal(recipientBalanceBefore.plus(oneUSDInWei))
      });
    })
  });
});
