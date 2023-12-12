// import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Lottie from "lottie-react";
import AngryEarth from "../../assets/lottie/angry-earth.json";
import ChuEarth from "../../assets/lottie/chu-earth.json";
import CryEarth from "../../assets/lottie/cry-earth.json";
import MeltingEarth from "../../assets/lottie/melting-earth.json";
import WowEarth from "../../assets/lottie/wow-earth.json";
import Judge from "../../assets/lottie/judge.json";
import data from "../../common/result.json";
import { ScoreBar } from "../../components/ProgressBar/ScoreBar";
import { ReactComponent as CopySvg } from "../../assets/icons/copy_icon.svg";
import axiosInstance from "../../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";

interface ResultDataProps {
  type: number;
  name: string;
  content: string;
  detail: string;
}

const available = [38, 43, 48, 53, 58, 63, 68, 73, 78, 83, 88];

export default function ResultPage() {
  const [initCode, setInitCode] = useState("")
  const [wrong, setWrong] = useState(false);
  const [analysisValue, setAnalysisValue] = useState([0, 0]);
  const [debt, setDebt] = useState(0);
  const [earth, setEarth] = useState(AngryEarth);
  const [earthType, setEarthType] = useState<ResultDataProps>(data["5"]);
  const [shareInfo, setShareInfo] = useState([0, "알수없음"])
  const navigate = useNavigate();
  const axios = axiosInstance();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    
    if (!code) {
      setWrong(true);
      return;
    }
    setInitCode(code);

    const implement = parseInt(code[0], 10);
    const interest = parseInt(code.slice(-1), 10);
    if (implement > 5 || interest > 5) {
      setWrong(true);
      return;
    }
    setAnalysisValue([implement, interest]);

    const testValue = parseInt(code.slice(1, 3), 10);
    if (available.includes(testValue)) {
      setDebt(testValue + 12);

      if (testValue < 44) {
        setEarth(WowEarth);
        setEarthType(data["1"]);
      } else if (testValue < 56) {
        setEarth(ChuEarth);
        setEarthType(data["2"]);
      } else if (testValue < 69) {
        setEarth(MeltingEarth);
        setEarthType(data["3"]);
      } else if (testValue < 79) {
        setEarth(CryEarth);
        setEarthType(data["4"]);
      }
    } else {
      setWrong(true);
    }
  }, []);

  useEffect(() => {
    const isComplete = JSON.parse(localStorage.getItem("answer") || "{}");
    if (isComplete !== 10) {
      setWrong(true);
      return
    }
    getUserNickname()
  }, []);

  const handleClickSignup = () => {
    localStorage.setItem("testGroo", `${debt}`);
    navigate("/signup")
  }

  const shareKakao = () => {
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "어-라? 어느날 지구에게 고소당했다",
        description: `${shareInfo[1]}님의 재판 결과를 확인해보세요`,
        imageUrl:
          `https://raw.githubusercontent.com/YJS96/eara_test_repo/main/public/images/earth-${earthType.type}.png`,
        link: {
          // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
          mobileWebUrl: `${import.meta.env.VITE_BASEURL_FRONT}/earth-trial?code=${initCode}${earthType.type}${shareInfo[0]}`,
          webUrl: `${import.meta.env.VITE_BASEURL_FRONT}/earth-trial?code=${initCode}${earthType.type}${shareInfo[0]}`,
        },
      },
    });
  };

  const getUserNickname = async () => {
    try {
      const response = await axios.get(`/member/detail`);
      const data = response.data;
      setShareInfo([data.member_id, data.nickname])
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyClick = () => {
    const urlToCopy = `${import.meta.env.VITE_BASEURL_FRONT}/earth-trial?code=${initCode}${earthType.type}${shareInfo[0]}`;
    navigator.clipboard.writeText(urlToCopy)
      .then(() => {
        // console.log("URL이 클립보드에 복사되었습니다.");
        toast.success("복사되었습니다");
      })
      .catch(error => {
        console.error("클립보드에 복사하는 데 실패했습니다.", error);
      });
  };

  return (
    <MainFrame>
      <Toaster
        containerStyle={{
          position: "fixed",
          zIndex: "999",
          top: "calc(env(safe-area-inset-top) * 2 + 20px)",
        }}
      />
      {wrong && (
        <WrongPage>
          <Title>
            잘못된 접근입니다.<br /><br />
            테스트를 다시 실행해주세요
          </Title>
          <SignUpBtn onClick={() => navigate("/test")}>
            테스트 하러가기
          </SignUpBtn>
        </WrongPage>
      )}
      <Panel className="top">
        <Title>당신의</Title>
      </Panel>
      <HideUnderClock />
      <HideBottomBar />
      <ResultFrame>
        <MarginBox />
        <ResultInner>
          <TypeName>
            당신은 .. <br />
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
            당신의 <span style={{ color: "var(--red)" }}>벌금</span>은?
            <EarthFrame>
              <Lottie animationData={Judge} />
            </EarthFrame>
            <span style={{ fontSize: "30px" }}>{debt},000 그루</span>
          </TypeName>
          <Gray
            dangerouslySetInnerHTML={{ __html: earthType.content }}
            style={{ marginBottom: "12px" }}
          />
          <SmallText>* 진술한 내용을 바탕으로 벌금을 산정했어요.</SmallText>
          <EaraExplain>
            <SubTitle>일상생활 속 환경보호, 어려우신가요?</SubTitle>
            <HighLight>친구와 함께</HighLight> 실천하고 공유하며
            <br />
            동기부여가 되도록 <span>'어라'</span>가 도와줄게요
            <br />
            탄소 중립<HighLight> 혜택 정보, 내 주변 가게</HighLight> 등<br />
            다양한 정보도 놓치지 마세요 ~<br />
            <SignUpBtn onClick={handleClickSignup}>
              어라 회원가입하기
            </SignUpBtn>
          </EaraExplain>
          <SubTitle>내 결과 공유하기</SubTitle>
          <ShareBox>
            <ShareBtn>
              <img src="/images/kakao-logo.png" onClick={shareKakao} />
            </ShareBtn>
            <ShareBtn style={{ backgroundColor: "var(--gray)" }} onClick={handleCopyClick}>
              <CopySvg />
            </ShareBtn>
          </ShareBox>
        </ResultInner>
        <MarginBox />
      </ResultFrame>
      <Panel className="bottom">
        <Title>지구재판 결과는?</Title>
      </Panel>
    </MainFrame>
  );
}

const slideUp = keyframes`
  33.3% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
`;

const slideDwon = keyframes`
  33.3% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100%);
  }
`;

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

const Panel = styled.div`
  background-color: var(--white);
  width: 100%;
  height: 50%;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: end;
  &.top {
    animation: ${slideUp} 3s ease-out forwards;
  }
  &.bottom {
    justify-content: start;
    animation: ${slideDwon} 3s ease-out forwards;
  }
`;

const Title = styled.div`
  width: 100%;
  height: 40px;
  text-align: center;
  font-size: 30px;
  font-weight: 700;
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
  text-align: center;
`;

const TypeName = styled.div`
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
  font-size: 16.5px;
  margin: 28px 0;
  color: var(--dark-gray);
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
  font-size: 18px;
  font-weight: 500;
  padding: 12px 0 8px;
`;

const SmallText = styled.div`
  font-size: 13px;
  font-weight: 300;
  color: var(--red);
`;

const EaraExplain = styled.div`
  margin: 40px 0 32px;
  font-size: 17px;
  line-height: 26px;
  span {
    font-weight: 500;
    color: var(--primary);
  }
`;
const HighLight = styled.span`
  background: linear-gradient(0deg, rgb(129, 222, 173, 0.3), transparent 75%);
  color: var(--black) !important;
`;

const SignUpBtn = styled.div`
  border-radius: 20px;
  background-color: var(--third);
  color: var(--primary);
  font-size: 18px;
  font-weight: 550;
  cursor: pointer;
  margin-top: 28px;
  padding: 10px 0;
`;

const ShareBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const ShareBtn = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--kakao-yellow);
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 24px;
  }
`;
