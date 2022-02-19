import { BigNumber } from 'ethers';
import Banner from '../../components/Banner';
import Auction from '../../components/Auction';
import Documentation from '../../components/Documentation';
import HistoryCollection from '../../components/HistoryCollection';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setOnDisplayAuctionRgbId } from '../../state/slices/onDisplayAuction';
import { push } from 'connected-react-router';
import { rgbPath } from '../../utils/history';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';
import { useEffect } from 'react';

interface AuctionPageProps {
  initialAuctionId?: number;
}

const AuctionPage: React.FC<AuctionPageProps> = props => {
  const { initialAuctionId } = props;
  const onDisplayAuction = useOnDisplayAuction();
  const lastAuctionRgbId = useAppSelector(state => state.onDisplayAuction.lastAuctionRgbId);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!lastAuctionRgbId) return;

    if (initialAuctionId !== undefined) {
      // handle out of bounds rgb path ids
      if (initialAuctionId > lastAuctionRgbId || initialAuctionId < 0) {
        dispatch(setOnDisplayAuctionRgbId(lastAuctionRgbId));
        dispatch(push(rgbPath(lastAuctionRgbId)));
      } else {
        if (onDisplayAuction === undefined) {
          // handle regular rgb path ids on first load
          dispatch(setOnDisplayAuctionRgbId(initialAuctionId));
        }
      }
    } else {
      // no rgb path id set
      if (lastAuctionRgbId) {
        dispatch(setOnDisplayAuctionRgbId(lastAuctionRgbId));
      }
    }
  }, [lastAuctionRgbId, dispatch, initialAuctionId, onDisplayAuction]);

  return (
    <>
      <Auction auction={onDisplayAuction} />
      <Banner />
      {lastAuctionRgbId && (
        <HistoryCollection latestRgbId={BigNumber.from(lastAuctionRgbId)} historyCount={10} />
      )}
      <Documentation />
    </>
  );
};
export default AuctionPage;
