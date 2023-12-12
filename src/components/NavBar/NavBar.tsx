// import React from 'react'
import { css, styled } from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as MainSvg } from "../../assets/icons/main-icon.svg";
import { ReactComponent as FeedSvg } from "../../assets/icons/feed-icon.svg";
import { ReactComponent as ActSvg } from "../../assets/icons/act-icon.svg";
import { ReactComponent as NTZSvg } from "../../assets/icons/ntz-icon.svg";
import { ReactComponent as MyPageSvg } from "../../assets/icons/mypage-icon.svg";

const NavBar = () => {
  const location = useLocation();

  return (
    <NavBarFrame>
      <NavBarInner>
        <LinkTab
          to="/main"
          active={
            location.pathname === "/main" ||
            location.pathname === "/notice" ||
            location.pathname === "/calendar"
          }
        >
          <MainSvg />
          <TabTitle>홈</TabTitle>
        </LinkTab>
        <LinkTab to="/feed" active={location.pathname.includes("feed")}>
          <FeedSvg />
          <TabTitle>피드</TabTitle>
        </LinkTab>
        <LinkTab to="/act" active={location.pathname.includes("act")}>
          <ActSvg />
          <TabTitle>활동</TabTitle>
        </LinkTab>
        <LinkTab to="/netzero" active={location.pathname.includes("netzero")}>
          <NTZSvg />
          <TabTitle>탄소중립</TabTitle>
        </LinkTab>
        <LinkTab to="/mypage" active={location.pathname.includes("mypage")}>
          <MyPageSvg />
          <TabTitle>계정</TabTitle>
        </LinkTab>
      </NavBarInner>
    </NavBarFrame>
  );
};

export default NavBar;

const NavBarFrame = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 76px;
  display: flex;
  border-top: 1px solid var(--gray);
  background-color: var(--white);
  justify-content: center;
  color: var(--nav-gray);
  z-index: 2;
`;

const NavBarInner = styled.div`
  position: relative;
  width: 91%;
  display: flex;
`;

const LinkTab = styled(Link)<{ active: boolean }>`
  position: relative;
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: var(--nav-gray);

  ${(props) =>
    props.active &&
    css`
      color: var(--black); // 활성 탭에 대한 스타일을 지정하세요.
      path {
        fill: var(--black);
      }
      rect {
        fill: var(--black);
      }
      circle {
        fill: var(--black);
      }
    `}
`;

const TabTitle = styled.div`
  font-size: 11.5px;
  font-weight: 500;
  margin-top: 4px;
  margin-bottom: 16px;
`;
