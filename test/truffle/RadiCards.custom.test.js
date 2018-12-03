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
  const account2 = accounts[2];
  const account3 = accounts[4];
  const account4 = accounts[5];
  const account5 = accounts[6];

  const firstTokenId = 0;
  const secondTokenId = 1;
  const unknownTokenId = 2;
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const RECEIVER_MAGIC_VALUE = '0x150b7a02';

  const name = 'RadiCards';
  const symbol = 'RADI';

  const TOKEN_URI = '123abcHash';
  const BASE_URI = 'https://ipfs.infura.io/ipfs/';

  before(async function () {
    await advanceBlock();
  });

  beforeEach(async function () {
    this.token = await RadiCards.new({from: owner});
  });

  describe('custom logic', function () {
    beforeEach(async function () {
      await this.token.mintTo(account1, TOKEN_URI, {from: owner});
      await this.token.mintTo(account1, TOKEN_URI, {from: owner});
    });

  });

});
