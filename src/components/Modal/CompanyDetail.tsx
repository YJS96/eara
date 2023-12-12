// import React from "react";
import { useState } from "react";
import { ModalFrame, ModalBackground } from "../../style/ModalFrame";
import styled, { keyframes } from "styled-components";
// import { ModalBackground } from "./ModalBackground";
import { ReactComponent as CloseIcon } from "../../assets/icons/close-icon.svg";
import { LongButton } from "../../style";
import axiosInstance from "../../api/axiosInstance";

interface CompanyInfoProps {
  id: number;
  name: string;
  logo: string;
  detail: string;
}

interface CompanyDetailProps {
  closeModal: () => void;
  companyInfo: CompanyInfoProps;
  isConnected: boolean;
}

interface BackgroundProps {
  isclosing: boolean;
}

interface ModalProps {
  isclosing: boolean;
}

export default function CompanyDetail({
  closeModal,
  companyInfo,
  isConnected,
}: CompanyDetailProps) {
  const [isclosing, setIsClosing] = useState(false);
  const axios = axiosInstance();

  const closeAndAnimate = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeModal();
    }, 260);
  };

  const saveAndClose = () => {
    if (isConnected) {
      disconnectCompany();
    } else {
      connectCompany();
    }
    closeAndAnimate();
    setTimeout(() => {
      location.reload();
    }, 260);
  };

  const connectCompany = async () => {
    try {
      const response = await axios.post(
        `/cpoint/company/${companyInfo.id}/connect`
      );
      // @ts-ignore
      const data = await response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectCompany = async () => {
    try {
      const response = await axios.delete(
        `/cpoint/company/${companyInfo.id}/connect`
      );
      // @ts-ignore
      const data = await response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Background isclosing={isclosing} onClick={closeAndAnimate} />
      <CompanyDetailModal isclosing={isclosing}>
        <CloseFrame>
          <CloseModalButton onClick={closeAndAnimate} />
        </CloseFrame>
        <InnerContainer>
          {/* 이미지로 바꾸기 */}
          <Logo src={companyInfo?.logo} />
          <CompanyName>{companyInfo?.name}</CompanyName>
          <CompanyPoints>{companyInfo?.detail}</CompanyPoints>
          {isConnected ? (
            <ConnectedButton onClick={saveAndClose}>
              연동해제할게요
            </ConnectedButton>
          ) : (
            <ConnectButton onClick={saveAndClose}>연동할래요</ConnectButton>
          )}
        </InnerContainer>
      </CompanyDetailModal>
    </>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
`;

const Background = styled(ModalBackground)<BackgroundProps>`
  z-index: 3;
  animation: ${({ isclosing }) => (isclosing ? fadeOut : fadeIn)} 0.3s
    ease-in-out;
`;

const CompanyDetailModal = styled(ModalFrame)<ModalProps>`
  padding: 7.2% 5.56% 12%;
  z-index: 4;
  animation: ${({ isclosing }) => (isclosing ? slideOut : slideIn)} 0.35s
    ease-in-out;
`;

const CloseFrame = styled.div`
  position: relative;
  width: 100%;
  height: 24px;
  display: flex;
  justify-content: flex-end;
`;

const CloseModalButton = styled(CloseIcon)`
  position: relative;
`;

const InnerContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// img로 바꾸기
const Logo = styled.img`
  margin-top: 20px;
  height: 92px;
  max-width: 92%;
`;

const CompanyName = styled.span`
  margin-top: 24px;
  font-size: 19px;
  font-size: 400;
`;

const CompanyPoints = styled.span`
  margin-top: 8px;
  font-size: 13px;
  color: var(--dark-gray);
  margin-bottom: 36px;
`;

const ConnectButton = styled(LongButton)`
  width: 86.25%;
  height: 40px;
  font-size: 14px;
`;

const ConnectedButton = styled(ConnectButton)`
  background-color: var(--gray);
  color: var(--black);
`;
