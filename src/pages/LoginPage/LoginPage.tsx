// import React from 'react'
import { useEffect, useState } from "react";
import styled from "styled-components";
import MainFrame from "../../components/MainFrame/MainFrame";
import AnimationModal from "../../components/Modal/AnimationModal";
import { ReactComponent as LoginBackgroundSVG } from "../../assets/icons/login-background.svg";
import { ReactComponent as Download } from "../../assets/icons/download-icon.svg";
import { ReactComponent as SafariShare } from "../../assets/icons/safari-share.svg";
import { ReactComponent as SafariAdd } from "../../assets/icons/safari-add.svg";
import { LongButton } from "../../style";
import { usePWAInstall } from "react-use-pwa-install";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const helpURL = "http://pf.kakao.com/_xbxhxgsG";
  const netZeroURL = "https://cpoint.or.kr/netzero/main.do";
  const navigate = useNavigate();

  const install = usePWAInstall();

  const [isIOS, setIsIOS] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const isDeviceIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
    setIsIOS(isDeviceIOS);
  }, []);

  const closeModal = () => {
    setModalOpen(false);
  };

  const openModalFunction = () => {
    setModalOpen(true);
  };

  const vercelLogin = () => {
    alert(
      "테스트 서버입니다.\n카카오 로그인 없이 회원가입 페이지로 이동합니다"
    );
    navigate("/welcome");
  };

  return (
    <>
      <MainFrame headbar="no" navbar="no" bgcolor="white" marginsize="no">
        <BackgroundFrame>
          <LoginBackground />
        </BackgroundFrame>
        <ButtonsFrame>
          <EARA>
            <EARABold>어 - 라?</EARABold>
            <br />
            어느 날 갑자기
            <br />
            지구가 당신을
            <br />
            고소한다면?
          </EARA>
          <KakaoButton onClick={vercelLogin}>
            카카오로 시작하기
            <ButtonLogo src="images/kakao-logo.png" />
          </KakaoButton>
          {isIOS ? (
            <InstallButton onClick={openModalFunction}>
              어플리케이션 설치
              <DownloadIcon />
            </InstallButton>
          ) : (
            <InstallButton onClick={install}>
              어플리케이션 설치
              <DownloadIcon />
            </InstallButton>
          )}
          <HelpButtonsFrame>
            <HelpButton
              onClick={() => {
                window.open(helpURL);
              }}
            >
              고객센터 문의하기
            </HelpButton>
            <HelpButton
              onClick={() => {
                window.open(netZeroURL);
              }}
            >
              탄소중립포인트제도
            </HelpButton>
          </HelpButtonsFrame>
        </ButtonsFrame>
      </MainFrame>
      <AnimationModal
        isOpen={modalOpen}
        closeModal={closeModal}
        closeBtn={true}
      >
        <IOSInfoLine style={{ marginTop: "28px" }}>
          Safari&nbsp;<span>중앙 하단</span>의 &nbsp;
          <SafariShare />
          &nbsp;에서
        </IOSInfoLine>
        <IOSInfoLine>
          <span>홈 화면에 추가</span> &nbsp;
          <SafariAdd />
          &nbsp;를
        </IOSInfoLine>
        <IOSInfoLine>
          클릭해 어플리케이션을&nbsp;<span>설치</span>하세요
        </IOSInfoLine>
        <ConfirmButton onClick={closeModal}>확인</ConfirmButton>
      </AnimationModal>
    </>
  );
}

const BackgroundFrame = styled.div`
  left: 0;
  right: 0;
  height: 45%;
  display: flex;
  justify-content: center;
`;

const LoginBackground = styled(LoginBackgroundSVG)`
  position: relative;
  width: auto;
  height: 100%;
  transform: scale(2.36) translate(11.9%, -15%);
`;

const EARA = styled.div`
  margin-bottom: 48px;
  font-size: 1.625em;
  font-weight: 400;
  line-height: 1.4em;
  margin-left: 13.56%;
`;

const EARABold = styled.span`
  font-size: 1em;
  font-weight: 600;
  line-height: 2em;
`;

// const LogoImage = styled.img`
//   position: absolute;
//   top: calc(45% + 112px);
//   width: 34%;
//   right: 6%;
// `

const ButtonsFrame = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 60%;
`;

const KakaoButton = styled.a`
  position: relative;
  left: 0;
  right: 0;
  margin: 0px 6.67%;
  height: 46px;
  background-color: var(--kakao-yellow);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 550;
  font-size: 14px;
  color: var(--kakao-black);
  text-decoration: none;
`;

const InstallButton = styled(KakaoButton)`
  background-color: var(--black);
  color: var(--white);
  font-weight: 450;
  margin-top: 16px;
`;

const ButtonLogo = styled.img`
  position: absolute;
  left: 18px;
  width: 28px;
`;

const DownloadIcon = styled(Download)`
  position: absolute;
  left: 18px;
`;

const HelpButtonsFrame = styled.div`
  position: relative;
  left: 0;
  right: 0;
  height: 40px;
  margin-top: 24px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 26px;
`;

const HelpButton = styled.div`
  font-size: 13px;
  color: var(--dark-gray);
  font-weight: 500;
`;

const IOSInfoLine = styled.div`
  display: flex;
  height: 32px;
  margin-top: 12px;
  align-items: center;
  font-size: 17px;
  font-weight: 400;

  span {
    font-weight: 500;
  }
`;

const ConfirmButton = styled(LongButton)`
  width: 86.25%;
  height: 40px;
  margin-top: 40px;
`;
