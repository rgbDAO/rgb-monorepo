import { task, types } from 'hardhat/config';

task('mint-rgb', 'Mints a Rgb')
  .addOptionalParam(
    'rgbToken',
    'The `RgbToken` contract address',
    '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    types.string,
  )
  .setAction(async ({ rgbToken }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('RgbToken');
    const nftContract = nftFactory.attach(rgbToken);

    const receipt = await (await nftContract.mint()).wait();
    const rgbCreated = receipt.events?.[1];
    const { tokenId } = rgbCreated?.args;

    console.log(`Rgb minted with ID: ${tokenId.toString()}.`);
  });
