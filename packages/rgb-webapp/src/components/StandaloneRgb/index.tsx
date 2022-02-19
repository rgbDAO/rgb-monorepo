import { ImageData as data, getRgbData } from '@rgbdao/assets';
import { buildSVG } from '@rgbdao/sdk';
import { BigNumber as EthersBN } from 'ethers';
import { IRgbSeed, useRgbSeed } from '../../wrappers/rgbToken';
import Rgb from '../Rgb';
import { Link } from 'react-router-dom';
import classes from './StandaloneRgb.module.css';

interface StandaloneRgbProps {
  rgbId: EthersBN;
}

interface StandaloneRgbWithSeedProps {
  rgbId: EthersBN;
  onLoadSeed?: (seed: IRgbSeed) => void;
  shouldLinkToProfile: boolean;
}

const getRgb = (rgbId: string | EthersBN, seed: IRgbSeed) => {
  const id = rgbId.toString();
  const name = `RGb ${id}`;
  const description = `RGB ${id} is a member of the rgbDAO`;
  const { parts, background } = getRgbData(seed);
  const image = `data:image/svg+xml;base64,${btoa(buildSVG(parts, data.palette, background))}`;

  return {
    name,
    description,
    image,
  };
};

const StandaloneRgb: React.FC<StandaloneRgbProps> = (props: StandaloneRgbProps) => {
  const { rgbId } = props;
  const seed = useRgbSeed(rgbId);
  const rgb = seed && getRgb(rgbId, seed);

  return (
    <Link to={'/rgb/' + rgbId.toString()} className={classes.clickableRgb}>
      <Rgb imgPath={rgb ? rgb.image : ''} alt={rgb ? rgb.description : 'Rgb'} />
    </Link>
  );
};

export const StandaloneRgbWithSeed: React.FC<StandaloneRgbWithSeedProps> = (
  props: StandaloneRgbWithSeedProps,
) => {
  const { rgbId, onLoadSeed, shouldLinkToProfile } = props;

  const seed = useRgbSeed(rgbId);

  if (!seed || !rgbId || !onLoadSeed) return <Rgb imgPath="" alt="Rgb" />;

  onLoadSeed(seed);

  const { image, description } = getRgb(rgbId, seed);

  const rgb = <Rgb imgPath={image} alt={description} />;
  const rgbWithLink = (
    <Link to={'/rgb/' + rgbId.toString()} className={classes.clickableRgb}>
      {rgb}
    </Link>
  );
  return shouldLinkToProfile ? rgbWithLink : rgb;
};

export default StandaloneRgb;
