// import React from 'react'
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import HeadBar from "../../components/HeadBar/HeadBar";
import MainFrame from "../../components/MainFrame/MainFrame";
import styled from "styled-components";
import { ReactComponent as LeftArrow } from "../../assets/icons/left-arrow.svg";
import { ShadowBox } from "../../components/ShadowBox/ShadowBox";
import toast, { Toaster } from "react-hot-toast";

export default function ActPage() {
  const navigate = useNavigate();
  const imageBox = useRef<HTMLDivElement | null>(null);
  const [num, setNum] = useState<number>(1);
  const [carouselTransition, setCarouselTransition] = useState("");
  const images = ["/images/bn1.png", "/images/bn2.png", "/images/bn1.png"];
  const cloneImages = [images[images.length - 1], ...images, images[0]];
  const lastImage = cloneImages.length - 1;

  useEffect(() => {
    if (num == lastImage) handleOriginSlide(1);
    else if (num === 0) handleOriginSlide(lastImage - 1);
  }, [cloneImages.length, lastImage, num]);

  useEffect(() => {
    const checkPosted = localStorage.getItem("checkPosted") || "noPost";

    if (checkPosted === "actPosted") {
      toast.success("인증 게시물을 작성했어요");
    } else if (checkPosted === "reportPosted") {
      toast("경고장을 전송했어요", {
        icon: "🚨",
      });
    }
    localStorage.removeItem("checkPosted");

    const timer = setInterval(() => {
      setNum((num) => num + 1);
      setCarouselTransition("transform 500ms ease-in-out");
    }, 3500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  function handleSlide(direction: string) {
    direction === "prev" ? setNum((num) => num - 1) : setNum((num) => num + 1);
    setCarouselTransition("transform 500ms ease-in-out");
  }

  function handleOriginSlide(index: number): void {
    setTimeout(() => {
      setNum(index);
      setCarouselTransition("");
    }, 500);
  }

  // const customVH = window.innerHeight * 0.01;
  // document.documentElement.style.setProperty("--vh", customVH + "px");
  // window.addEventListener("resize", () => {
  //   document.documentElement.style.setProperty("--vh", customVH + "px");
  // });

  return (
    <>
      <Toaster
        containerStyle={{
          position: "fixed",
          zIndex: "999",
          top: "calc(env(safe-area-inset-top) * 2 + 20px)",
        }}
      />
      <HeadBar pagename="활동 인증" bgcolor="background" backbutton="no" />
      <MainFrame
        headbar="yes"
        navbar="yes"
        bgcolor="background"
        marginsize="no"
      >
        <CarouselContainer>
          <Carousel
            style={{
              transition: `${carouselTransition}`,
              transform: `translateX(-${num * 100}%)`,
            }}
            ref={imageBox}
          >
            {cloneImages.map((image, idx) => {
              return <BannerImg key={idx} src={image} alt={`Image ${idx}`} />;
            })}
          </Carousel>
          <CarouselControls>
            <LeftArrow onClick={() => handleSlide("prev")} />
            <RightArrow onClick={() => handleSlide("next")} />
          </CarouselControls>
        </CarouselContainer>

        <ActsContainer>
          <ActRowFrame style={{ height: "25.7%", fontSize: "2.1vh" }}>
            <CustomShadowBox
              style={{ paddingTop: "4%" }}
              onClick={() => navigate("/act/post?type=1")}
            >
              전자영수증
              <SubText style={{ marginTop: "3px" }}>
                종이 영수증 대신
                <br />
                전자영수증을
                <br />
                발급받았어요
              </SubText>
              <Receipt src="/images/act-index/e-receipt.png" />
            </CustomShadowBox>
            <CustomShadowBox
              style={{ paddingTop: "4%" }}
              onClick={() => navigate("/act/post?type=2")}
            >
              텀블러•다회용컵
              <SubText style={{ marginTop: "3px" }}>
                카페 갈 때 텀블러를
                <br />
                지참했어요
              </SubText>
              <Tumbler src="/images/act-index/tumbler.png" />
            </CustomShadowBox>
          </ActRowFrame>

          <ActRowFrame>
            <CustomShadowBox onClick={() => navigate("/act/post?type=3")}>
              일회용컵 반환
              <SubText>사용한 일회용품을 반납했어요</SubText>
              <Cup src="/images/act-index/cup.png" />
            </CustomShadowBox>
          </ActRowFrame>

          <ActRowFrame style={{ height: "14.6%" }}>
            <CustomShadowBox onClick={() => navigate("/act/post?type=4")}>
              리필스테이션
              <SubText>
                리필스테이션을
                <br />
                이용했어요
              </SubText>
              <Station src="/images/act-index/station.png" />
            </CustomShadowBox>
            <CustomShadowBox onClick={() => navigate("/act/post?type=5")}>
              다회용기
              <SubText>
                다회용기에
                <br />
                음식을 포장했어요
              </SubText>
              <Container src="/images/act-index/container.png" />
            </CustomShadowBox>
          </ActRowFrame>

          <ActRowFrame>
            <CustomShadowBox onClick={() => navigate("/act/post?type=6")}>
              고품질 재활용품
              <SubText>이건 왜 환경에 도움이 되는걸까? 왜일까??</SubText>
              <HQReusable src="/images/act-index/hq-reusable.png" />
            </CustomShadowBox>
          </ActRowFrame>
          <ActRowFrame style={{ height: "11.8%", fontSize: "1.9vh" }}>
            <CustomShadowBox onClick={() => navigate("/act/post?type=7")}>
              친환경제품
              <EcoFreindly src="/images/act-index/eco-friendly.png" />
            </CustomShadowBox>
            <CustomShadowBox onClick={() => navigate("/act/post?type=8")}>
              무공해차
              <EV src="/images/act-index/ev.png" />
            </CustomShadowBox>
            <CustomShadowBox onClick={() => navigate("/act/post?type=9")}>
              폐휴대폰
              <Phone src="/images/act-index/phone.png" />
            </CustomShadowBox>
          </ActRowFrame>

          <ActRowFrame>
            <CustomShadowBox onClick={() => navigate("/act/post?type=10")}>
              기타
              <SubText>지구를 보호했어요</SubText>
              <ETC src="/images/act-index/etc.png" />
            </CustomShadowBox>
            <CustomShadowBox onClick={() => navigate("/act/report")}>
              경고장 보내기
              <SubText>환경파괴를 목격했어요</SubText>
              <Report src="/images/act-index/report.png" />
            </CustomShadowBox>
          </ActRowFrame>
        </ActsContainer>
      </MainFrame>
      <NavBar />
    </>
  );
}

const CarouselContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
`;

const Carousel = styled.div`
  display: flex;
`;

const CarouselControls = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`;

const BannerImg = styled.img`
  width: 100%;
`;

const RightArrow = styled(LeftArrow)`
  transform: scaleX(-1);
`;

const CustomShadowBox = styled(ShadowBox)`
  padding: 3% 4%;
  font-weight: 550;
  cursor: pointer;
  overflow: hidden;
`;

const ActsContainer = styled.div`
  position: relative;
  margin: 32px 5.56% 12px;
  display: flex;
  flex-direction: column;
  height: 86%;
  gap: 2%;
`;

const ActRowFrame = styled.div`
  position: relative;
  width: 100%;
  height: 12.5%;
  display: flex;
  justify-content: center;
  gap: 3.5%;
  font-size: 2vh;
`;

const SubText = styled.div`
  color: var(--dark-gray);
  font-size: 1.3vh;
  font-weight: 400;
  margin-top: 3px;
  z-index: 3;
`;

const Receipt = styled.img`
  position: absolute;
  height: 48.65%;
  right: 4%;
  bottom: 7.43%;
`;

const Tumbler = styled.img`
  position: absolute;
  height: 48.65%;
  right: 7.69%;
  bottom: 6.76%;
`;

const Cup = styled.img`
  position: absolute;
  height: 93.75%;
  right: 0.72%;
  bottom: -14.06%;
`;

const Station = styled.img`
  position: absolute;
  height: 55%;
  right: 5.13%;
  bottom: 10%;
`;

const Container = styled.img`
  position: absolute;
  height: 55%;
  right: 6.4%;
  bottom: 9.6%;
`;

const HQReusable = styled.img`
  position: absolute;
  height: 82.81%;
  right: 3.7%;
  bottom: -1px;
`;

const EcoFreindly = styled.img`
  position: absolute;
  height: 56.67%;
  right: 7%;
  bottom: -10%;
`;

const EV = styled.img`
  position: absolute;
  height: 60%;
  right: 8%;
  bottom: 0px;
`;

const Phone = styled.img`
  position: absolute;
  height: 60%;
  right: 7.8%;
  bottom: -10%;
`;

const ETC = styled.img`
  position: absolute;
  height: 48%;
  right: 9.2%;
  bottom: 10.94%;
`;

const Report = styled.img`
  position: absolute;
  height: 48%;
  right: 11.2%;
  bottom: 9.38%;
  z-index: 0;
`;
