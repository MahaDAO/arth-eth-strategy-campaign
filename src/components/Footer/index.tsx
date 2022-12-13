import React from 'react';
import styled from 'styled-components';

import {Mixpanel} from '../../analytics/Mixpanel';
import config from '../../config';
import theme from '../../theme';
import TextWrapper from "../TextWrapper";
import {useGetChainId} from "../../utils/NetworksCustomHooks";

const Footer = () => {
  const chainId = useGetChainId();

  const trackButtons = (value: string) => {
    Mixpanel.track(`buttonClick:footer_${value}`, {
      networkName: config[chainId]?.networkDisplayName || '',
    });
  };

  return (
    <FooterContainer>
      <div className={'single-line-center-center m-b-8'}>
        <div
          onClick={() => {
            trackButtons('website');
            window.open('https://mahadao.com');
          }}
          className="p-l-8 p-r-8"
        >
          <TextWrapper
            text={'Website'}
            className="pointer"
            Fcolor={theme.color.transparent[100]}
          />
        </div>
        <div
          onClick={() => {
            trackButtons('twitter');
            window.open('https://twitter.com/TheMahaDAO');
          }}
          className="p-l-8 p-r-8"
        >
          <TextWrapper
            text={'Twitter'}
            className="pointer"
            Fcolor={theme.color.transparent[100]}
          />
        </div>
        <div
          onClick={() => {
            trackButtons('github');
            window.open('https://github.com/mahadao');
          }}
          className="p-l-8 p-r-8"
        >
          <TextWrapper
            text={'Github'}
            className="pointer"
            Fcolor={theme.color.transparent[100]}
          />
        </div>
        <div
          onClick={() => {
            trackButtons('discord');
            window.open('https://discord.com/invite/mahadao');
          }}
          className="p-l-8 p-r-8"
        >
          <TextWrapper
            text={'Discord'}
            className="pointer"
            Fcolor={theme.color.transparent[100]}
          />
        </div>
        <div
          onClick={() => {
            trackButtons('report_bug');
            window.open('https://docs.google.com/forms/d/e/1FAIpQLSdeFG524PT4jrLYzbZZPUuuCY7Ty220Y3iSi1StvLbsk8JSXA/viewform');
          }}
          className="p-l-8 p-r-8"
        >
          <TextWrapper
            text={'Report a Bug'}
            className="pointer"
            Fcolor={theme.color.transparent[100]}
          />
        </div>
      </div>
      <div className={'single-line-center-center'}>
        <div
          onClick={() => {
            trackButtons('dept_pool');
            window.open(
              'https://debt.mahadao.com',
            );
          }}
          className="p-l-8 p-r-8"
        >
          <TextWrapper
            text={'Debt Pool'}
            className="pointer"
            Fcolor={theme.color.transparent[100]}
          />
        </div>
        <div
          onClick={() => {
            trackButtons('forums');
            window.open(
              'https://discuss.mahadao.com',
            );
          }}
          className="p-l-8 p-r-8"
        >
          <TextWrapper
            text={'Forums'}
            className="pointer"
            Fcolor={theme.color.transparent[100]}
          />
        </div>
      </div>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.div`
  position: absolute;
  padding: 0 16px;
  bottom: 24px;
  flex-wrap: wrap;
`;
