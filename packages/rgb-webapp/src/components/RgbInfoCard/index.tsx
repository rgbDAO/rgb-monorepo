import React from 'react';
import { Col } from 'react-bootstrap';

import classes from './RgbInfoCard.module.css';

import _AddressIcon from '../../assets/icons/Address.svg';
import _BidsIcon from '../../assets/icons/Bids.svg';

import RgbInfoRowBirthday from '../RgbInfoRowBirthday';
import RgbInfoRowHolder from '../RgbInfoRowHolder';
import RgbInfoRowButton from '../RgbInfoRowButton';
import { useHistory } from 'react-router';
import { useAppSelector } from '../../hooks';

import config from '../../config';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { setOnDisplayAuctionRgbId } from '../../state/slices/onDisplayAuction';
import { useDispatch } from 'react-redux';

interface RgbInfoCardProps {
  rgbId: number;
}

const RgbInfoCard: React.FC<RgbInfoCardProps> = props => {
  const { rgbId } = props;
  const history = useHistory();
  const dispatch = useDispatch();

  const etherscanBaseURL = buildEtherscanAddressLink(config.addresses.rgbToken);
  const bidHistoryButtonClickHandler = () => {
    dispatch(setOnDisplayAuctionRgbId(rgbId));
    history.push(`/auction/${rgbId}`);
  };
  // eslint-disable-next-line no-restricted-globals
  const etherscanButtonClickHandler = () => (location.href = `${etherscanBaseURL}/${rgbId}`);

  const lastAuctionRgbId = useAppSelector(state => state.onDisplayAuction.lastAuctionRgbId);

  return (
    <>
      <Col lg={12}>
        <div className={classes.rgbInfoHeader}>
          <h3>Profile</h3>
          <h2>Rgb {rgbId}</h2>
        </div>
      </Col>
      <Col lg={12} className={classes.rgbInfoRow}>
        <RgbInfoRowBirthday rgbId={rgbId} />
      </Col>
      <Col lg={12} className={classes.rgbInfoRow}>
        <RgbInfoRowHolder rgbId={rgbId} />
      </Col>
      <Col lg={12} className={classes.rgbInfoRow}>
        <RgbInfoRowButton
          iconImgSource={_BidsIcon}
          btnText={lastAuctionRgbId === rgbId ? 'Bids' : 'Bid history'}
          onClickHandler={bidHistoryButtonClickHandler}
        />
        <RgbInfoRowButton
          iconImgSource={_AddressIcon}
          btnText={'Etherscan'}
          onClickHandler={etherscanButtonClickHandler}
        />
      </Col>
    </>
  );
};

export default RgbInfoCard;
