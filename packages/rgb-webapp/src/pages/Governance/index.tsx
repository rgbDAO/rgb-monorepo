import { Col } from 'react-bootstrap';
import Section from '../../layout/Section';
import { useAllProposals, useProposalThreshold } from '../../wrappers/rgbDao';
import Proposals from '../../components/Proposals';
import classes from './Governance.module.css';

const GovernancePage = () => {
  const { data: proposals } = useAllProposals();
  const threshold = useProposalThreshold();
  const rgbRequired = threshold !== undefined ? threshold + 1 : '...';
  const rgbThresholdCopy = `${rgbRequired} ${threshold === 0 ? 'Rgb' : 'Rgb'}`;

  return (
    <Section fullWidth={true}>
      <Col lg={{ span: 8, offset: 2 }}>
        <h1 className={classes.heading}>Rgb DAO Governance</h1>
        <p className={classes.subheading}>
          Rgb govern RgbDAO. Rgb can vote on proposals or delegate their vote to a third
          party. A minimum of {rgbThresholdCopy} is required to submit proposals.
        </p>
        <Proposals proposals={proposals} />
      </Col>
    </Section>
  );
};
export default GovernancePage;
