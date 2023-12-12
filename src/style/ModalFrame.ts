import styled from "styled-components";

export const ModalFrame = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  padding-left: 5.56%;
  padding-right: 5.56%;
  bottom: 0;
  background-color: var(--white);
  border-radius: 25px 25px 0px 0px;
  box-shadow: 0px -2px 16px rgba(0, 0, 0, 0.12);
  overflow-y: scroll;
  overflow-x: hidden;
`;

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 3;
`;
