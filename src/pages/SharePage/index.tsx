// import React from 'react'
import { useState, useEffect } from "react";
import styled from "styled-components";
import Lottie from "lottie-react";
import AngryEarth from "../../assets/lottie/angry-earth.json";
import ChuEarth from "../../assets/lottie/chu-earth.json";
import CryEarth from "../../assets/lottie/cry-earth.json";
import MeltingEarth from "../../assets/lottie/melting-earth.json";
import WowEarth from "../../assets/lottie/wow-earth.json";
import Judge from "../../assets/lottie/judge.json";
import data from "../../common/result.json";
import { ScoreBar } from "../../components/ProgressBar/ScoreBar";
import axiosInstance from "../../api/axiosInstance";

interface ResultDataProps {
  type: number;
  name: string;
  content: string;
  detail: string;
}

const available = [38, 43, 48, 53, 58, 63, 68, 73, 78, 83, 88];

export default function SharePage() {
  const [wrong, setWrong] = useState(false);
  const [analysisValue, setAnalysisValue] = useState([0, 0]);
  const [debt, setDebt] = useState("10,000");
  const [nickname, setNickname] = useState("알수없음")
  const [earth, setEarth] = useState(AngryEarth);
  const [earthType, setEarthType] = useState<ResultDataProps>(data["5"]);
  const axios = axiosInstance();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    
    if (!code) {
      setWrong(true);
      return;
    }

    const type = code[4];
    console.log(type)
    if (!type || !(type in data)) {
      setWrong(true);
      return;
    }
    setEarthType(data[type as keyof typeof data]);
    if (type === "1") {
      setEarth(WowEarth);
    } else if (type === "2") {
      setEarth(ChuEarth);
    } else if (type === "3") {
      setEarth(MeltingEarth);
    } else if (type === "4") {
      setEarth(CryEarth);
    }

    const implement = parseInt(code[0], 10);
    const interest = parseInt(code[3], 10);

    if (implement > 5 || interest > 5) {
      setWrong(true);
      return;
    }
    setAnalysisValue([implement, interest]);

    const testValue = parseInt(code.slice(1, 3), 10);
    if (available.includes(testValue)) {
      setDebt(String(testValue + 12) + ",000");
    } else {
      setWrong(true);
      return;
    }

    const userId = parseInt(code.slice(5), 10);
      if (userId) {
        getUserNickname(userId)
      }
  }, []);

  const getUserNickname = async (id: number) => {
    try {
      const response = await axios.get(`/member?memberId=${id}`);
      const data = response.data.member_list[0];
      setNickname(data.nickname);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainFrame>
      {wrong && (
        <WrongPage>
          <TypeName>
            <br />잘못된 접근입니다.<br /><br />
          </TypeName>
          <div>
            <LoginBtn href={`${import.meta.env.VITE_BASEURL_BACK}/login`}>
              카카오 로그인
              <ButtonLogo src="/images/kakao-logo.png" />
            </LoginBtn>
            <Gray>카카오로 로그인하고 테스트 해보세요 !</Gray>
          </div>
        </WrongPage>
      )}
      <HideUnderClock />
      <HideBottomBar />
      <ResultFrame>
        <MarginBox />
        <ResultInner>
          <TypeName>
            {nickname}님은 .. <br />
            <span>{earthType.name}</span>
          </TypeName>
          <EarthFrame>
            <Lottie animationData={earth} />
          </EarthFrame>
          <Gray dangerouslySetInnerHTML={{ __html: earthType.detail }} />
          <AnalysisBox>
            <SubTitle>진술 내역 요약</SubTitle>
            <ScoreBar title="실행력" score={analysisValue[0]} />
            <ScoreBar title="관심도" score={analysisValue[1]} />
          </AnalysisBox>
        </ResultInner>
        <MarginBox />
        <ResultInner>
          <TypeName>
            {nickname}님의 <span style={{ color: "var(--red)" }}>벌금</span>은?
            <EarthFrame>
              <Lottie animationData={Judge} />
            </EarthFrame>
            <span style={{ fontSize: "30px" }}>{debt} 그루</span>
          </TypeName>
          <Gray
            dangerouslySetInnerHTML={{ __html: earthType.content }}
            style={{ marginBottom: "12px" }}
          />
          <LoginBtn href={`${import.meta.env.VITE_BASEURL_BACK}/login`}>
            카카오로 시작하기
            <ButtonLogo src="/images/kakao-logo.png" />
          </LoginBtn>
          <Gray>▲  나도 테스트 하러 가기  ▲</Gray>
        </ResultInner>
        <MarginBox />
      </ResultFrame>
    </MainFrame>
  );
}

const MainFrame = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hide;
`;

const WrongPage = styled.div`
  position: absolute;
  left: 9%;
  top: 0;
  width: 82%;
  height: 100vh;
  z-index: 5;
  background-color: var(--white);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const LoginBtn = styled.a`
  position: relative;
  left: 0;
  right: 0;
  margin: 46px 0 16px;
  height: 42px;
  background-color: var(--kakao-yellow);
  color: var(--kakao-black);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  font-size: 17px;
  text-decoration: none;
`;

const ButtonLogo = styled.img`
  position: absolute;
  left: 18px;
  width: 28px;
`;

const ResultFrame = styled.div`
  position: absolute;
  top: env(safe-area-inset-top);
  left: 0;
  width: 100%;
  height: calc(100% - env(safe-area-inset-top));
  overflow-y: scroll;
`;

const HideUnderClock = styled.div`
  position: fixed;
  left: 0;
  width: 100%;
  top: env(safe-area-inset-top);
  height: env(safe-area-inset-top);
  background-color: var(--white);
  z-index: 3;
`;

const HideBottomBar = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: env(safe-area-inset-bottom);
  background-color: var(--white);
  z-index: 3;
`;

const MarginBox = styled.div`
  position: relative;
  width: 100%;
  height: 12%;
`;

const ResultInner = styled.div`
  padding: 0 10%;
`;

const TypeName = styled.div`
  text-align: center;
  font-size: 32px;
  font-weight: 650;
  margin-bottom: 24px;
  line-height: 48px;
  span {
    color: var(--primary);
    font-size: 36px;
  }
`;

const EarthFrame = styled.div`
  width: 70%;
  padding: 0 15%;
`;

const Gray = styled.div`
  font-size: 16px;
  margin: 28px 0;
  color: var(--dark-gray);
  text-align: center;
  span {
    font-weight: 450;
    color: var(--red);
  }
`;

const AnalysisBox = styled.div`
  width: calc(100% - 44px);
  padding: 4px 20px;
  border: 2px solid var(--primary);
  border-radius: 12px;
`;

const SubTitle = styled.div`
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: var(--black);
  padding: 12px 0 4px;
`;
