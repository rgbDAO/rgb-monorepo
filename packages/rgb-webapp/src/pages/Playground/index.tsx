import { Container, Col, Button, Row, FloatingLabel, Form } from 'react-bootstrap';
import classes from './Playground.module.css';
import React, { useEffect, useState } from 'react';
import Link from '../../components/Link';
import { ImageData, getRgbData, getRandomRgbSeed } from '@rgbdao/assets';
import { buildSVG } from '@rgbdao/sdk';
import Rgb from '../../components/Rgb';
import RgbModal from './RgbModal';

interface Trait {
  title: string;
  traitNames: string[];
}

const rgbProtocolLink = (
  <Link
    text="Rgb Protocol"
    url="https://www.notion.so/Rgb-Protocol-32e4f0bf74fe433e927e2ea35e52a507"
    leavesPage={true}
  />
);

const rgbAssetsLink = (
  <Link
    text="rgb-assets"
    url="https://github.com/rgbDAO/rgb-monorepo/tree/master/packages/rgb-assets"
    leavesPage={true}
  />
);

const rgbSDKLink = (
  <Link
    text="rgb-sdk"
    url="https://github.com/rgbDAO/rgb-monorepo/tree/master/packages/rgb-sdk"
    leavesPage={true}
  />
);

const parseTraitName = (partName: string): string =>
  capitalizeFirstLetter(partName.substring(partName.indexOf('-') + 1));

const capitalizeFirstLetter = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

const Playground: React.FC = () => {
  const [rgbvgs, setRgbSvgs] = useState<string[]>();
  const [traits, setTraits] = useState<Trait[]>();
  const [modSeed, setModSeed] = useState<{ [key: string]: number }>();
  const [initLoad, setInitLoad] = useState<boolean>(true);
  const [displayRgb, setDisplayRgb] = useState<boolean>(false);
  const [indexOfRgbToDisplay, setIndexOfRgbToDisplay] = useState<number>();

  const generateRgbSvg = React.useCallback(
    (amount: number = 1) => {
      for (let i = 0; i < amount; i++) {
        const seed = { ...getRandomRgbSeed(), ...modSeed };
        const { parts, background } = getRgbData(seed);
        const svg = buildSVG(parts, ImageData.palette, background);
        setRgbSvgs(prev => {
          return prev ? [svg, ...prev] : [svg];
        });
      }
    },
    [modSeed],
  );

  useEffect(() => {
    const traitTitles = ['background', 'body', 'accessory', 'head', 'glasses'];
    const traitNames = [
      ['cool', 'warm'],
      ...Object.values(ImageData.images).map(i => {
        return i.map(imageData => imageData.filename);
      }),
    ];
    setTraits(
      traitTitles.map((value, index) => {
        return {
          title: value,
          traitNames: traitNames[index],
        };
      }),
    );

    if (initLoad) {
      generateRgbSvg(8);
      setInitLoad(false);
    }
  }, [generateRgbSvg, initLoad]);

  const traitOptions = (trait: Trait) => {
    return Array.from(Array(trait.traitNames.length + 1)).map((_, index) => {
      const parsedTitle = index === 0 ? `Random` : parseTraitName(trait.traitNames[index - 1]);
      return <option key={index}>{parsedTitle}</option>;
    });
  };

  const traitButtonHandler = (trait: Trait, traitIndex: number) => {
    setModSeed(prev => {
      // -1 traitIndex = random
      if (traitIndex < 0) {
        let state = { ...prev };
        delete state[trait.title];
        return state;
      }
      return {
        ...prev,
        [trait.title]: traitIndex,
      };
    });
  };

  return (
    <>
      {displayRgb && indexOfRgbToDisplay !== undefined && rgbSvgs && (
        <RgbModal
          onDismiss={() => {
            setDisplayRgb(false);
          }}
          svg={rgbSvgs[indexOfRgbToDisplay]}
        />
      )}

      <Container fluid="lg">
        <Row>
          <Col lg={10} className={classes.headerRow}>
            <span>Explore</span>
            <h1>Playground</h1>
            <p>
              The playground was built using the {rgbProtocolLink}. Rgb's traits are determined
              by the Rgb Seed. The seed was generated using {rgbAssetsLink} and rendered using
              the {rgbSDKLink}.
            </p>
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
            <Button
              onClick={() => {
                generateRgbSvg();
              }}
              className={classes.generateBtn}
            >
              Generate Rgb
            </Button>
            {traits &&
              traits.map((trait, index) => {
                return (
                  <Form className={classes.traitForm}>
                    <FloatingLabel
                      controlId="floatingSelect"
                      label={capitalizeFirstLetter(trait.title)}
                      key={index}
                      className={classes.floatingLabel}
                    >
                      <Form.Select
                        aria-label="Floating label select example"
                        className={classes.traitFormBtn}
                        onChange={e => {
                          let index = e.currentTarget.selectedIndex;
                          traitButtonHandler(trait, index - 1); // - 1 to account for 'random'
                        }}
                      >
                        {traitOptions(trait)}
                      </Form.Select>
                    </FloatingLabel>
                  </Form>
                );
              })}
            <p className={classes.rgbYearsFooter}>
              You've generated {rgbSvgs ? (rgbSvgs.length / 365).toFixed(2) : '0'} years worth of
              Rgb
            </p>
          </Col>
          <Col lg={9}>
            <Row>
              {rgbSvgs &&
                rgbSvgs.map((svg, i) => {
                  return (
                    <Col xs={4} lg={3} key={i}>
                      <div
                        onClick={() => {
                          setIndexOfRgbToDisplay(i);
                          setDisplayRgb(true);
                        }}
                      >
                        <Rgb
                          imgPath={`data:image/svg+xml;base64,${btoa(svg)}`}
                          alt="rgb"
                          className={classes.rgbImg}
                          wrapperClassName={classes.rgbWrapper}
                        />
                      </div>
                    </Col>
                  );
                })}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Playground;
