import { BigNumber } from 'ethers';
import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { StandaloneRgbWithSeed } from '../../components/StandaloneRgb';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setStateBackgroundColor } from '../../state/slices/application';
import { grey, beige } from '../../utils/rgbBgColors';
import { IRgbSeed } from '../../wrappers/rgbToken';

import classes from './Profile.module.css';

import RgbInfoCard from '../../components/RgbInfoCard';
import ProfileActivityFeed from '../../components/ProfileActivityFeed';

interface ProfilePageProps {
  rgbId: number;
}

const ProfilePage: React.FC<ProfilePageProps> = props => {
  const { rgbId } = props;

  const dispatch = useAppDispatch();
  const lastAuctionRgbId = useAppSelector(state => state.onDisplayAuction.lastAuctionRgbId);
  let stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);

  const loadedRgbHandler = (seed: IRgbSeed) => {
    dispatch(setStateBackgroundColor(seed.background === 0 ? grey : beige));
  };

  if (!lastAuctionRgbId) {
    return <></>;
  }

  const rgbIdForDisplay = Math.min(rgbId, lastAuctionRgbId);

  const rgbContent = (
    <StandaloneRgbWithSeed
      rgbId={BigNumber.from(rgbIdForDisplay)}
      onLoadSeed={loadedRgbHandler}
      shouldLinkToProfile={false}
    />
  );

  return (
    <>
      <div style={{ backgroundColor: stateBgColor }}>
        <Container>
          <Row>
            <Col lg={6}>{rgbContent}</Col>
            <Col lg={6} className={classes.rgbProfileInfo}>
              <RgbInfoCard rgbId={rgbIdForDisplay} />
            </Col>
          </Row>
        </Container>
      </div>
      <ProfileActivityFeed rgbId={rgbIdForDisplay} />
    </>
  );
};

export default ProfilePage;
