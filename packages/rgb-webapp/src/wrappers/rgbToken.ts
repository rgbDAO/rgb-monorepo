import { useContractCall, useEthers } from '@usedapp/core';
import { BigNumber as EthersBN, utils } from 'ethers';
import { RgbTokenABI } from '@rgbdao/contracts';
import config from '../config';

interface RgbToken {
  name: string;
  description: string;
  image: string;
}

export interface IRgbSeed {
  accessory: number;
  background: number;
  body: number;
  glasses: number;
  head: number;
}

const abi = new utils.Interface(RgbTokenABI);

export const useRgbToken = (rgbId: EthersBN) => {
  const [rgb] =
    useContractCall<[string]>({
      abi,
      address: config.addresses.rgbToken,
      method: 'dataURI',
      args: [rgbId],
    }) || [];

  if (!rgb) {
    return;
  }

  const rgbImgData = rgb.split(';base64,').pop() as string;
  const json: RgbToken = JSON.parse(atob(rgbImgData));

  return json;
};

export const useRgbSeed = (rgbId: EthersBN) => {
  const seed = useContractCall<IRgbSeed>({
    abi,
    address: config.addresses.rgbToken,
    method: 'seeds',
    args: [rgbId],
  });
  return seed;
};

export const useUserVotes = (): number | undefined => {
  const { account } = useEthers();
  const [votes] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.rgbToken,
      method: 'getCurrentVotes',
      args: [account],
    }) || [];
  return votes?.toNumber();
};

export const useUserDelegatee = (): string | undefined => {
  const { account } = useEthers();
  const [delegate] =
    useContractCall<[string]>({
      abi,
      address: config.addresses.rgbToken,
      method: 'delegates',
      args: [account],
    }) || [];
  return delegate;
};

export const useUserVotesAsOfBlock = (block: number | undefined): number | undefined => {
  const { account } = useEthers();

  // Check for available votes
  const [votes] =
    useContractCall<[EthersBN]>({
      abi,
      address: config.addresses.rgbToken,
      method: 'getPriorVotes',
      args: [account, block],
    }) || [];
  return votes?.toNumber();
};
