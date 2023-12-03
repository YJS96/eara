import styled from "styled-components";
import { Analytics } from "@vercel/analytics/react";

export default function MainPage() {
  const toEara = () => {
    location.href = "https://www.ea-ra.com/login";
  };

  return (
    <>
      <MainFrame>
        <LogoFrame onClick={toEara}>
          <Logo src="/images/logo-nobackground.png" />
        </LogoFrame>
        <AppName>어라</AppName>
        <Introduce>어라가 정식 배포 되었습니다</Introduce>
        <Button onClick={toEara}>사용해보기</Button>
        <Analytics />
      </MainFrame>
    </>
  );
}

const MainFrame = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const LogoFrame = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 20px;
  background-color: var(--white);
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  position: relative;
  width: 84%;
  height: 84%;
`;

const AppName = styled.div`
  margin-top: 16px;
  font-size: 18px;
  font-weight: 400;
`;

const Introduce = styled.div`
  margin-top: 48px;
  margin-bottom: 56px;
  font-size: 15px;
`;

const Button = styled.div`
  position: absolute;
  bottom: 60px;
  width: 320px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--white);
  background-color: var(--primary);
  border-radius: 10px;
  font-weight: 400;
  font-size: 15px;
`;
