import {
  RgbTokenFactory,
  RgbAuctionHouseFactory,
  RgbDescriptorFactory,
  RgbSeederFactory,
  RgbDaoLogicV1Factory,
} from '@rgbdao/contracts';
import type { Signer } from 'ethers';
import type { Provider } from '@ethersproject/providers';
import { getContractAddressesForChainOrThrow } from './addresses';
import { Contracts } from './types';

/**
 * Get contract instances that target the Ethereum mainnet
 * or a supported testnet. Throws if there are no known contracts
 * deployed on the corresponding chain.
 * @param chainId The desired chain id
 * @param signerOrProvider The ethers v5 signer or provider
 */
export const getContractsForChainOrThrow = (
  chainId: number,
  signerOrProvider?: Signer | Provider,
): Contracts => {
  const addresses = getContractAddressesForChainOrThrow(chainId);

  return {
    rgbTokenContract: RgbTokenFactory.connect(
      addresses.rgbToken,
      signerOrProvider as Signer | Provider,
    ),
    rgbAuctionHouseContract: RgbAuctionHouseFactory.connect(
      addresses.rgbAuctionHouseProxy,
      signerOrProvider as Signer | Provider,
    ),
    rgbDescriptorContract: RgbDescriptorFactory.connect(
      addresses.rgbDescriptor,
      signerOrProvider as Signer | Provider,
    ),
    rgbSeederContract: RgbSeederFactory.connect(
      addresses.rgbSeeder,
      signerOrProvider as Signer | Provider,
    ),
    rgbDaoContract: RgbDaoLogicV1Factory.connect(
      addresses.rgbDAOProxy,
      signerOrProvider as Signer | Provider,
    ),
  };
};
