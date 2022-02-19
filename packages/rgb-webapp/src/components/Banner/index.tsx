import classes from './Banner.module.css';
import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import calendar_rgb from '../../assets/calendar_rgb.png';
import Rgb from '../Rgb';

const Banner = () => {
  return (
    <Section fullWidth={false} className={classes.bannerSection}>
      <Col lg={6}>
        <div className={classes.wrapper}>
          <h1>
            ONE RGB,
            <br />
            EVERY DAY,
            <br />
            FOREVER.
          </h1>
        </div>
      </Col>
      <Col lg={6}>
        <div style={{ padding: '2rem' }}>
          <Rgb imgPath={calendar_rgb} alt="rgb" />
        </div>
      </Col>
    </Section>
  );
};

export default Banner;
