import { Auction } from '../wrappers/rgbAuction';
import { AuctionState } from '../state/slices/auction';
import { BigNumber } from '@ethersproject/bignumber';

export const isRgbfounderRgb = (rgbId: BigNumber) => {
  return rgbId.mod(10).eq(0) || rgbId.eq(0);
};

const emptyRgbfounderAuction = (onDisplayAuctionId: number): Auction => {
  return {
    amount: BigNumber.from(0).toJSON(),
    bidder: '',
    startTime: BigNumber.from(0).toJSON(),
    endTime: BigNumber.from(0).toJSON(),
    rgbId: BigNumber.from(onDisplayAuctionId).toJSON(),
    settled: false,
  };
};

const findAuction = (id: BigNumber, auctions: AuctionState[]): Auction | undefined => {
  return auctions.find(auction => {
    return BigNumber.from(auction.activeAuction?.rgbId).eq(id);
  })?.activeAuction;
};

/**
 *
 * @param rgbId
 * @param pastAuctions
 * @returns empty `Auction` object with `startTime` set to auction after param `rgbId`
 */
export const generateEmptyRgbfounderAuction = (
  rgbId: BigNumber,
  pastAuctions: AuctionState[],
): Auction => {
  const rgbfounderAuction = emptyRgbfounderAuction(rgbId.toNumber());
  // use rgbfounderAuction.rgbId + 1 to get mint time
  const auctionAbove = findAuction(rgbId.add(1), pastAuctions);
  const auctionAboveStartTime = auctionAbove && BigNumber.from(auctionAbove.startTime);
  if (auctionAboveStartTime) rgbfounderAuction.startTime = auctionAboveStartTime.toJSON();

  return rgbfounderAuction;
};
