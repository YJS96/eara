// import React from "react";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { ReactComponent as CloseIcon } from "../../assets/icons/close-icon.svg";

interface AnimationModalProps {
  isOpen: boolean;
  closeModal?: () => void;
  closeBtn?: boolean;
  children: React.ReactNode;
}

interface ModalProps {
  isOpen: boolean;
}

export default function AnimationModal({
  isOpen,
  closeModal,
  closeBtn,
  children,
}: AnimationModalProps) {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen === true) {
      setVisible(true);
    } else {
      setTimeout(() => setVisible(false), 260);
    }
  }, [isOpen]);


  if (visible === false) {
    return null;
  }

  return (
    <>
      <Background isOpen={isOpen} onClick={closeModal} />
      <ModalContainer isOpen={isOpen}>
        {closeBtn && (
          <CloseFrame>
            <CloseIcon onClick={closeModal} />
          </CloseFrame>
        )}
        <InnerContainer>{children}</InnerContainer>
      </ModalContainer>
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

const Background = styled.div<ModalProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 3;
  animation: ${({ isOpen }) => (isOpen ? fadeIn : fadeOut)} 0.3s ease-in-out;
`;

const ModalContainer = styled.div<ModalProps>`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--white);
  border-radius: 25px 25px 0px 0px;
  box-shadow: 0px -2px 16px rgba(0, 0, 0, 0.12);
  /* overflow-y: scroll; */
  overflow-x: hidden;
  z-index: 4;
  width: 88.88%;
  padding: 8% 5.56% 12%;
  animation: ${({ isOpen }) => (isOpen ? slideIn : slideOut)} 0.35s ease-in-out;
`;

const CloseFrame = styled.div`
  position: relative;
  width: 100%;
  height: 24px;
  display: flex;
  justify-content: flex-end;
`;

const InnerContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
`;
