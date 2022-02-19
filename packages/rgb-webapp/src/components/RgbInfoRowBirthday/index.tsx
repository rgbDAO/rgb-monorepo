import { BigNumber } from '@ethersproject/bignumber';
import React from 'react';
import { isRgbfounderRgb } from '../../utils/rgbfounderRgb';

import classes from './RgbInfoRowBirthday.module.css';
import _BirthdayIcon from '../../assets/icons/Birthday.svg';

import { Image } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import { AuctionState } from '../../state/slices/auction';

interface RgbInfoRowBirthdayProps {
  rgbId: number;
}

const RgbInfoRowBirthday: React.FC<RgbInfoRowBirthdayProps> = props => {
  const { rgbId } = props;

  // If the rgb is a rgbfounder rgb, use the next rgb to get the mint date.
  // We do this because we use the auction start time to get the mint date and
  // rgbfounder rgb do not have an auction start time.
  const rgbIdForQuery = isRgbfounderRgb(BigNumber.from(rgbId)) ? rgbId + 1 : rgbId;

  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);
  if (!pastAuctions || !pastAuctions.length) {
    return <></>;
  }

  const startTime = BigNumber.from(
    pastAuctions.find((auction: AuctionState, i: number) => {
      const maybeRgbId = auction.activeAuction?.rgbId;
      return maybeRgbId ? BigNumber.from(maybeRgbId).eq(BigNumber.from(rgbIdForQuery)) : false;
    })?.activeAuction?.startTime,
  );

  if (!startTime) {
    return <>Error fetching rgb birthday</>;
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const birthday = new Date(Number(startTime._hex) * 1000);

  return (
    <div className={classes.birthdayInfoContainer}>
      <span>
        <Image src={_BirthdayIcon} className={classes.birthdayIcon} />
      </span>
      Born
      <span className={classes.rgbInfoRowBirthday}>
        {monthNames[birthday.getUTCMonth()]} {birthday.getUTCDate()}, {birthday.getUTCFullYear()}
      </span>
    </div>
  );
};

export default RgbInfoRowBirthday;
