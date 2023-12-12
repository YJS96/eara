import { useEffect, useState } from "react";
import styled from "styled-components";
import NavBar from "../../components/NavBar/NavBar";
import MainFrame from "../../components/MainFrame/MainFrame";
import { ReactComponent as PigCoin } from "../../assets/icons/pig-coin.svg";
import { ShadowBox } from "../../components/ShadowBox/ShadowBox";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

import { ResponsivePie } from "@nivo/pie";

interface UserInfoProps {
  member_id: number;
  nickname: string;
  groo: number;
  bill: number;
  bill_count: number;
  profile_image_url: string;
  is_test_done: boolean;
}

interface SummaryProps {
  activity_type: string;
  point: number;
}

export default function NtzPage() {
  const [charSort, setChartSort] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoProps | null>(null);
  const [userCpoint, setUserCpoint] = useState<number>(0);
  const [summary_list, setSummaryList] = useState<SummaryProps[]>([]);
  // const [summary_list, setSummaryList] = useState([
  //   { activity_type: "TUMBLER", point: 1 },
  //   { activity_type: "ELECTRONIC_RECEIPT", point: 2 },
  // ]);
  const axios = axiosInstance();

  useEffect(() => {
    const timer = setTimeout(() => {
      setChartSort(true);
    }, 280);
    return () => clearTimeout(timer);
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await axios.get(`/member/detail`);
      const data = await response.data;
      setUserInfo(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCpoint = async () => {
    try {
      const response = await axios.get(`/cpoint`);
      const data = await response.data;
      setUserCpoint(data.cpoint);
    } catch (error) {
      console.log(error);
    }
  };

  const getSummary = async () => {
    try {
      const response = await axios.get(`/cpoint/summary`);
      const data = await response.data.summary_list;
      setSummaryList(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserInfo();
    getCpoint();
    getSummary();
  }, []);

  const navigate = useNavigate();
  //test
  const categoryList = [
    "전자영수증",
    "텀블러",
    "일회용컵 반환",
    "리필스테이션",
    "다회용기",
    "고품질 재활용품",
    "친환경제품",
    "무공해차",
    "폐휴대폰",
  ];

  const categoryInEnglish = [
    "ELECTRONIC_RECEIPT",
    "TUMBLER",
    "DISPOSABLE_CUP",
    "REFILL_STATION",
    "MULTI_USE_CONTAINER",
    "HIGH_QUALITY_RECYCLED_PRODUCTS",
    "ECO_FRIENDLY_PRODUCTS",
    "EMISSION_FREE_CAR",
    "DISCARDED_PHONE",
  ];

  var charData = [];

  const chartColor = [
    "hsl(29, 96.7%, 75.9%)",
    "hsl(233, 70%, 50%)",
    "hsl(214, 51.7%, 45.5%)",
    "hsl(314, 70%, 50%)",
    "hsl(80, 70%, 50%)",
    "hsl(210, 70%, 50%)",
    "hsl(1, 70%, 50%)",
    "hsl(169, 57.6%, 74.1%)",
    "hsl(120, 40.7%, 64.3%)",
    "hsl(265, 30.6%, 75.7%)",
  ];

  for (var i = 0; i < summary_list.length; i++) {
    var cat =
      categoryList[categoryInEnglish.indexOf(summary_list[i].activity_type)];
    charData.push({
      id: cat,
      label: cat,
      value: summary_list[i].point,
      color: chartColor[i],
    });
  }

  const navigateMap = () => {
    navigate("/netzero/map");
  };

  const navigateSubsidy = () => {
    navigate("/netzero/subsidy");
  };

  const navigateComapny = () => {
    navigate("/netzero/company");
  };

  const shareKakao = () => {
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "일상 속 작은 실천, 어라🌱",
        description: `${userInfo?.nickname}님이 어라로 초대했어요`,
        imageUrl:
          "https://github.com/YJS96/eara_test_repo/blob/main/public/images/earth-1.png?raw=true",
        link: {
          // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
          mobileWebUrl: import.meta.env.VITE_BASEURL_FRONT,
          webUrl: import.meta.env.VITE_BASEURL_FRONT,
        },
      },
    });
  };

  const highestActivity = () => {
    const highestScoring = summary_list.reduce(
      (max, item) => (item.point > max.point ? item : max),
      summary_list[0]
    );
    const index = categoryInEnglish.indexOf(highestScoring?.activity_type);
    const arr = [0, 2, 3, 5, 6, 8];
    const activity =
      categoryList[categoryInEnglish.indexOf(highestScoring?.activity_type)];

    if (arr.includes(index)) {
      return `${activity}으`;
    } else {
      return activity;
    }
  };

  return (
    <>
      {/* <HeadBar pagename="예시" bgcolor="white" backbutton="yes"/> */}
      <MainFrame
        headbar="no"
        navbar="yes"
        bgcolor="background"
        marginsize="medium"
      >
        <CPointContainer>
          <TextLine>
            <Bold>{userInfo?.nickname}</Bold>님이
          </TextLine>
          <TextLine>
            이번달 모은 <Green>탄소중립포인트</Green>는
          </TextLine>
          <CPoint>
            <Bold>
              {userCpoint
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
            </Bold>
            원
          </CPoint>
          <PigCoinFrame>
            <PigCoin />
          </PigCoinFrame>
          <Notice>
            익월 <Bold>17-21일</Bold> 중 입금될 예정입니다
          </Notice>
        </CPointContainer>

        <InfoButtonsFrame>
          <InfoButton onClick={navigateSubsidy}>
            <InfoButtonGray>내가 놓친</InfoButtonGray>
            <InfoButtonBlack>보조금 혜택</InfoButtonBlack>
            <InfoImage src="/images/netzero/subsidy.png" />
          </InfoButton>

          <InfoButton onClick={navigateMap}>
            <InfoButtonGray>내 주변</InfoButtonGray>
            <InfoButtonBlack>참여가능 매장</InfoButtonBlack>
            <InfoImage src="/images/netzero/store.png" />
          </InfoButton>

          <InfoButton onClick={navigateComapny}>
            <InfoButtonGray>참여기업</InfoButtonGray>
            <InfoButtonBlack>
              63<SmallText>개</SmallText>
            </InfoButtonBlack>
            <InfoImage src="/images/netzero/company.png" />
          </InfoButton>

          <InfoButton onClick={shareKakao} style={{ marginRight: "3.5px" }}>
            <InfoButtonGray>카카오톡으로</InfoButtonGray>
            <InfoButtonBlack>친구초대</InfoButtonBlack>
            <InfoImage src="/images/netzero/invite.png" />
          </InfoButton>
        </InfoButtonsFrame>

        <ChartContainer>
          <TextLine>
            <Bold>나의 활동 요약</Bold>
          </TextLine>
          <TextLine style={{ fontSize: "14px", marginTop: "6px" }}>
            {summary_list.length === 0
              ? "활동 탭에서 활동을 시작해보세요"
              : `${highestActivity()}로 가장 많은 포인트를 얻었어요!`}
          </TextLine>
          <ChartFrame>
            <ChartInner>
              {summary_list.length === 0 ? (
                <EmptyImageFrame>
                  <EmptyImage src="/images/netzero/ntz-empty.png" />
                </EmptyImageFrame>
              ) : (
                <ResponsivePie
                  data={charData}
                  margin={{ top: 16, right: 84, bottom: 10, left: 84 }}
                  innerRadius={0.5}
                  padAngle={1.3}
                  cornerRadius={1}
                  activeOuterRadiusOffset={8}
                  borderWidth={1}
                  borderColor={{
                    from: "color",
                    modifiers: [["darker", 0.2]],
                  }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#727272"
                  arcLinkLabelsThickness={1}
                  arcLinkLabelsDiagonalLength={16}
                  arcLinkLabelsStraightLength={10}
                  arcLinkLabelsOffset={-11}
                  arcLinkLabelsColor={{ from: "color" }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor="#1C1C1C"
                  sortByValue={charSort}
                  // legends={[
                  //   {
                  //     anchor: "right",
                  //     direction: "column",
                  //     justify: false,
                  //     translateX: 140,
                  //     translateY: 90,
                  //     itemsSpacing: 1,
                  //     itemWidth: 100,
                  //     itemHeight: 15,
                  //     itemTextColor: "#727272",
                  //     itemDirection: "left-to-right",
                  //     itemOpacity: 1,
                  //     symbolSize: 10,
                  //     symbolShape: "circle",
                  //     effects: [],
                  //   },
                  // ]}
                />
              )}
            </ChartInner>
          </ChartFrame>
        </ChartContainer>
      </MainFrame>
      <NavBar />
    </>
  );
}

const CPointContainer = styled(ShadowBox)`
  height: 308px;
  margin-top: calc(24px + env(safe-area-inset-top));
  padding-top: 20px;
  font-size: 18px;
  font-weight: 400;
`;

const TextLine = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 4px;
  margin-left: 20px;
`;

const CPoint = styled.div`
  font-size: 28px;
  margin-top: 16px;
  margin-bottom: 28px;
  margin-left: 20px;
`;

const PigCoinFrame = styled.div`
  position: relative;
  width: 100%;
  height: 116px;
  display: flex;
  justify-content: center;
`;

const Notice = styled.div`
  position: relative;
  margin-top: 38px;
  font-size: 12px;
  color: var(--dark-gray);
  font-weight: 400;
  margin-left: 20px;
`;

const Bold = styled.span`
  font-weight: 600;
`;

const Green = styled(Bold)`
  color: var(--primary);
`;

const InfoButtonsFrame = styled.div`
  position: relative;
  width: calc(100%);
  height: 132px;
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  overflow-x: auto;
`;

const InfoButton = styled.div`
  width: 110px;
  height: 116px;
  background-color: var(--white);
  border-radius: 10px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.04);
  margin-right: 16px;
`;

const InfoButtonGray = styled.div`
  position: relative;
  margin-top: 14px;
  margin-left: 12px;
  color: var(--dark-gray);
  font-size: 12px;
  font-weight: 400;
`;

const InfoButtonBlack = styled.div`
  position: relative;
  margin-top: 4px;
  margin-left: 12px;
  font-size: 14px;
  font-weight: 600;
`;

const SmallText = styled.span`
  font-size: 11px;
  font-weight: 400;
`;

const InfoImage = styled.img`
  position: absolute;
  width: 52px;
  height: auto;
  bottom: 13px;
  margin-left: 53.5px;
`;

const ChartContainer = styled(CPointContainer)`
  height: 324px;
  margin-top: 8px;
  margin-bottom: 16px;
`;

const ChartFrame = styled.div`
  position: relative;
  margin-top: 8px;
  width: 100%;
  height: 260px;
  display: flex;
  justify-content: center;
`;

const ChartInner = styled.div`
  position: relative;
  width: 100%;
  max-width: 372px;
  height: 100%;
  /* max-width: 380px; */

  div {
    font-size: 14px;
    color: var(--black);
  }
`;

const EmptyImage = styled.img`
  height: 64%;
  width: auto;
`;

const EmptyImageFrame = styled.div`
  width: 100%;
  height: 260px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
