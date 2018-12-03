const {assertRevert} = require('../helpers/assertRevert');
const {inLogs} = require('../helpers/expectEvent');
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

  const TOKEN_URI = "123abcHash";

  let currentNfcId = 1;

  const genNfcId = () => {
    const nfcId = _.padStart(_.toString(currentNfcId), 32, '0');
    currentNfcId++;
    return nfcId;
  };

  const genBirthDate = () => {
    return new Date().getTime();
  };

  describe('like a mintable and burnable ERC721', function () {
    beforeEach(async function () {
      await this.token.mintTo(owner, genNfcId(), TOKEN_URI, genBirthDate(), {from: creator});
      await this.token.mintTo(owner, genNfcId(), TOKEN_URI, genBirthDate(), {from: creator});
    });

    describe('mint', function () {
      let logs = null;

      describe('when successful', function () {
        beforeEach(async function () {
          const result = await this.token.mintTo(newOwner, genNfcId(), TOKEN_URI, genBirthDate(), {from: creator});
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
          await assertRevert(this.token.mintTo(ZERO_ADDRESS, genNfcId(), TOKEN_URI, genBirthDate(), {from: creator}));
        });
      });
    });

    describe('burn', function () {
      const tokenId = firstTokenId;
      let logs = null;

      describe('when successful', function () {
        beforeEach(async function () {
          const result = await this.token.burn(tokenId, {from: creator});
          logs = result.logs;
        });

        it('burns the given token ID and adjusts the balance of the owner', async function () {
          await assertRevert(this.token.ownerOf(tokenId));
          (await this.token.balanceOf(owner)).should.be.bignumber.equal(1);
        });

        it('emits a burn event', async function () {
          logs.length.should.be.equal(1);
          logs[0].event.should.be.equal('Transfer');
          logs[0].args._from.should.be.equal(owner);
          logs[0].args._to.should.be.equal(ZERO_ADDRESS);
          logs[0].args._tokenId.should.be.bignumber.equal(tokenId);
        });

        it('cleans up custom properties', async function () {
          const nfcIdOf = await this.token.nfcIdOf(tokenId);
          nfcIdOf.should.be.bignumber.equal(0);

          const tokenOf = await this.token.tokenOf(_.padStart(_.toString(tokenId), 32, '0'));
          tokenOf.should.be.bignumber.equal(0);

          const birthDateOf = await this.token.birthDateOf(tokenId);
          birthDateOf.should.be.bignumber.equal(0);
        });
      });

      describe('when the given token ID was not tracked by this contract', function () {
        it('reverts', async function () {
          await assertRevert(
            this.token.burn(unknownTokenId, {from: creator})
          );
        });
      });
      describe('when not the owner', function () {
        it('reverts', async function () {
          await assertRevert(
            this.token.burn(firstTokenId, {from: newOwner})
          );
        });
      });
    });

  });
}

module.exports = {
  shouldBehaveLikeMintAndBurnERC721,
};
