import styled from "styled-components";

interface ButtonProps {
  width?: string;
  background?: string;
  color?: string;
}

export const ShortButton = styled.div<ButtonProps>`
  position: relative;
  width: ${(props) => props.width || "47.5%"};
  height: 42px;
  background-color: ${(props) => props.background || "var(--primary)"};
  color: ${(props) => props.color || "var(--white)"};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13.5px;
  font-weight: 400;
  cursor: pointer;
`;

export const LongButton = styled.div<ButtonProps>`
  position: relative;
  width: 100%;
  height: 44px;
  background-color: ${(props) => props.background || "var(--primary)"};
  color: ${(props) => props.color || "var(--white)"};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  font-weight: 400;
  cursor: pointer;
`;

interface FrameProps {
  padding?: string;
}

export const ButtonFrame = styled.div<FrameProps>`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  /* height: 60px; */
  padding: ${(props) => props.padding || "2.4% 6.67% 6%"};
  background: linear-gradient(
    180deg,
    rgba(253, 253, 253, 0.5) 0%,
    #fdfdfd 19.74%
  );
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;
