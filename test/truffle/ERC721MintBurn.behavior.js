const {
  assertRevert
} = require('../helpers/assertRevert');
const {
  inLogs
} = require('../helpers/expectEvent');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

function shouldBehaveLikeMintAndBurnERC721(
  creator,
  [owner, newOwner, approved, anyone]
) {
  const firstTokenId = 0;
  const secondTokenId = 1;
  const thirdTokenId = 2;
  const unknownTokenId = 3;

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const MOCK_URI = 'https://example.com';

  const benefactorEFF = 1;
  const benefactorFPF = 2;

  const cardOne = 1;
  const cardTwo = 2;

  const TOKEN_URI = '123abcHash';

  const oneUSDInWei = etherToWei(1).dividedToIntegerBy(130);

  describe('like a mintable and burnable ERC721', function () {
    beforeEach(async function () {
      await this.token.gift(owner, benefactorEFF, cardOne, 'Happy Xmas', 'FFFFFF', oneUSDInWei, {
        from: creator,
        value: oneUSDInWei
      });
      await this.token.gift(owner, benefactorEFF, cardOne, 'Happy Xmas', 'FFFFFF', oneUSDInWei, {
        from: creator,
        value: oneUSDInWei
      });
    });

    describe('mint', function () {
      let logs = null;

      describe('when successful', function () {
        beforeEach(async function () {
          const result = await this.token.gift(newOwner, benefactorEFF, cardOne, 'Happy Xmas', 'FFFFFF', oneUSDInWei, {
            from: creator,
            value: oneUSDInWei
          });
          logs = result.logs;
        });

        it('assigns the token to the new owner', async function () {
          (await this.token.ownerOf(thirdTokenId)).should.be.equal(newOwner);
        });

        it('increases the balance of its owner', async function () {
          (await this.token.balanceOf(newOwner)).should.be.bignumber.equal(1);
        });

        it('emits a transfer event', async function () {
          await inLogs(logs, 'Transfer', {
            _from: ZERO_ADDRESS,
            _to: newOwner,
          });

          logs[0].args._tokenId.should.be.bignumber.equal(thirdTokenId);
        });
      });

      describe('when the given owner address is the zero address', function () {
        it('reverts', async function () {
          await assertRevert(this.token.gift(ZERO_ADDRESS, benefactorEFF, cardOne, 'Happy Xmas', 'FFFFFF', oneUSDInWei, {
            from: creator
          }));
        });
      });
    });

    describe('burn', function () {
      const tokenId = firstTokenId;

      describe('when successful', function () {
        it('burns should revert as not allowed', async function () {
          await assertRevert(this.token.burn(tokenId, {
            from: creator
          }));
          (await this.token.balanceOf(owner)).should.be.bignumber.equal(2);
        });
      });
    });

  });
}

module.exports = {
  shouldBehaveLikeMintAndBurnERC721,
};
