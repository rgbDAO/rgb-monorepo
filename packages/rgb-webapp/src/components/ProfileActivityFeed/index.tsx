import React from 'react';
import { Col, Table } from 'react-bootstrap';
import Section from '../../layout/Section';
import classes from './ProfileActivityFeed.module.css';

import { useQuery } from '@apollo/client';
import { Proposal, useAllProposals } from '../../wrappers/rgbDao';
import { rgbVotingHistoryQuery } from '../../wrappers/subgraph';
import RgbProfileVoteRow from '../RgbProfileVoteRow';
import { LoadingRgb } from '../Rgb';

interface ProfileActivityFeedProps {
  rgbId: number;
}

interface ProposalInfo {
  id: number;
}

export interface RgbVoteHistory {
  proposal: ProposalInfo;
  support: boolean;
  supportDetailed: number;
}

const ProfileActivityFeed: React.FC<ProfileActivityFeedProps> = props => {
  const { rgbId } = props;

  const { loading, error, data } = useQuery(rgbVotingHistoryQuery(rgbId));
  const { data: proposals } = useAllProposals();

  if (loading) {
    return <></>;
  } else if (error) {
    return <div>Failed to fetch rgb activity history</div>;
  }

  const rgbVotes: { [key: string]: RgbVoteHistory } = data.rgb.votes
    .slice(0)
    .reduce((acc: any, h: RgbVoteHistory, i: number) => {
      acc[h.proposal.id] = h;
      return acc;
    }, {});

  const latestProposalId = proposals?.length;

  return (
    <Section fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>Activity</h1>
        </div>

        <Table responsive hover>
          <tbody className={classes.rgbInfoPadding}>
            {proposals?.length ? (
              proposals
                .slice(0)
                .reverse()
                .map((p: Proposal, i: number) => {
                  const vote = p.id ? rgbVotes[p.id] : undefined;
                  return (
                    <RgbProfileVoteRow
                      proposal={p}
                      vote={vote}
                      latestProposalId={latestProposalId}
                      rgbId={rgbId}
                      key={i}
                    />
                  );
                })
            ) : (
              <LoadingRgb />
            )}
          </tbody>
        </Table>
      </Col>
    </Section>
  );
};

export default ProfileActivityFeed;
