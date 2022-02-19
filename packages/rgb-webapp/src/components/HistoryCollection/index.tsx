import { BigNumber, BigNumberish } from 'ethers';
import Section from '../../layout/Section';
import classes from './HistoryCollection.module.css';
import clsx from 'clsx';
import StandaloneRgb from '../StandaloneRgb';
import { LoadingRgb } from '../Rgb';
import config from '../../config';
import { Container, Row } from 'react-bootstrap';

interface HistoryCollectionProps {
  historyCount: number;
  latestRgbId: BigNumberish;
}

const HistoryCollection: React.FC<HistoryCollectionProps> = (props: HistoryCollectionProps) => {
  const { historyCount, latestRgbId } = props;

  if (!latestRgbId) return null;

  const startAtZero = BigNumber.from(latestRgbId).sub(historyCount).lt(0);

  let rgbIds: Array<BigNumber | null> = new Array(historyCount);
  rgbIds = rgbIds.fill(null).map((_, i) => {
    if (BigNumber.from(i).lt(latestRgbId)) {
      const index = startAtZero
        ? BigNumber.from(0)
        : BigNumber.from(Number(latestRgbId) - historyCount);
      return index.add(i);
    } else {
      return null;
    }
  });

  const rgbContent = rgbIds.map((rgbId, i) => {
    return !rgbId ? <LoadingRgb key={i} /> : <StandaloneRgb key={i} rgbId={rgbId} />;
  });

  return (
    <Section fullWidth={true}>
      <Container fluid>
        <Row className="justify-content-md-center">
          <div className={clsx(classes.historyCollection)}>
            {config.app.enableHistory && rgbContent}
          </div>
        </Row>
      </Container>
    </Section>
  );
};

export default HistoryCollection;
