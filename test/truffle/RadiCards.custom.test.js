const { assertRevert } = require("../helpers/assertRevert");
const { sendTransaction } = require("../helpers/sendTransaction");
const etherToWei = require("../helpers/etherToWei");

const advanceBlock = require("../helpers/advanceToBlock");

const _ = require("lodash");

const BigNumber = web3.BigNumber;
const RadiCards = artifacts.require("RadiCards");
const DaiContract = artifacts.require("ERC20Mock.sol");

require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();

contract("RadiCards ERC721 Custom", function(accounts) {
  const owner = accounts[0];
  const account1 = accounts[1];
  const account2 = accounts[2];

  const firstTokenId = 0;
  const secondTokenId = 1;
  const unknownTokenId = 2;
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const RECEIVER_MAGIC_VALUE = "0x150b7a02";

  const benefactorEFF = 1;
  const benefactorFPF = 2;

  const cardOne = 1;
  const cardTwo = 2;
  const cardThree = 3;

  const message = "Happy Xmas";

  const cardOneUri = "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy";

  const name = "RadiCards";
  const symbol = "RADI";

  const TOKEN_URI = "123abcHash";
  const BASE_URI = "https://ipfs.infura.io/ipfs/";

  before(async function() {
    await advanceBlock();
  });

  beforeEach(async function() {
    this.token = await RadiCards.new({
      from: owner
    });
    this.minContribution = await this.token.minContribution();

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

    // 0 as the max quantity sets the cards to unlimited minting
    await this.token.addCard(
      cardOne,
      "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy",
      true,
      0,
      0,
      {
        from: owner
      }
    );
    await this.token.addCard(
      cardTwo,
      "QmP8USgWUrihWfyhy7CNakcDbtkVPfJYKuZd9hcikP26QD",
      true,
      0,
      0,
      {
        from: owner
      }
    );

    //create a new card that has a minimum price of 1 Dai
    await this.token.addCard(
      cardThree,
      "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy",
      true,
      0,
      etherToWei(1),
      {
        from: owner
      }
    );

    // Create the sample ERC20 contract to represent dai functionality,
    // and approve the contract to transfer tokens. This would be done in by the UI right before the transfer.
    //the dai ERC20 token uses the same number of basis SI unites (1*10-18) as Ethereum with the atto
    // this means we can use the etherToWei helper to get full values of dai.
    this.daiContract = await DaiContract.new(account1, etherToWei(100), {
      from: owner
    });

    this.daiContract.approve(this.token.address, etherToWei(50), {
      from: account1
    });
    // Set it as the dai contract for the radicard implementation.
    this.token.setDaiContractAddress(this.daiContract.address, {
      from: owner
    });
  });

  describe("custom radi.cards logic", function() {
    beforeEach(async function() {
      //create one card where all funds go the the charity (msg.value = _donationAmount)
      await this.token.gift(
        account1,
        benefactorEFF,
        cardOne,
        message,
        this.minContribution,
        {
          from: owner,
          value: this.minContribution
        }
      );

      //create another card where half the funds go to the charity and half go the the recipient (account1)
      await this.token.gift(
        account1,
        benefactorFPF,
        cardTwo,
        message,
        this.minContribution,
        {
          from: owner,
          value: this.minContribution * 2
        }
      );
    });

    context("valid gift", function() {
      it("can send minimum contribution (ETH)", async function() {
        await this.token.gift(
          account1,
          benefactorEFF,
          cardOne,
          message,
          this.minContribution,
          {
            from: owner,
            value: this.minContribution
          }
        );
      });
      it("can send minimum contribution (DAI)", async function() {
        // we have already approved the contract to transact ERC20 dai tokens on our behalf
        // (note that this is done for account1 aproving the this.token contract)
        await this.token.giftInDai(
          account2,
          benefactorEFF,
          cardOne,
          message,
          etherToWei(0.5),
          etherToWei(0.5),
          {
            from: account1,
            value: 0
          }
        );
      });
    });

    context("should allow whitelisted to change min contribution", function() {
      it("reverts if not whitelisted", async function() {
        await assertRevert(
          this.token.setMinContribution(1, {
            from: account1
          })
        );
      });

      it("reverts if zero value set for min contribution", async function() {
        await assertRevert(
          this.token.setMinContribution(0, {
            from: account1
          })
        );
      });

      it("can set minimum contribution", async function() {
        await this.token.setMinContribution(1, {
          from: owner
        });
        const newMin = await this.token.minContribution();
        newMin.should.be.bignumber.equal("1");
      });
    });

    context("should allow card to be set to active and inactive", function() {
      it("reverts if not whitelisted", async function() {
        await assertRevert(
          this.token.setActive(cardOne, true, {
            from: account1
          })
        );
      });

      it("reverts if no card", async function() {
        await assertRevert(
          this.token.setActive(999, true, {
            from: owner
          })
        );
      });

      it("can deactivate card", async function() {
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

    context("should allow card max quantity to be changed later", function() {
      it("reverts if not whitelisted", async function() {
        await assertRevert(
          this.token.setMaxQuantity(cardOne, 10, {
            from: account1
          })
        );
      });

      it("reverts if no card", async function() {
        await assertRevert(
          this.token.setMaxQuantity(999, 10, {
            from: owner
          })
        );
      });

      it("can change max quantity", async function() {
        let card = await this.token.cards(cardOne, {
          from: owner
        });
        card[3].should.be.bignumber.equal(0);

        await this.token.setMaxQuantity(cardOne, 100, {
          from: owner
        });
        card = await this.token.cards(cardOne, {
          from: owner
        });
        card[3].should.be.bignumber.equal(100);
      });
    });

    context(
      "should correctly split funds sent between recipient and charity",
      function() {
        it("allow all funds to go to charity (ETH)", async function() {
          let benefactor = await this.token.benefactors(benefactorEFF, {
            from: owner
          });
          let benefactorAddress = benefactor[0];
          let benefactorBalanceBefore = await web3.eth.getBalance(
            benefactorAddress
          );

          let recipientBalanceBefore = await web3.eth.getBalance(account1);
          //set the donation amount to the msg.value. In this case all funds should go to the charity
          //and the balance of the benefactor should be the the sum of the balance before and the new
          //donation amount.
          await this.token.gift(
            account1,
            benefactorEFF,
            cardOne,
            message,
            this.minContribution,
            {
              from: owner,
              value: this.minContribution
            }
          );

          let benefactorBalanceAfter = await web3.eth.getBalance(
            benefactorAddress
          );
          benefactorBalanceAfter.should.be.bignumber.equal(
            benefactorBalanceBefore.add(this.minContribution)
          );

          let recipientBalanceAfter = await web3.eth.getBalance(account1);
          recipientBalanceAfter.should.be.bignumber.equal(
            recipientBalanceBefore
          );
        });
        it("allow all funds to go to recipient (ETH)", async function() {
          let benefactor = await this.token.benefactors(benefactorEFF, {
            from: owner
          });
          let benefactorAddress = benefactor[0];
          let benefactorBalanceBefore = await web3.eth.getBalance(
            benefactorAddress
          );

          let recipientBalanceBefore = await web3.eth.getBalance(account1);

          //set the donation amount to the 0. In this case all funds should go to the recipient
          //and the balance of the benefactor the same as before the card creation
          await this.token.gift(account1, benefactorEFF, cardOne, message, 0, {
            from: owner,
            value: this.minContribution
          });

          let benefactorBalanceAfter = await web3.eth.getBalance(
            benefactorAddress
          );
          benefactorBalanceAfter.should.be.bignumber.equal(
            benefactorBalanceBefore
          );

          let recipientBalanceAfter = await web3.eth.getBalance(account1);
          recipientBalanceAfter.should.be.bignumber.equal(
            recipientBalanceBefore.add(this.minContribution)
          );
        });
        it("can send minimum contribution split between user and charity (DAI)", async function() {
          // Store the account balances of the benefactor and recipient
          // to check each got the correct values from the card creation
          let benefactor = await this.token.benefactors(benefactorEFF, {
            from: owner
          });
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
            cardThree,
            message,
            etherToWei(0.5),
            etherToWei(0.5),
            {
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
            benefactorBalanceBefore.plus(etherToWei(0.5))
          );
          recipientBalanceAfter.should.be.bignumber.equal(
            recipientBalanceBefore.plus(etherToWei(0.5))
          );
        });
      }
    );

    context("should have two benefactors initially", function() {
      it("returns indexes", async function() {
        const indexes = await this.token.benefactorsKeys();
        indexes.length.should.be.bignumber.equal(2);
      });
    });

    context("should have three cards initially", function() {
      it("returns indexes", async function() {
        const indexes = await this.token.cardsKeys();
        indexes.length.should.be.bignumber.equal(3);
      });
    });

    context("should set data", function() {
      it("returns message and data", async function() {
        const [
          _gifter,
          _daiDonation,
          _giftingAmount,
          _donatingAmount,
          _message,
          _cardIndex,
          _benefactorIndex
        ] = await this.token.tokenDetails(firstTokenId);
        _daiDonation.should.be.equal(false);
        _message.should.be.equal(message);
        _gifter.should.be.equal(owner);
        _giftingAmount.should.be.bignumber.equal(0);
        _donatingAmount.should.be.bignumber.equal(this.minContribution);
        _cardIndex.should.be.bignumber.equal(cardOne);
        _benefactorIndex.should.be.bignumber.equal(benefactorEFF);
      });

      it("returns token URI", async function() {
        const uri = await this.token.tokenURI(firstTokenId);
        uri.should.be.equal(BASE_URI + cardOneUri);
      });
    });

    context("should not allow invalid gift (ETH)", function() {
      it("reverts if invalid recipient", async function() {
        await assertRevert(
          this.token.gift(
            ZERO_ADDRESS,
            benefactorFPF,
            cardOne,
            message,
            this.minContribution,
            {
              from: owner,
              value: this.minContribution
            }
          )
        );
      });

      it("reverts if no benefactor", async function() {
        await assertRevert(
          this.token.gift(
            account1,
            999,
            cardOne,
            message,
            this.minContribution,
            {
              from: owner,
              value: this.minContribution
            }
          )
        );
      });

      it("reverts if no card", async function() {
        await assertRevert(
          this.token.gift(
            account1,
            benefactorEFF,
            999,
            message,
            this.minContribution,
            {
              from: owner,
              value: this.minContribution
            }
          )
        );
      });

      it("reverts if below minimum amount", async function() {
        await assertRevert(
          this.token.gift(
            account1,
            benefactorEFF,
            cardOne,
            message,
            this.minContribution,
            {
              from: owner,
              value: 0
            }
          )
        );

        await assertRevert(
          this.token.gift(
            account1,
            benefactorEFF,
            cardOne,
            message,
            this.minContribution,
            {
              from: owner,
              value: this.minContribution.sub(1)
            }
          )
        );
      });

      it("reverts if not active", async function() {
        // add a new card but set the activity to false such that no new cards can be gifted
        await this.token.addCard(
          3,
          "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy",
          false,
          0,
          0,
          {
            from: owner
          }
        );
        await assertRevert(
          this.token.gift(
            account1,
            benefactorEFF,
            3,
            message,
            this.minContribution,
            {
              from: owner,
              value: this.minContribution
            }
          )
        );
      });

      it("reverts if invalid donation amount", async function() {
        await assertRevert(
          this.token.gift(
            account1,
            benefactorEFF,
            cardOne,
            message,
            this.minContribution * 2,
            {
              from: owner,
              value: this.minContribution
            }
          )
        );
      });

      it("reverts if maximum number of cards minted", async function() {
        // add a new card and set the maximum number of minted to 1. can then create one card but should not be able
        // to create the second card as at the maximum.
        await this.token.addCard(
          3,
          "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy",
          true,
          1,
          0,
          {
            from: owner
          }
        );

        //should be able to create the first card as less than max of 1
        await this.token.gift(
          account1,
          benefactorEFF,
          3,
          message,
          this.minContribution,
          {
            from: owner,
            value: this.minContribution
          }
        );

        // the second card should fail as the max is set to 1 and 1 card has already been minted
        await assertRevert(
          this.token.gift(
            account1,
            benefactorEFF,
            3,
            message,
            this.minContribution,
            {
              from: owner,
              value: this.minContribution
            }
          )
        );
      });
    });

    context("should not allow invalid gift (DAI)", function() {
      it("reverts if invalid recipient", async function() {
        await assertRevert(
          this.token.giftInDai(
            ZERO_ADDRESS,
            benefactorFPF,
            cardThree,
            message,
            etherToWei(0.5),
            etherToWei(0.5),
            {
              from: account1,
              value: 0
            }
          )
        );
      });

      it("reverts if no benefactor", async function() {
        await assertRevert(
          this.token.giftInDai(
            account1,
            999,
            cardThree,
            message,
            etherToWei(0.5),
            etherToWei(0.5),
            {
              from: account1,
              value: 0
            }
          )
        );
      });

      it("reverts if no card", async function() {
        await assertRevert(
          this.token.giftInDai(
            account1,
            benefactorEFF,
            999,
            message,
            etherToWei(0.5),
            etherToWei(0.5),
            {
              from: account1,
              value: 0
            }
          )
        );
      });

      it("reverts if below minimum amount", async function() {
        await assertRevert(
          this.token.giftInDai(
            account1,
            benefactorEFF,
            cardThree,
            message,
            //the minimum amount for this card is etherToWei(1). The sum of charity
            //and gift is less than this
            etherToWei(0.4),
            etherToWei(0.5),
            {
              from: account1,
              value: 0
            }
          )
        );
      });

      it("reverts if not active", async function() {
        // add a new card but set the activity to false such that no new cards can be giftInDaied
        await this.token.addCard(
          4,
          "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy",
          false,
          0,
          0,
          {
            from: owner
          }
        );
        await assertRevert(
          this.token.giftInDai(
            account1,
            benefactorEFF,
            4,
            message,
            etherToWei(0.5),
            etherToWei(0.5),
            {
              from: account1,
              value: 0
            }
          )
        );
      });

      it("reverts if maximum number of cards minted", async function() {
        // add a new card and set the maximum number of minted to 1. can then create one card but should not be able
        // to create the second card as at the maximum.
        await this.token.addCard(
          4,
          "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy",
          true,
          1,
          0,
          {
            from: owner
          }
        );

        //should be able to create the first card as less than max of 1
        await this.token.giftInDai(
          account1,
          benefactorEFF,
          4,
          message,
          etherToWei(0.5),
          etherToWei(0.5),
          {
            from: account1,
            value: 0
          }
        );

        // the second card should fail as the max is set to 1 and 1 card has already been minted
        await assertRevert(
          this.token.giftInDai(
            account1,
            benefactorEFF,
            4,
            message,
            etherToWei(0.5),
            etherToWei(0.5),
            {
              from: account1,
              value: 0
            }
          )
        );
      });
    });

    context("should tally up all gifted and donations wei", function() {
      it("correctly keeps a record of donations", async function() {
        const totalDonatedInWei = await this.token.totalDonatedInWei();
        totalDonatedInWei.should.be.bignumber.equal(
          // two cards bought at minContribution
          this.minContribution * 2
        );
      });

      it("correctly keeps a record of gifts", async function() {
        // send another card but this time we set the donation amount to 0. In this way
        // all the funds should be sent to the recipient and the total gifted should be
        // one unit minContribution
        const totalGiftedInWei = await this.token.totalGiftedInWei();
        totalGiftedInWei.should.be.bignumber.equal(this.minContribution);
      });
    });
  });
});
