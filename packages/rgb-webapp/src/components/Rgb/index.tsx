import classes from './Rgb.module.css';
import React from 'react';
import loadingRgb from '../../assets/loading-skull-rgb.gif';
import Image from 'react-bootstrap/Image';

export const LoadingRgb = () => {
  return (
    <div className={classes.imgWrapper}>
      <Image className={classes.img} src={loadingRgb} alt={'loading rgb'} fluid />
    </div>
  );
};

const Rgb: React.FC<{
  imgPath: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}> = props => {
  const { imgPath, alt, className, wrapperClassName } = props;
  return (
    <div className={`${classes.imgWrapper} ${wrapperClassName}`}>
      <Image
        className={`${classes.img} ${className}`}
        src={imgPath ? imgPath : loadingRgb}
        alt={alt}
        fluid
      />
    </div>
  );
};

export default Rgb;
