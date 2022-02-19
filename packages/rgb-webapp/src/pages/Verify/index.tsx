import React from 'react';
import { useAppSelector } from '../../hooks';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { rgbIndex } from '../../wrappers/subgraph';
import classes from './Verify.module.css';
import clsx from 'clsx';
import Section from '../../layout/Section';
import { Button, Col, Form } from 'react-bootstrap';
import VerifySignature from '../../components/VerifySignature';
import * as R from 'ramda';
import { useEthers } from '@usedapp/core';

interface VerifyPageProp {}

const VerifyPage: React.FC<VerifyPageProp> = props => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { data } = useQuery(rgbIndex());
  const [messageToSign, setMessageToSign] = useState<undefined | string>(undefined);
  const [signedMessage, setSignedMessage] = useState<undefined | object>(undefined);
  const { library } = useEthers();

  const extractOwnedRgbIdsFromRgbIndex = (owner: string | undefined, rgbIndex: any) =>
    R.pipe(
      (rgb: any) =>
        rgb.filter((rgb: any) =>
          !owner
            ? false
            : (rgb.owner.id as string)
                .toLocaleLowerCase()
                .localeCompare(owner.toLocaleLowerCase()) === 0,
        ),
      R.map((rgb: any) => Number(rgb.id)),
      R.sort((a: number, b: number) => a - b),
    )(rgbIndex.rgb);

  const loadingContent = () => <div className={classes.loadingContent}>loading your Rgb...</div>;

  useEffect(() => {
    if (!data) return;
    const initialMessage = (rgb: number[]) =>
      [
        activeAccount ? `I am ${activeAccount}` : undefined,
        rgb.length > 0
          ? ` and I own Rgb${rgb.length > 1 ? 's' : ''} ${rgb.join(', ')}`
          : undefined,
      ]
        .filter((part: string | undefined) => part)
        .join(' ');
    setMessageToSign(initialMessage(extractOwnedRgbIdsFromRgbIndex(activeAccount, data)));
  }, [data, activeAccount]);

  return (
    <div className={clsx(classes.verifyBlock)}>
      <Section fullWidth={true}>
        <Col lg={{ span: 6, offset: 3 }}>
          {messageToSign === undefined ? (
            loadingContent()
          ) : (
            <>
              <h2>Sign Message</h2>
              <div>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Message To Sign:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    onChange={e => setMessageToSign(e.target.value)}
                    defaultValue={messageToSign}
                  />
                </Form.Group>
                <Button
                  onClick={async () => {
                    const signature = await library?.getSigner().signMessage(messageToSign);
                    setSignedMessage({
                      message: messageToSign,
                      signer: activeAccount,
                      signature,
                    });
                  }}
                >
                  Sign Message
                </Button>
              </div>
              <div className={classes.signedPayload}>
                {signedMessage && (
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Signed Payload:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      readOnly={true}
                      value={JSON.stringify(signedMessage)}
                    />
                  </Form.Group>
                )}
              </div>
            </>
          )}
        </Col>
        <Col lg={{ span: 6, offset: 3 }}>
          <VerifySignature />
        </Col>
      </Section>
    </div>
  );
};
export default VerifyPage;
