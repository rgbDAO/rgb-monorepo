import {
  RgbTokenFactory,
  RgbAuctionHouseFactory,
  RgbDescriptorFactory,
  RgbSeederFactory,
  RgbDaoLogicV1Factory,
} from '@rgbdao/contracts';

export interface ContractAddresses {
  rgbToken: string;
  rgbSeeder: string;
  rgbDescriptor: string;
  nftDescriptor: string;
  rgbAuctionHouse: string;
  rgbAuctionHouseProxy: string;
  rgbAuctionHouseProxyAdmin: string;
  rgbDaoExecutor: string;
  rgbDAOProxy: string;
  rgbDAOLogicV1: string;
}

export interface Contracts {
  rgbTokenContract: ReturnType<typeof RgbTokenFactory.connect>;
  rgbAuctionHouseContract: ReturnType<typeof RgbAuctionHouseFactory.connect>;
  rgbDescriptorContract: ReturnType<typeof RgbDescriptorFactory.connect>;
  rgbSeederContract: ReturnType<typeof RgbSeederFactory.connect>;
  rgbDaoContract: ReturnType<typeof RgbDaoLogicV1Factory.connect>;
}

export enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Kovan = 42,
  Local = 31337,
}
