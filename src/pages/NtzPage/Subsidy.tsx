// import React from 'react'
import { useEffect, useState } from "react";
import styled from "styled-components";
import HeadBar from "../../components/HeadBar/HeadBar";
import NavBar from "../../components/NavBar/NavBar";
import MainFrame from "../../components/MainFrame/MainFrame";
import { LongButton } from "../../style";
import axiosInstance from "../../api/axiosInstance";

export default function Subsidy() {
  const [userName, setUsername] = useState<String>("");
  const signupURL =
    "https://cpoint.or.kr/netzero/member/nv_memberRegistStep1.do";
  const axios = axiosInstance();

  const getUserInfo = async () => {
    try {
      const response = await axios.get(`/member/detail`);
      const data = await response.data.nickname;
      setUsername(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <>
      <HeadBar pagename="가입안내" bgcolor="white" backbutton="yes" />
      <MainFrame headbar="yes" navbar="yes" bgcolor="white" marginsize="large">
        <Title style={{ marginTop: "48px" }}>
          탄소중립 포인트 제도,
          <br />
          아직도 가입 안하셨나요?
        </Title>
        <SubTitle>
          {userName}님, 제도 가입 시<br />연 최대 70,000원을 받을 수 있어요
        </SubTitle>

        <ImageFrame>
          <CoinImage src="/images/netzero/subsidy-coin.png" />
        </ImageFrame>

        <Title style={{ marginTop: "56px" }}>탄소중립포인트 제도는?</Title>
        <SubTitle>
          탄소중립 생활 실천문화 확산을 위하여
          <br />
          친환경활동 이용 시<br />
          이용실적에 따라 인센티브를 지원하는 제도
          <br />
        </SubTitle>

        <Title style={{ marginTop: "36px" }}>참여대상</Title>
        <SubTitleNoMargin>
          일상생활속에서 친환경 활동을 실천하는 국민
        </SubTitleNoMargin>

        <Title style={{ marginTop: "24px" }}>참여방법</Title>
        <SubTitleNoMargin>
          탄소중립포인트 녹색생활 실천 누리집 회원가입
        </SubTitleNoMargin>

        <Title style={{ marginTop: "24px" }}>참여혜택</Title>
        <SubTitleNoMargin>
          현금, 참여기업 / 카드사 포인트 (1인당 최대 7만원 지원)
        </SubTitleNoMargin>
        <ForMargin />
      </MainFrame>
      <SignUpFrame>
        <SingupButton
          onClick={() => {
            window.open(signupURL);
          }}
        >
          가입하기
        </SingupButton>
      </SignUpFrame>
      <NavBar />
    </>
  );
}

const Title = styled.div`
  font-size: 19px;
  font-weight: 550;
`;

const SubTitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: var(--dark-gray);
  margin-top: 12px;
`;

const SubTitleNoMargin = styled(SubTitle)`
  font-size: 14px;
  font-weight: 400;
  color: var(--dark-gray);
  margin-top: 4px;
`;

const ImageFrame = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 56px;
`;

const CoinImage = styled.img`
  position: relative;
  width: 176px;
  margin-left: 5%;
`;

const SignUpFrame = styled.div`
  position: absolute;
  bottom: 76px;
  width: 100%;
  height: 88px;
  background: linear-gradient(
    180deg,
    rgba(253, 253, 253, 0) 0%,
    #fdfdfd 19.74%
  );
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SingupButton = styled(LongButton)`
  width: 88.88%;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 14px;
`;
const ForMargin = styled.div`
  height: 88px;
  width: 100%;
`;
