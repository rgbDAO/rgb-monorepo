import { Col } from 'react-bootstrap';
import { StandaloneRgbWithSeed } from '../StandaloneRgb';
import AuctionActivity from '../AuctionActivity';
import { Row, Container } from 'react-bootstrap';
import { setStateBackgroundColor } from '../../state/slices/application';
import { LoadingRgb } from '../Rgb';
import { Auction as IAuction } from '../../wrappers/rgbAuction';
import classes from './Auction.module.css';
import { IRgbSeed } from '../../wrappers/rgbToken';
import RgbfounderRgbContent from '../RgbfounderRgbContent';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { isRgbfounderRgb } from '../../utils/rgbfounderRgb';
import {
  setNextOnDisplayAuctionRgbId,
  setPrevOnDisplayAuctionRgbId,
} from '../../state/slices/onDisplayAuction';
import { beige, grey } from '../../utils/rgbBgColors';

interface AuctionProps {
  auction?: IAuction;
}

const Auction: React.FC<AuctionProps> = props => {
  const { auction: currentAuction } = props;

  const history = useHistory();
  const dispatch = useAppDispatch();
  let stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  const lastRgbId = useAppSelector(state => state.onDisplayAuction.lastAuctionRgbId);

  const loadedRgbHandler = (seed: IRgbSeed) => {
    dispatch(setStateBackgroundColor(seed.background === 0 ? grey : beige));
  };

  const prevAuctionHandler = () => {
    dispatch(setPrevOnDisplayAuctionRgbId());
    currentAuction && history.push(`/auction/${currentAuction.rgbId.toNumber() - 1}`);
  };
  const nextAuctionHandler = () => {
    dispatch(setNextOnDisplayAuctionRgbId());
    currentAuction && history.push(`/auction/${currentAuction.rgbId.toNumber() + 1}`);
  };

  const rgbContent = currentAuction && (
    <div className={classes.rgbWrapper}>
      <StandaloneRgbWithSeed
        rgbId={currentAuction.rgbId}
        onLoadSeed={loadedRgbHandler}
        shouldLinkToProfile={false}
      />
    </div>
  );

  const loadingRgb = (
    <div className={classes.rgbWrapper}>
      <LoadingRgb />
    </div>
  );

  const currentAuctionActivityContent = currentAuction && lastRgbId && (
    <AuctionActivity
      auction={currentAuction}
      isFirstAuction={currentAuction.rgbId.eq(0)}
      isLastAuction={currentAuction.rgbId.eq(lastRgbId)}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
      displayGraphDepComps={true}
    />
  );
  const rgbfounderRgbContent = currentAuction && lastRgbId && (
    <RgbfounderRgbContent
      mintTimestamp={currentAuction.startTime}
      rgbId={currentAuction.rgbId}
      isFirstAuction={currentAuction.rgbId.eq(0)}
      isLastAuction={currentAuction.rgbId.eq(lastRgbId)}
      onPrevAuctionClick={prevAuctionHandler}
      onNextAuctionClick={nextAuctionHandler}
    />
  );

  return (
    <div style={{ backgroundColor: stateBgColor }}>
      <Container fluid="lg">
        <Row>
          <Col lg={{ span: 6 }} className={classes.rgbContentCol}>
            {currentAuction ? rgbContent : loadingRgb}
          </Col>
          <Col lg={{ span: 6 }} className={classes.auctionActivityCol}>
            {currentAuction &&
              (isRgbfounderRgb(currentAuction.rgbId)
                ? rgbfounderRgbContent
                : currentAuctionActivityContent)}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auction;
