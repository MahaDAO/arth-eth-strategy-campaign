import styled from "styled-components";
import IconLoader from "../../../components/IconLoader";
import TextWrapper from "../../../components/TextWrapper";
import Button from "../../../components/Button";
import TextButton from "../../../components/TextButton";
import {ReactNode} from "react";

interface IProps {
  title: string | ReactNode;
  desc: string | ReactNode;
  icon: ReactNode;
  visitLink: string;
  learnMore: string;
  trackingId: string;
  buttonDisabled?: boolean;
  buttonText?: string;

}

const Card = (props: IProps) => {
  return (
    <Main className={'material-secondary'}>
      <Image className={'single-line-center-center'}>
        {props.icon}
      </Image>
      <Title>
        <TextWrapper
          text={props.title}
          fontSize={24}
          fontWeight={600}
          fontFamily={'Syne'}
          align={"center"}
          className={'m-b-12'}
        />
      </Title>
      <Desc className={'m-b-12'}>
        <TextWrapper
          text={props.desc}
          align={'center'}
        />
      </Desc>
      <LearnMore>
        <TextButton text={'Learn more'} align={'center'} onClick={() => window.open(props.learnMore)}/>
      </LearnMore>
      <ButtonContainer>
        <Button
          text={props.buttonText ? props.buttonText : 'Visit'}
          onClick={() => window.open(props.visitLink, '_self')}
          tracking_id={props.trackingId}
          disabled={props.buttonDisabled}
        />
      </ButtonContainer>
    </Main>
  )
}

export default Card;

const Main = styled.div`
  border-radius: 6px;
`;

const Image = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.div`

`

const Desc = styled.div`

`

const ButtonContainer = styled.div`
  margin-top: 24px;
`

const LearnMore = styled.div`

`
