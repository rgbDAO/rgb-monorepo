import chai from 'chai';
import { ethers } from 'hardhat';
import { BigNumber as EthersBN, constants } from 'ethers';
import { solidity } from 'ethereum-waffle';
import { RgbDescriptor__factory as RgbDescriptorFactory, RgbToken } from '../typechain';
import { deployRgbToken, populateDescriptor } from './utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);
const { expect } = chai;

describe('RgbToken', () => {
  let rgbToken: RgbToken;
  let deployer: SignerWithAddress;
  let rgbfoundersDAO: SignerWithAddress;
  let snapshotId: number;

  before(async () => {
    [deployer, rgbfoundersDAO] = await ethers.getSigners();
    rgbToken = await deployRgbToken(deployer, rgbfoundersDAO.address, deployer.address);

    const descriptor = await rgbToken.descriptor();

    await populateDescriptor(RgbDescriptorFactory.connect(descriptor, deployer));
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should allow the minter to mint a rgb to itself and a reward rgb to the rgbfoundersDAO', async () => {
    const receipt = await (await rgbToken.mint()).wait();

    const [, , , rgbfoundersRgbCreated, , , , ownersRgbCreated] = receipt.events || [];

    expect(await rgbToken.ownerOf(0)).to.eq(rgbfoundersDAO.address);
    expect(rgbfoundersRgbCreated?.event).to.eq('RgbCreated');
    expect(rgbfoundersRgbCreated?.args?.tokenId).to.eq(0);
    expect(rgbfoundersRgbCreated?.args?.seed.length).to.equal(5);

    expect(await rgbToken.ownerOf(1)).to.eq(deployer.address);
    expect(ownersRgbCreated?.event).to.eq('RgbCreated');
    expect(ownersRgbCreated?.args?.tokenId).to.eq(1);
    expect(ownersRgbCreated?.args?.seed.length).to.equal(5);

    rgbfoundersRgbCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });

    ownersRgbCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });
  });

  it('should set symbol', async () => {
    expect(await rgbToken.symbol()).to.eq('RGB');
  });

  it('should set name', async () => {
    expect(await rgbToken.name()).to.eq('Rgb');
  });

  it('should allow minter to mint a rgb to itself', async () => {
    await (await rgbToken.mint()).wait();

    const receipt = await (await rgbToken.mint()).wait();
    const rgbCreated = receipt.events?.[3];

    expect(await rgbToken.ownerOf(2)).to.eq(deployer.address);
    expect(rgbCreated?.event).to.eq('RgbCreated');
    expect(rgbCreated?.args?.tokenId).to.eq(2);
    expect(rgbCreated?.args?.seed.length).to.equal(5);

    rgbCreated?.args?.seed.forEach((item: EthersBN | number) => {
      const value = typeof item !== 'number' ? item?.toNumber() : item;
      expect(value).to.be.a('number');
    });
  });

  it('should emit two transfer logs on mint', async () => {
    const [, , creator, minter] = await ethers.getSigners();

    await (await rgbToken.mint()).wait();

    await (await rgbToken.setMinter(minter.address)).wait();
    await (await rgbToken.transferOwnership(creator.address)).wait();

    const tx = rgbToken.connect(minter).mint();

    await expect(tx)
      .to.emit(rgbToken, 'Transfer')
      .withArgs(constants.AddressZero, creator.address, 2);
    await expect(tx).to.emit(rgbToken, 'Transfer').withArgs(creator.address, minter.address, 2);
  });

  it('should allow minter to burn a rgb', async () => {
    await (await rgbToken.mint()).wait();

    const tx = rgbToken.burn(0);
    await expect(tx).to.emit(rgbToken, 'RgbBurned').withArgs(0);
  });

  it('should revert on non-minter mint', async () => {
    const account0AsRgbErc721Account = rgbToken.connect(rgbfoundersDAO);
    await expect(account0AsRgbErc721Account.mint()).to.be.reverted;
  });

  describe('contractURI', async () => {
    it('should return correct contractURI', async () => {
      expect(await rgbToken.contractURI()).to.eq(
        'ipfs://QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX',
      );
    });
    it('should allow owner to set contractURI', async () => {
      await rgbToken.setContractURIHash('ABC123');
      expect(await rgbToken.contractURI()).to.eq('ipfs://ABC123');
    });
    it('should not allow non owner to set contractURI', async () => {
      const [, nonOwner] = await ethers.getSigners();
      await expect(rgbToken.connect(nonOwner).setContractURIHash('BAD')).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });
  });
});
