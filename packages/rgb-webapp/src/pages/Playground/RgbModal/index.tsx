import { Button } from 'react-bootstrap';
import classes from './RgbModal.module.css';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Rgb from '../../../components/Rgb';
import { svg2png } from '../../../utils/svg2png';
import { Backdrop } from '../../../components/Modal';

const downloadRgbPNG = (png: string) => {
  const downloadEl = document.createElement('a');
  downloadEl.href = png;
  downloadEl.download = 'rgb.png';
  downloadEl.click();
};

const RgbModal: React.FC<{ onDismiss: () => void; svg: string }> = props => {
  const { onDismiss, svg } = props;

  const [width, setWidth] = useState<number>(window.innerWidth);
  const [png, setPng] = useState<string | null>();

  const isMobile: boolean = width <= 991;

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);

    const loadPng = async () => {
      setPng(await svg2png(svg, 500, 500));
    };
    loadPng();

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, [svg]);

  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop
          onDismiss={() => {
            onDismiss();
          }}
        />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <div className={classes.modal}>
          {png && (
            <Rgb
              imgPath={png}
              alt="rgb"
              className={classes.rgbImg}
              wrapperClassName={classes.rgbWrapper}
            />
          )}
          <div className={classes.displayRgbFooter}>
            <span>Use this Rgb as your profile picture!</span>
            {!isMobile && png && (
              <Button
                onClick={() => {
                  downloadRgbPNG(png);
                }}
              >
                Download
              </Button>
            )}
          </div>
        </div>,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};
export default RgbModal;
