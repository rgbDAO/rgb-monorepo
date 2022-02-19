import React from 'react';
import { Image } from 'react-bootstrap';
import classes from './RgbInfoRowButton.module.css';

interface RgbInfoRowButtonProps {
  iconImgSource: string;
  btnText: string;
  onClickHandler: () => void;
}

const RgbInfoRowButton: React.FC<RgbInfoRowButtonProps> = props => {
  const { iconImgSource, btnText, onClickHandler } = props;
  return (
    <div className={classes.rgbButton} onClick={onClickHandler}>
      <div className={classes.rgbButtonContents}>
        <Image src={iconImgSource} className={classes.buttonIcon} />
        {btnText}
      </div>
    </div>
  );
};

export default RgbInfoRowButton;
