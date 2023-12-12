// import React from 'react'
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLottie } from 'lottie-react';
import Letter from "../../assets/lottie/letter.json"
import styled, { keyframes } from "styled-components";
import MainFrame from "../../components/MainFrame/MainFrame";

export default function StartPage() {
  const [isClick, setIsClick] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isShow, setIsShow] = useState(false);
  const navigate = useNavigate();

  const options = {
    animationData: Letter,
    loop: false,
    autoplay: false,
  };

  const { View, play } = useLottie(options);
  const animationPlayed = useRef(false);
  
  const handleAnimationClick = () => {
    setIsClick(true);
    play();
    animationPlayed.current = true;

    const timer = setTimeout(() => {
      setIsModalOpen(false);
    }, 3200); 
    
    const timer2 = setTimeout(() => {
      setIsShow(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  };

  const handleBtnClick = () => {
    navigate("/test");
  };

  return (
    <>
      {isModalOpen ? (
        <ModalFrame>
          <Noti>
            📬 메세지가 도착했어요
            <LottieStyled isClick = {isClick} onClick={handleAnimationClick}>
              {View}
            </LottieStyled >
            <Text>우편을 클릭해 내용을 확인하세요!</Text>
          </Noti>
        </ModalFrame>
      ) : (
        <MainFrame headbar="no" navbar="no" marginsize="large" bgcolor="">
          <LetterDetail>
            <Title><Red>고소장</Red>이 도착했어요 !!</Title>
            <ImgBox src="/images/plaint.png"/>
            <Text>
              <span>환경오염의 주범</span>으로 <Highlight>지구에게 고소</Highlight>당했습니다<br/>
              당신에게 <Red>벌금형</Red>이 가해지며,<br/>
              <Highlight>지구 재판</Highlight>을 통해 벌금이 정해집니다<br/><br/>
              평소 생각이나 행동을 솔직하게 진술해주세요<br/>
            </Text>
          </LetterDetail>
          <MarginFrame />
        </MainFrame>
      )}
      {isShow && (
        <NavBarFrame>
          <StartBtn onClick={handleBtnClick}>지구 재판받기</StartBtn>
        </NavBarFrame>
      )}
    </>
  );
}

const bounce = keyframes`
  from {
    opacity: 0;
    transform: scale(0);
  }
`;

const scale = keyframes`
  0% {transform: scale(1);}
  50% {transform: scale(0.9);}
  100% {transform: scale(1);}
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {transform: translateY(0%);}
`;

const ImgBox = styled.img`
  width: 84%;
  padding: 0 8%;
  margin: 8% 0 14%;
`;

const Title = styled.div`
  margin-top: 96px;
  width: 100%;
  text-align: center;
  font-size: 22.5px;
  font-weight: 600;
`;

const Red = styled.span`
  color: var(--red);
`;

const Text = styled.div`
  padding: 0 12px;
  font-size: 16px;
  font-weight: 350;
  color: var(--dark-gray);
  text-align: center;
  line-height: 24px;
  animation: ${bounce} 1s cubic-bezier(0.5, 0, 0.5, 1) forwards;

  span {
    font-weight: 400;
  }
`;

const Highlight = styled.span`
  background: linear-gradient(0deg, rgb(254, 226, 39, 0.6), transparent 75%);
`;

const StartBtn = styled.div`
  position: relative;
  border-radius: 20px;
  background-color: var(--third);
  color: var(--primary);
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  margin: 16px 24px;
  padding: 16px 0;
  animation: ${scale} 2s 10;
`;

const MarginFrame = styled.div`
  width: 100%;
  height: 18.5%;
  background-color: var(--white);
`;

const NavBarFrame = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 16%;
  z-index: 2;
  background-color: var(--white);
`;

const ModalFrame = styled.div`
  position: absolute;
  top: calc(5% + env(safe-area-inset-top));
  left: 0;
  width: 80%;
  padding: 20% 10%;
  background-color: var(--white);
  z-index: 3;
`;

const Noti = styled.div`
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  animation: ${fadeIn} 0.8s;
  margin-top: 10%;
`;

const shake = keyframes`
  0%, 70% {
    transform: translateX(0);
  }
  61%, 63%, 65%, 67%, 69% {
    transform: translateX(-5px);
  }
  62%, 64%, 66%, 68% {
    transform: translateX(5px);
  }
`;

const LottieStyled = styled.div<{isClick: boolean}>`
  animation: ${shake} 10s ease-in-out infinite;
  animation-play-state: ${(props) => props.isClick ? "paused" : "running"};
  margin-bottom: 20px;
  cursor: pointer;
`;

const LetterDetail = styled.div`
  padding-top: 16px;
  animation: ${bounce} 1s cubic-bezier(0.5, 0, 0.5, 1) forwards;
`;