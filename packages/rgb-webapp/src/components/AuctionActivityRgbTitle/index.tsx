import { BigNumber } from 'ethers';
import classes from './AuctionActivityRgbTitle.module.css';

const AuctionActivityRgbTitle: React.FC<{ rgbId: BigNumber }> = props => {
  const { rgbId } = props;
  const rgbIdContent = `Rgb ${rgbId.toString()}`;
  return (
    <div className={classes.wrapper}>
      <h1>{rgbIdContent}</h1>
    </div>
  );
};
export default AuctionActivityRgbTitle;
