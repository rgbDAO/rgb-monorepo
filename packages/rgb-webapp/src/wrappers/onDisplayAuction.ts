import { BigNumber } from '@ethersproject/bignumber';
import { useAppSelector } from '../hooks';
import { generateEmptyRgbfounderAuction, isRgbfounderRgb } from '../utils/rgbfounderRgb';
import { Bid, BidEvent } from '../utils/types';
import { Auction } from './rgbAuction';

const deserializeAuction = (reduxSafeAuction: Auction): Auction => {
  return {
    amount: BigNumber.from(reduxSafeAuction.amount),
    bidder: reduxSafeAuction.bidder,
    startTime: BigNumber.from(reduxSafeAuction.startTime),
    endTime: BigNumber.from(reduxSafeAuction.endTime),
    rgbId: BigNumber.from(reduxSafeAuction.rgbId),
    settled: false,
  };
};

const deserializeBid = (reduxSafeBid: BidEvent): Bid => {
  return {
    rgbId: BigNumber.from(reduxSafeBid.rgbId),
    sender: reduxSafeBid.sender,
    value: BigNumber.from(reduxSafeBid.value),
    extended: reduxSafeBid.extended,
    transactionHash: reduxSafeBid.transactionHash,
    timestamp: BigNumber.from(reduxSafeBid.timestamp),
  };
};
const deserializeBids = (reduxSafeBids: BidEvent[]): Bid[] => {
  return reduxSafeBids
    .map(bid => deserializeBid(bid))
    .sort((a: Bid, b: Bid) => {
      return b.timestamp.toNumber() - a.timestamp.toNumber();
    });
};

const useOnDisplayAuction = (): Auction | undefined => {
  const lastAuctionRgbId = useAppSelector(state => state.auction.activeAuction?.rgbId);
  const onDisplayAuctionRgbId = useAppSelector(
    state => state.onDisplayAuction.onDisplayAuctionRgbId,
  );
  const currentAuction = useAppSelector(state => state.auction.activeAuction);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  if (
    onDisplayAuctionRgbId === undefined ||
    lastAuctionRgbId === undefined ||
    currentAuction === undefined ||
    !pastAuctions
  )
    return undefined;

  // current auction
  if (BigNumber.from(onDisplayAuctionRgbId).eq(lastAuctionRgbId)) {
    return deserializeAuction(currentAuction);
  } else {
    // rgbfounder auction
    if (isRgbfounderRgb(BigNumber.from(onDisplayAuctionRgbId))) {
      const emptyRgbfounderAuction = generateEmptyRgbfounderAuction(
        BigNumber.from(onDisplayAuctionRgbId),
        pastAuctions,
      );

      return deserializeAuction(emptyRgbfounderAuction);
    } else {
      // past auction
      const reduxSafeAuction: Auction | undefined = pastAuctions.find(auction => {
        const rgbId = auction.activeAuction && BigNumber.from(auction.activeAuction.rgbId);
        return rgbId && rgbId.toNumber() === onDisplayAuctionRgbId;
      })?.activeAuction;

      return reduxSafeAuction ? deserializeAuction(reduxSafeAuction) : undefined;
    }
  }
};

export const useAuctionBids = (auctionRgbId: BigNumber): Bid[] | undefined => {
  const lastAuctionRgbId = useAppSelector(state => state.onDisplayAuction.lastAuctionRgbId);
  const lastAuctionBids = useAppSelector(state => state.auction.bids);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  // auction requested is active auction
  if (lastAuctionRgbId === auctionRgbId.toNumber()) {
    return deserializeBids(lastAuctionBids);
  } else {
    // find bids for past auction requested
    const bidEvents: BidEvent[] | undefined = pastAuctions.find(auction => {
      const rgbId = auction.activeAuction && BigNumber.from(auction.activeAuction.rgbId);
      return rgbId && rgbId.eq(auctionRgbId);
    })?.bids;

    return bidEvents && deserializeBids(bidEvents);
  }
};

export default useOnDisplayAuction;
