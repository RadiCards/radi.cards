const {assertRevert} = require('../helpers/assertRevert');
const {sendTransaction} = require('../helpers/sendTransaction');
const etherToWei = require('../helpers/etherToWei');
const {shouldSupportInterfaces} = require('./SupportsInterface.behavior');

const advanceBlock = require('../helpers/advanceToBlock');

const {shouldBehaveLikeERC721} = require('./ERC721.behavior');
const {shouldBehaveLikeMintAndBurnERC721} = require('./ERC721MintBurn.behavior');

const _ = require('lodash');

const BigNumber = web3.BigNumber;
const RadiCards = artifacts.require('RadiCards');
const ERC721Receiver = artifacts.require('ERC721ReceiverMock.sol');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('RadiCards ERC721 Common', function (accounts) {
  const owner = accounts[0];
  const account1 = accounts[1];
  const account2 = accounts[2];
  const account3 = accounts[4];
  const account4 = accounts[5];
  const account5 = accounts[6];

  const firstTokenId = 0;
  const secondTokenId = 1;
  const unknownTokenId = 2;

  const benefactorEFF = 1;
  const benefactorFPF = 2;

  const cardOne = 1;
  const cardTwo = 2;

  const message = 'Happy Xmas';
  const extra = 'FFFFFF';

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

    await this.token.addBenefactor(
      3,
      "0x59459B87c29167733818f1263665064Cadf10eE4",
      "Open Money Initiative",
      "https://www.openmoneyinitiative.org/",
      "https://ipfs.infura.io/ipfs/Qmc8oRTHBLRNif4b6F9S5KxmZF7AoPaQrQgBeBudTsXUAC"
    );

    await this.token.addCard(cardOne, "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy", true);
    await this.token.addCard(cardTwo, "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy", true);
  });

  describe('like an ERC721', function () {
    beforeEach(async function () {
      await this.token.gift(account1, benefactorEFF, cardOne, message, extra, {from: owner, value: this.minContribution});
      await this.token.gift(account1, benefactorFPF, cardTwo, message, extra, {from: owner, value: this.minContribution});
    });

    describe('balanceOf', function () {
      context('when the given address owns some tokens', function () {
        it('returns the amount of tokens owned by the given address', async function () {
          (await this.token.balanceOf(account1)).should.be.bignumber.equal(2);
        });
      });

      context('when the given address does not own any tokens', function () {
        it('returns 0', async function () {
          (await this.token.balanceOf(account2)).should.be.bignumber.equal(0);
        });
      });

      context('when querying the zero address', function () {
        it('throws', async function () {
          await assertRevert(this.token.balanceOf(0));
        });
      });
    });

    describe('ownerOf', function () {
      context('when the given token ID was tracked by this token', function () {
        const tokenId = firstTokenId;

        it('returns the owner of the given token ID', async function () {
          (await this.token.ownerOf(tokenId)).should.be.equal(account1);
        });
      });

      context('when the given token ID was not tracked by this token', function () {
        const tokenId = unknownTokenId;

        it('reverts', async function () {
          await assertRevert(this.token.ownerOf(tokenId));
        });
      });
    });

    describe('transfers', function () {
      const tokenId = firstTokenId;
      const data = '0x42';

      const owner = account1;
      const approved = account2;
      const operator = account3;
      const anyone = account4;

      beforeEach(async function () {
        await this.token.approve(approved, tokenId, {from: owner});
        await this.token.setApprovalForAll(operator, true, {from: owner});
        this.toWhom = account4;
      });

      const shouldTransferTokensByUsers = function (transferFunction) {
        let logs = null;

        context('when called by the owner', function () {
          beforeEach(async function () {
            ({logs} = await transferFunction.call(this, owner, this.toWhom, tokenId, {from: owner}));
          });

          it('transfers the ownership of the given token ID to the given address', async function () {
            (await this.token.ownerOf(tokenId)).should.be.equal(this.toWhom);
          });

          it('clears the approval for the token ID', async function () {
            (await this.token.getApproved(tokenId)).should.be.equal(ZERO_ADDRESS);
          });

          it('emit only a transfer event', async function () {
            logs.length.should.be.equal(1);
            logs[0].event.should.be.equal('Transfer');
            logs[0].args._from.should.be.equal(owner);
            logs[0].args._to.should.be.equal(this.toWhom);
            logs[0].args._tokenId.should.be.bignumber.equal(tokenId);
          });

          it('adjusts owners balances', async function () {
            (await this.token.balanceOf(owner)).should.be.bignumber.equal(1);
          });

          it('adjusts owners tokens by index', async function () {
            if (!this.token.tokenOfOwnerByIndex) return;

            (await this.token.tokenOfOwnerByIndex(this.toWhom, 0)).toNumber().should.be.equal(tokenId);

            (await this.token.tokenOfOwnerByIndex(owner, 0)).toNumber().should.not.be.equal(tokenId);
          });
        });

        context('when called by the approved individual', function () {
          beforeEach(async function () {
            ({logs} = await transferFunction.call(this, owner, this.toWhom, tokenId, {from: approved}));
          });

          it('transfers the ownership of the given token ID to the given address', async function () {
            (await this.token.ownerOf(tokenId)).should.be.equal(this.toWhom);
          });

          it('clears the approval for the token ID', async function () {
            (await this.token.getApproved(tokenId)).should.be.equal(ZERO_ADDRESS);
          });

          it('emit only a transfer event', async function () {
            logs.length.should.be.equal(1);
            logs[0].event.should.be.equal('Transfer');
            logs[0].args._from.should.be.equal(owner);
            logs[0].args._to.should.be.equal(this.toWhom);
            logs[0].args._tokenId.should.be.bignumber.equal(tokenId);
          });

          it('adjusts owners balances', async function () {
            (await this.token.balanceOf(owner)).should.be.bignumber.equal(1);
          });

          it('adjusts owners tokens by index', async function () {
            if (!this.token.tokenOfOwnerByIndex) return;

            (await this.token.tokenOfOwnerByIndex(this.toWhom, 0)).toNumber().should.be.equal(tokenId);

            (await this.token.tokenOfOwnerByIndex(owner, 0)).toNumber().should.not.be.equal(tokenId);
          });
        });

        context('when called by the operator', function () {
          beforeEach(async function () {
            ({logs} = await transferFunction.call(this, owner, this.toWhom, tokenId, {from: operator}));
          });

          it('transfers the ownership of the given token ID to the given address', async function () {
            (await this.token.ownerOf(tokenId)).should.be.equal(this.toWhom);
          });

          it('clears the approval for the token ID', async function () {
            (await this.token.getApproved(tokenId)).should.be.equal(ZERO_ADDRESS);
          });

          it('emit only a transfer event', async function () {
            logs.length.should.be.equal(1);
            logs[0].event.should.be.equal('Transfer');
            logs[0].args._from.should.be.equal(owner);
            logs[0].args._to.should.be.equal(this.toWhom);
            logs[0].args._tokenId.should.be.bignumber.equal(tokenId);
          });

          it('adjusts owners balances', async function () {
            (await this.token.balanceOf(owner)).should.be.bignumber.equal(1);
          });

          it('adjusts owners tokens by index', async function () {
            if (!this.token.tokenOfOwnerByIndex) return;

            (await this.token.tokenOfOwnerByIndex(this.toWhom, 0)).toNumber().should.be.equal(tokenId);

            (await this.token.tokenOfOwnerByIndex(owner, 0)).toNumber().should.not.be.equal(tokenId);
          });
        });

        context('when called by the owner without an approved user', function () {
          beforeEach(async function () {
            await this.token.approve(ZERO_ADDRESS, tokenId, {from: owner});
            ({logs} = await transferFunction.call(this, owner, this.toWhom, tokenId, {from: operator}));
          });

          it('transfers the ownership of the given token ID to the given address', async function () {
            (await this.token.ownerOf(tokenId)).should.be.equal(this.toWhom);
          });

          it('clears the approval for the token ID', async function () {
            (await this.token.getApproved(tokenId)).should.be.equal(ZERO_ADDRESS);
          });

          it('emits only a transfer event', async function () {
            logs.length.should.be.equal(1);
            logs[0].event.should.be.equal('Transfer');
            logs[0].args._from.should.be.equal(owner);
            logs[0].args._to.should.be.equal(this.toWhom);
            logs[0].args._tokenId.should.be.bignumber.equal(tokenId);
          });

          it('adjusts owners balances', async function () {
            (await this.token.balanceOf(owner)).should.be.bignumber.equal(1);
          });

          it('adjusts owners tokens by index', async function () {
            if (!this.token.tokenOfOwnerByIndex) return;

            (await this.token.tokenOfOwnerByIndex(this.toWhom, 0)).toNumber().should.be.equal(tokenId);

            (await this.token.tokenOfOwnerByIndex(owner, 0)).toNumber().should.not.be.equal(tokenId);
          });
        });

        context('when sent to the owner', function () {
          beforeEach(async function () {
            ({logs} = await transferFunction.call(this, owner, owner, tokenId, {from: owner}));
          });

          it('keeps ownership of the token', async function () {
            (await this.token.ownerOf(tokenId)).should.be.equal(owner);
          });

          it('clears the approval for the token ID', async function () {
            (await this.token.getApproved(tokenId)).should.be.equal(ZERO_ADDRESS);
          });

          it('emits only a transfer event', async function () {
            logs.length.should.be.equal(1);
            logs[0].event.should.be.equal('Transfer');
            logs[0].args._from.should.be.equal(owner);
            logs[0].args._to.should.be.equal(owner);
            logs[0].args._tokenId.should.be.bignumber.equal(tokenId);
          });

          it('keeps the owner balance', async function () {
            (await this.token.balanceOf(owner)).should.be.bignumber.equal(2);
          });

          it('keeps same tokens by index', async function () {
            if (!this.token.tokenOfOwnerByIndex) return;
            const tokensListed = await Promise.all(_.range(2).map(i => this.token.tokenOfOwnerByIndex(owner, i)));
            tokensListed.map(t => t.toNumber()).should.have.members([firstTokenId, secondTokenId]);
          });
        });

        context('when the address of the previous owner is incorrect', function () {
          it('reverts', async function () {
            await assertRevert(transferFunction.call(this, anyone, anyone, tokenId, {from: owner})
            );
          });
        });

        context('when the sender is not authorized for the token id', function () {
          it('reverts', async function () {
            await assertRevert(transferFunction.call(this, owner, anyone, tokenId, {from: anyone})
            );
          });
        });

        context('when the given token ID does not exist', function () {
          it('reverts', async function () {
            await assertRevert(transferFunction.call(this, owner, anyone, unknownTokenId, {from: owner})
            );
          });
        });

        context('when the address to transfer the token to is the zero address', function () {
          it('reverts', async function () {
            await assertRevert(transferFunction.call(this, owner, ZERO_ADDRESS, tokenId, {from: owner}));
          });
        });
      };

      describe('via transferFrom', function () {
        shouldTransferTokensByUsers(function (from, to, tokenId, opts) {
          return this.token.transferFrom(from, to, tokenId, opts);
        });
      });

      describe('via safeTransferFrom', function () {
        const safeTransferFromWithData = function (from, to, tokenId, opts) {
          return sendTransaction(
            this.token,
            'safeTransferFrom',
            'address,address,uint256,bytes',
            [from, to, tokenId, data],
            opts
          );
        };

        const safeTransferFromWithoutData = function (from, to, tokenId, opts) {
          return this.token.safeTransferFrom(from, to, tokenId, opts);
        };

        const shouldTransferSafely = function (transferFun, data) {
          describe('to a user account', function () {
            shouldTransferTokensByUsers(transferFun);
          });

          describe('to a valid receiver contract', function () {
            beforeEach(async function () {
              this.receiver = await ERC721Receiver.new(RECEIVER_MAGIC_VALUE, false);
              this.toWhom = this.receiver.address;
            });

            shouldTransferTokensByUsers(transferFun);

            it('should call onERC721Received', async function () {
              const result = await transferFun.call(this, owner, this.receiver.address, tokenId, {from: owner});
              result.receipt.logs.length.should.be.equal(2);
              // const [log] = decodeLogs([result.receipt.logs[1]], ERC721Receiver, this.receiver.address);
              // log.event.should.be.equal('Received');
              // log.args.operator.should.be.equal(owner);
              // log.args.from.should.be.equal(owner);
              // log.args.tokenId.toNumber().should.be.equal(tokenId);
              // log.args.data.should.be.equal(data);
            });

            it('should call onERC721Received from approved', async function () {
              const result = await transferFun.call(this, owner, this.receiver.address, tokenId, {
                from: approved,
              });
              result.receipt.logs.length.should.be.equal(2);
              // const [log] = decodeLogs(
              //   [result.receipt.logs[1]],
              //   ERC721Receiver,
              //   this.receiver.address
              // );
              // log.event.should.be.equal('Received');
              // log.args.operator.should.be.equal(approved);
              // log.args.from.should.be.equal(owner);
              // log.args.tokenId.toNumber().should.be.equal(tokenId);
              // log.args.data.should.be.equal(data);
            });

            describe('with an invalid token id', function () {
              it('reverts', async function () {
                await assertRevert(
                  transferFun.call(
                    this,
                    owner,
                    this.receiver.address,
                    unknownTokenId,
                    {from: owner},
                  )
                );
              });
            });
          });
        };

        describe('with data', function () {
          shouldTransferSafely(safeTransferFromWithData, data);
        });

        describe('without data', function () {
          shouldTransferSafely(safeTransferFromWithoutData, '0x');
        });

        describe('to a receiver contract returning unexpected value', function () {
          it('reverts', async function () {
            const invalidReceiver = await ERC721Receiver.new('0x42', false);
            await assertRevert(this.token.safeTransferFrom(owner, invalidReceiver.address, tokenId, {from: owner}));
          });
        });

        describe('to a receiver contract that throws', function () {
          it('reverts', async function () {
            const invalidReceiver = await ERC721Receiver.new(RECEIVER_MAGIC_VALUE, true);
            await assertRevert(this.token.safeTransferFrom(owner, invalidReceiver.address, tokenId, {from: owner}));
          });
        });

        describe('to a contract that does not implement the required function', function () {
          it('reverts', async function () {
            const invalidReceiver = this.token;
            await assertRevert(this.token.safeTransferFrom(owner, invalidReceiver.address, tokenId, {from: owner}));
          });
        });
      });
    });

    describe('approve', function () {
      const tokenId = firstTokenId;

      const owner = account1;
      const approved = account2;
      const operator = account3;
      const anotherApproved = account4;
      const anyone = account5;

      let logs = null;

      const itClearsApproval = function () {
        it('clears approval for the token', async function () {
          (await this.token.getApproved(tokenId)).should.be.equal(ZERO_ADDRESS);
        });
      };

      const itApproves = function (address) {
        it('sets the approval for the target address', async function () {
          (await this.token.getApproved(tokenId)).should.be.equal(address);
        });
      };

      const itEmitsApprovalEvent = function (address) {
        it('emits an approval event', async function () {
          logs.length.should.be.equal(1);
          logs[0].event.should.be.equal('Approval');
          logs[0].args._owner.should.be.equal(owner);
          logs[0].args._approved.should.be.equal(address);
          logs[0].args._tokenId.should.be.bignumber.equal(tokenId);
        });
      };

      context('when clearing approval', function () {
        context('when there was no prior approval', function () {
          beforeEach(async function () {
            ({logs} = await this.token.approve(ZERO_ADDRESS, tokenId, {from: owner}));
          });

          itClearsApproval();
          itEmitsApprovalEvent(ZERO_ADDRESS);
        });

        context('when there was a prior approval', function () {
          beforeEach(async function () {
            await this.token.approve(approved, tokenId, {from: owner});
            ({logs} = await this.token.approve(ZERO_ADDRESS, tokenId, {from: owner}));
          });

          itClearsApproval();
          itEmitsApprovalEvent(ZERO_ADDRESS);
        });
      });

      context('when approving a non-zero address', function () {
        context('when there was no prior approval', function () {
          beforeEach(async function () {
            ({logs} = await this.token.approve(approved, tokenId, {from: owner}));
          });

          itApproves(approved);
          itEmitsApprovalEvent(approved);
        });

        context('when there was a prior approval to the same address', function () {
          beforeEach(async function () {
            await this.token.approve(approved, tokenId, {from: owner});
            ({logs} = await this.token.approve(approved, tokenId, {from: owner}));
          });

          itApproves(approved);
          itEmitsApprovalEvent(approved);
        });

        context('when there was a prior approval to a different address', function () {
          beforeEach(async function () {
            await this.token.approve(anotherApproved, tokenId, {from: owner});
            ({logs} = await this.token.approve(anotherApproved, tokenId, {from: owner}));
          });

          itApproves(anotherApproved);
          itEmitsApprovalEvent(anotherApproved);
        });
      });

      context('when the address that receives the approval is the owner', function () {
        it('reverts', async function () {
          await assertRevert(
            this.token.approve(owner, tokenId, {from: owner})
          );
        });
      });

      context('when the sender does not own the given token ID', function () {
        it('reverts', async function () {
          await assertRevert(this.token.approve(approved, tokenId, {from: anyone}));
        });
      });

      context('when the sender is approved for the given token ID', function () {
        it('reverts', async function () {
          await this.token.approve(approved, tokenId, {from: owner});
          await assertRevert(this.token.approve(anotherApproved, tokenId, {from: approved}));
        });
      });

      context('when the sender is an operator', function () {
        beforeEach(async function () {
          await this.token.setApprovalForAll(operator, true, {from: owner});
          ({logs} = await this.token.approve(approved, tokenId, {from: operator}));
        });

        itApproves(approved);
        itEmitsApprovalEvent(approved);
      });

      context('when the given token ID does not exist', function () {
        it('reverts', async function () {
          await assertRevert(this.token.approve(approved, unknownTokenId, {from: operator}));
        });
      });
    });

    describe('setApprovalForAll', function () {

      const owner = account1;
      const operator = account3;

      context('when the operator willing to approve is not the owner', function () {
        context('when there is no operator approval set by the sender', function () {
          it('approves the operator', async function () {
            await this.token.setApprovalForAll(operator, true, {from: owner});

            (await this.token.isApprovedForAll(owner, operator)).should.equal(true);
          });

          it('emits an approval event', async function () {
            const {logs} = await this.token.setApprovalForAll(operator, true, {from: owner});

            logs.length.should.be.equal(1);
            logs[0].event.should.be.equal('ApprovalForAll');
            logs[0].args._owner.should.be.equal(owner);
            logs[0].args._operator.should.be.equal(operator);
            logs[0].args._approved.should.equal(true);
          });
        });

        context('when the operator was set as not approved', function () {
          beforeEach(async function () {
            await this.token.setApprovalForAll(operator, false, {from: owner});
          });

          it('approves the operator', async function () {
            await this.token.setApprovalForAll(operator, true, {from: owner});

            (await this.token.isApprovedForAll(owner, operator)).should.equal(true);
          });

          it('emits an approval event', async function () {
            const {logs} = await this.token.setApprovalForAll(operator, true, {from: owner});

            logs.length.should.be.equal(1);
            logs[0].event.should.be.equal('ApprovalForAll');
            logs[0].args._owner.should.be.equal(owner);
            logs[0].args._operator.should.be.equal(operator);
            logs[0].args._approved.should.equal(true);
          });

          it('can unset the operator approval', async function () {
            await this.token.setApprovalForAll(operator, false, {from: owner});

            (await this.token.isApprovedForAll(owner, operator)).should.equal(false);
          });
        });

        context('when the operator was already approved', function () {
          beforeEach(async function () {
            await this.token.setApprovalForAll(operator, true, {from: owner});
          });

          it('keeps the approval to the given address', async function () {
            await this.token.setApprovalForAll(operator, true, {from: owner});

            (await this.token.isApprovedForAll(owner, operator)).should.equal(true);
          });

          it('emits an approval event', async function () {
            const {logs} = await this.token.setApprovalForAll(operator, true, {from: owner});

            logs.length.should.be.equal(1);
            logs[0].event.should.be.equal('ApprovalForAll');
            logs[0].args._owner.should.be.equal(owner);
            logs[0].args._operator.should.be.equal(operator);
            logs[0].args._approved.should.equal(true);
          });
        });
      });

      context('when the operator is the owner', function () {
        it('reverts', async function () {
          await assertRevert(this.token.setApprovalForAll(owner, true, {from: owner}));
        });
      });
    });
  });

  shouldBehaveLikeERC721(account1, owner, accounts);

  shouldBehaveLikeMintAndBurnERC721(owner, [account1, account2, account3, account4]);

  shouldSupportInterfaces([
    'ERC165',
    'ERC721',
    'ERC721Exists',
    'ERC721Enumerable',
    'ERC721Metadata',
  ]);

});
