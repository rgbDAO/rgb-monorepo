import { useQuery } from '@apollo/client';
import React from 'react';
import { Image } from 'react-bootstrap';
import _LinkIcon from '../../assets/icons/Link.svg';
import { rgbQuery } from '../../wrappers/subgraph';
import _HeartIcon from '../../assets/icons/Heart.svg';
import classes from './RgbInfoRowHolder.module.css';

import config from '../../config';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import ShortAddress from '../ShortAddress';

interface RgbInfoRowHolderProps {
  rgbId: number;
}

const RgbInfoRowHolder: React.FC<RgbInfoRowHolderProps> = props => {
  const { rgbId } = props;

  const { loading, error, data } = useQuery(rgbQuery(rgbId.toString()));

  const etherscanURL = buildEtherscanAddressLink(data && data.rgb.owner.id);

  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <div>Failed to fetch rgb info</div>;
  }

  const shortAddressComponent = <ShortAddress address={data && data.rgb.owner.id} />;

  return (
    <div className={classes.rgbHolderInfoContainer}>
      <span>
        <Image src={_HeartIcon} className={classes.heartIcon} />
      </span>
      <span>Held by</span>
      <span>
        <a
          className={classes.rgbHolderEtherscanLink}
          href={etherscanURL}
          target={'_blank'}
          rel="noreferrer"
        >
          {data.rgb.owner.id.toLowerCase() ===
          config.addresses.rgbAuctionHouseProxy.toLowerCase()
            ? 'Rgb Auction House'
            : shortAddressComponent}
        </a>
      </span>
      <span className={classes.linkIconSpan}>
        <Image src={_LinkIcon} className={classes.linkIcon} />
      </span>
    </div>
  );
};

export default RgbInfoRowHolder;
