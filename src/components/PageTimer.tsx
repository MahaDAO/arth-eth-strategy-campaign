import Countdown from "react-countdown";
import TextWrapper from "./TextWrapper";
import theme from "../theme";
import styled from "styled-components";
import React from "react";
import ComingSoonImg from "../assets/images/ComingSoon.svg";

interface IProps {
  date: number;
  subTitle: string;
}

const ComingSoonPageWithTimer = (props: IProps) => {
  const {date, subTitle = ''} = props;
  return (
    <MainContainer className="single-line-center-center mo-custom-container">
      <div className="text-center">
        <TextWrapper
          text={'Coming Soon'}
          fontWeight={"bold"}
          fontSize={32}
          fontFamily={"Syne"}
          className="m-b-20"
          align={"center"}
        />
        <div className={'m-b-24 m-l-16'}>
          <Countdown
            date={date}
            renderer={({days, hours, minutes, seconds}) => {
              return (
                <div className={'single-line-baseline-center'}>
                  <div className={'tags'}>
                    <TextWrapper text={String(days).length === 1 ? `0${String(days)}` : String(days)} fontSize={24}
                    />
                  </div>
                  &nbsp;
                  <TextWrapper
                    text={"Days"}
                    fontSize={12}
                    Fcolor={theme.color.transparent[100]}
                    align={"center"}
                    fontFamily={"Syne"}
                  /> &nbsp;
                  <div className={'tags'}>
                    <TextWrapper text={String(hours).length === 1 ? `0${String(hours)}` : String(hours)} fontSize={24}
                    />
                  </div>
                  &nbsp;
                  <TextWrapper
                    text={"hrs"}
                    fontSize={12}
                    Fcolor={theme.color.transparent[100]}
                    align={"center"}
                    fontFamily={"Syne"}
                  /> &nbsp;
                  <div className={'tags'}>
                    <TextWrapper text={String(minutes).length === 1 ? `0${String(minutes)}` : String(minutes)}
                                 fontSize={24}/>
                  </div>
                  &nbsp;
                  <TextWrapper
                    text={"mins"}
                    fontSize={12}
                    Fcolor={theme.color.transparent[100]}
                    align={"center"}
                    fontFamily={"Syne"}
                  /> &nbsp;
                  <div className={'tags'}>
                    <TextWrapper text={String(seconds).length === 1 ? `0${String(seconds)}` : String(seconds)}
                                 fontSize={24}/>
                  </div>
                  &nbsp;
                  <TextWrapper
                    text={"sec"}
                    fontSize={12}
                    Fcolor={theme.color.transparent[100]}
                    align={"center"}
                    fontFamily={"Syne"}
                  />
                </div>
              )
            }}
          />
        </div>
        <TextWrapper
          text={subTitle}
          fontWeight={300}
          Fcolor={theme.color.transparent[100]}
          align={"center"}
        />
      </div>
    </MainContainer>
  )
}

export default ComingSoonPageWithTimer;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
`;

