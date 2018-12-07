const {assertRevert} = require('../helpers/assertRevert');
const {sendTransaction} = require('../helpers/sendTransaction');
const etherToWei = require('../helpers/etherToWei');

const advanceBlock = require('../helpers/advanceToBlock');

const _ = require('lodash');

const BigNumber = web3.BigNumber;
const RadiCards = artifacts.require('RadiCards');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('RadiCards ERC721 Custom', function (accounts) {
  const owner = accounts[0];
  const account1 = accounts[1];

  const firstTokenId = 0;
  const secondTokenId = 1;
  const unknownTokenId = 2;
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const RECEIVER_MAGIC_VALUE = '0x150b7a02';

  const benefactorEFF = 1;
  const benefactorFPF = 2;

  const cardOne = 1;
  const cardTwo = 2;
  
  const message = 'Happy Xmas';
  const extra = 'FFFFFF';

  const cardOneUri = 'QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy';

  const name = 'RadiCards';
  const symbol = 'RADI';

  const TOKEN_URI = '123abcHash';
  const BASE_URI = 'https://ipfs.infura.io/ipfs/';

  before(async function () {
    await advanceBlock();
  });

  beforeEach(async function () {
    this.token = await RadiCards.new({from: owner});
    this.minContribution = await this.token.minContribution();

    await this.token.addCard(cardOne, "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy", true);
    await this.token.addCard(cardTwo, "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy", true);
  });

  describe('custom radi.cards logic', function () {
    beforeEach(async function () {
      await this.token.gift(account1, benefactorEFF, cardOne, message, extra, {
        from: owner,
        value: this.minContribution
      });
      await this.token.gift(account1, benefactorFPF, cardTwo, 'Happy Holiday - God', '000000', {
        from: owner,
        value: this.minContribution
      });
    });

    context('valid gift', function () {
      it('can send minimum contribution', async function () {
        await this.token.gift(account1, benefactorEFF, cardOne, message, extra, {
          from: owner,
          value: this.minContribution
        });
        await this.token.gift(account1, benefactorFPF, cardTwo, message, extra, {
          from: owner,
          value: this.minContribution.plus(1)
        });
      });
    });

    context('should allow whitelisted to change min contribution', function () {
      it('reverts if not whitelisted', async function () {
        await assertRevert(this.token.setMinContribution(1, {from: account1}));
      });

      it('reverts if zero value', async function () {
        await assertRevert(this.token.setMinContribution(0, {from: account1}));
      });

      it('can send minimum contribution', async function () {
        await this.token.setMinContribution(1, {from: owner});
        const newMin = await this.token.minContribution();
        newMin.should.be.bignumber.equal('1');
      });
    });

    context('should allow card to be set to active and inactive', function () {
      it('reverts if not whitelisted', async function () {
        await assertRevert(this.token.setActive(cardOne, true, {from: account1}));
      });

      it('reverts if no card', async function () {
        await assertRevert(this.token.setActive(999, true, {from: owner}));
      });

      it('can deactivate card', async function () {
        let card = await this.token.cards(cardOne, {from: owner});
        card[1].should.be.equal(true);

        await this.token.setActive(cardOne, false, {from: owner});
        card = await this.token.cards(cardOne, {from: owner});
        card[1].should.be.equal(false);
      });
    });

    context('should have two benefactors initially', function () {
      it('returns indexes', async function () {
        const indexes = await this.token.benefactorsKeys();
        indexes.length.should.be.bignumber.equal(2);
      });
    });

    context('should have two cards initially', function () {
      it('returns indexes', async function () {
        const indexes = await this.token.cardsKeys();
        indexes.length.should.be.bignumber.equal(2);
      });
    });

    context('should set data', function () {
      it('returns message and extra', async function () {
        const message = await this.token.messages(firstTokenId);
        message.should.be.equal(message);

        const extras = await this.token.extras(firstTokenId);
        extras.should.be.equal('FFFFFF');
      });

      it('returns token URI', async function () {
        const uri = await this.token.tokenURI(firstTokenId);
        uri.should.be.equal(BASE_URI + cardOneUri);
      });
    });

    context('should not allow invalid gift', function () {

      it('reverts if invalid recipient', async function () {
        await assertRevert(this.token.gift(ZERO_ADDRESS, benefactorFPF, cardOne, message, extra, {
          from: owner,
          value: this.minContribution
        }));
      });

      it('reverts if no benefactor', async function () {
        await assertRevert(this.token.gift(account1, 999, cardOne, message, extra, {
          from: owner,
          value: this.minContribution
        }));
      });

      it('reverts if no card', async function () {
        await assertRevert(this.token.gift(account1, benefactorEFF, 999, message, extra, {
          from: owner,
          value: this.minContribution
        }));
      });

      it('reverts if below minimum amount', async function () {
        await assertRevert(this.token.gift(account1, benefactorEFF, cardOne, message, extra, {
          from: owner,
          value: 0
        }));

        await assertRevert(this.token.gift(account1, benefactorEFF, cardOne, message, extra, {
          from: owner,
          value: this.minContribution.sub(1)
        }));
      });

      it('reverts if not active', async function () {
        await this.token.addCard(3, "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy", false);
        await assertRevert(this.token.gift(account1, benefactorEFF, 3, message, extra, {
          from: owner,
          value: this.minContribution
        }));
      });
    });
  });
});
