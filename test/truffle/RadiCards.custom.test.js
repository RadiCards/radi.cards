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
  });

  describe('custom radi.cards logic', function () {
    beforeEach(async function () {
      await this.token.gift(account1, benefactorEFF, cardOne, 'Happy Xmas', 'FFFFFF', {
        from: owner,
        value: this.minContribution
      });
      await this.token.gift(account1, benefactorFPF, cardTwo, 'Happy Holiday - God', '000000', {
        from: owner,
        value: this.minContribution
      });
    });

    context('should have to send at least the minimum amount', function () {
      it('reverts if below minimum amount', async function () {
        await assertRevert(this.token.gift(account1, benefactorEFF, cardOne, 'Happy Xmas', 'FFFFFF', {
          from: owner,
          value: 0
        }));
        await assertRevert(this.token.gift(account1, benefactorEFF, cardOne, 'Happy Xmas', 'FFFFFF', {
          from: owner,
          value: this.minContribution.sub(1)
        }));
      });

      it('can send minimum contribution', async function () {
        await this.token.gift(account1, benefactorEFF, cardOne, 'Happy Xmas', 'FFFFFF', {
          from: owner,
          value: this.minContribution
        });
        await this.token.gift(account1, benefactorEFF, cardOne, 'Happy Xmas', 'FFFFFF', {
          from: owner,
          value: this.minContribution.plus(1)
        });
      });
    });

    context('should allow whitelisted to change min contribution', function () {
      it('reverts if not whitelisted', async function () {
        await assertRevert(this.token.setMinContribution(1, {from: account1}));
      });

      it('can send minimum contribution', async function () {
        await this.token.setMinContribution(1, {from: owner});
        const newMin = await this.token.minContribution();
        newMin.should.be.bignumber.equal('1');
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

    context('should set token data', function () {
      it('returns message and extra', async function () {
        const message = await this.token.messages(firstTokenId);
        message.should.be.equal('Happy Xmas');

        const extras = await this.token.extras(firstTokenId);
        extras.should.be.equal('FFFFFF');
      });

      it('returns token URI', async function () {
        const uri = await this.token.tokenURI(firstTokenId);
        uri.should.be.equal(BASE_URI + cardOneUri);
      });
    });
  });
});
