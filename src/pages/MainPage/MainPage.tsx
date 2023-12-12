import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useLottie } from "lottie-react";
import styled from "styled-components";
import NavBar from "../../components/NavBar/NavBar";
import MainFrame from "../../components/MainFrame/MainFrame";
import { ModalFrame } from "../../style/ModalFrame";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { ShortButton } from "../../style";
// import axiosInstance from "../../api/axiosInstance";
// import { useState, useEffect } from "react";

import { ReactComponent as Notification } from "../../assets/icons/notification-icon.svg";
import AngryEarth from "../../assets/lottie/angry-earth.json";
import ChuEarth from "../../assets/lottie/chu-earth.json";
import CryEarth from "../../assets/lottie/cry-earth.json";
import MeltingEarth from "../../assets/lottie/melting-earth.json";
import WowEarth from "../../assets/lottie/wow-earth.json";

interface UserInfoProps {
  member_id: number;
  nickname: string;
  groo: number;
  bill: number;
  bill_count: number;
  profile_image_url: string;
  is_test_done: boolean;
  repay_groo: number;
}

interface WeeklyProps {
  date: string;
  proof_count: number;
}

// function getCurrentWeek() {
//   const day = new Date();
//   const sunday = day.getTime() - 86400000 * day.getDay();

//   day.setTime(sunday);

//   const result = [day.toISOString().slice(0, 10)];

//   for (let i = 1; i < 7; i++) {
//     day.setTime(day.getTime() + 86400000);
//     result.push(day.toISOString().slice(0, 10));
//   }

//   return result;
// }

const getCountColor = (count: number): string => {
  if (count === 0) {
    return "var(--gray)";
  } else if (count === -1) {
    return "var(--white)";
  } else if (count <= 1) {
    return "var(--third)";
  } else if (count <= 2) {
    return "var(--secondary)";
  } else {
    return "var(--primary)";
  }
};

export default function MainPage() {
  // const [userInfo, setUserInfo] = useState<UserInfoProps | null>(null);
  // const [groo_saving_list, setGrooSavingList] = useState<WeeklyProps[] | null>(
  //   null
  // );
  // const [progress, setProgress] = useState(0);
  // const [grooInit, setGrooInit] = useState(0);
  // const [lottieIndex, setLottieIndex] = useState(0);

  const grooInit = Number(JSON.parse(localStorage.getItem("testGroo") || "0")) * 1000;
  const progress = 50;

  function getWeekDates() {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 일요일: 0, 토요일: 6

    // 현재 날짜에서 현재 요일을 빼면 이번 주 일요일의 날짜를 얻을 수 있음
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDay);

    const weekDates = [];

    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(startOfWeek);
      weekDay.setDate(startOfWeek.getDate() + i);
      weekDates.push(weekDay.toISOString().split("T")[0]); // 날짜만 추출
    }

    return weekDates;
  }

  const weekDates = getWeekDates();

  const lottieList = [WowEarth, ChuEarth, MeltingEarth, CryEarth, AngryEarth];
  
  
  var nickname = localStorage.getItem("newNickname") || "환경구해";
  // if (nickname === "") {
  //   nickname = "환경구해"
  // }

  const userInfo: UserInfoProps = {
    member_id: 1,
    nickname: nickname,
    groo: grooInit/2,
    bill: 3200,
    bill_count: 4,
    profile_image_url:
      "https://github.com/YJS96/eara_test_repo/blob/main/public/images/logo-nobackground.png?raw=true",
    is_test_done: true,
    repay_groo: 400,
  };

  const groo_saving_list: WeeklyProps[] = [
    {
      date: weekDates[0],
      proof_count: 1,
    },
    {
      date: weekDates[1],
      proof_count: 2,
    },
    {
      date: weekDates[2],
      proof_count: 4,
    },
    {
      date: weekDates[3],
      proof_count: 0,
    },
    {
      date: weekDates[4],
      proof_count: 2,
    },
    {
      date: weekDates[5],
      proof_count: 6,
    },
    {
      date: weekDates[6],
      proof_count: 2,
    },
  ];

  


  const navigate = useNavigate();
  // const axios = axiosInstance();

  const toNotification = () => {
    navigate("/notice");
  };

  const toMonthCal = () => {
    navigate("/calendar");
  };

  const toAct = () => {
    navigate("/act");
  };

  const options = {
    animationData: lottieList[0],
    loop: false,
    autoplay: true,
  };

  const { View, play, stop } = useLottie(options);

  const handleAnimationClick = () => {
    stop();
    play();
  };

  const date = new Date();
  const month = Number(moment(date).format("MM"));
  const day = Number(moment(date).format("DD"));
  const dateString = `${month}월 ${day}일`;

  // const currentWeek = getCurrentWeek();

  // const onlyDay = currentWeek.map((date) => {
  //   const lastTwoChars: string = date.slice(-2);
  //   if (lastTwoChars.startsWith("0")) {
  //     return lastTwoChars.substring(1);
  //   }
  //   return lastTwoChars;
  // });

  // const getUserInfo = async () => {
  //   try {
  //     const response = await axios.get(`/member/detail`);
  //     const data = await response.data;
  //     if (data.member_id && !data.is_test_done) {
  //       navigate("/welcome")
  //     }
  //     setUserInfo(data);
  //     setGrooInit(data.groo);
  //     var b = Math.round((data.repay_groo / data.groo) * 100);
  //     if (data.groo === 0) {
  //       b = 0;
  //     }
  //     setProgress(b);
  //   } catch (error) {
  //     navigate("/login")
  //   }
  // };

  // const getWeekAct = async () => {
  //   try {
  //     const response = await axios.get(`/groo/current-week`);
  //     const data = await response.data.groo_saving_list;
  //     setGrooSavingList(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const getDayAct = async () => {
  //   try {
  //     const response = await axios.get(`/groo/today`);
  //     const data = await response.data;
  //     const proofCount = data.proof_count;
  //     const accusCount = data.accusation_count;

  //     if (proofCount > 0 && accusCount === 0) {
  //       setLottieIndex(0);
  //     } else if (proofCount > 0 && accusCount > 0 && proofCount >= accusCount) {
  //       setLottieIndex(1);
  //     } else if (proofCount > 0 && accusCount > 0 && proofCount < accusCount) {
  //       setLottieIndex(2);
  //     } else if (proofCount === 0 && accusCount === 0) {
  //       setLottieIndex(3);
  //     } else if (proofCount === 0 && accusCount > 0) {
  //       setLottieIndex(4);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getUserInfo();
  //   getWeekAct();
  //   getDayAct();
  // }, []);

  return (
    <>
      <MainFrame headbar="no" navbar="yes" bgcolor="third" marginsize="no">
        <NotiBar>
          <NotificationIcon onClick={toNotification} />
        </NotiBar>
        <EarthFrame>
          <TodayEarth>
            오늘의 지구
            <div>활동을 통해 지구 상태를 바꿔보세요!</div>
          </TodayEarth>
          <EarthLottie onClick={handleAnimationClick}>{View}</EarthLottie>
        </EarthFrame>
        <HomeFrame>
          <ShowDate>{dateString} 기준</ShowDate>
          <NicknameLine>
            <Bold>{userInfo?.nickname}</Bold>님의 남은 빚
          </NicknameLine>
          <GreenLeft>
            <Bold>
              {userInfo?.groo &&
                userInfo?.groo
                  .toString()
                  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
            </Bold>
            그루
          </GreenLeft>

          <ProgressBar progress={progress} greeninit={grooInit} />

          <SummaryText>주간 활동 요약</SummaryText>

          <WeekdayFrame>
            <WeekNameFrame>
              <WeekName>일</WeekName>
              <WeekName>월</WeekName>
              <WeekName>화</WeekName>
              <WeekName>수</WeekName>
              <WeekName>목</WeekName>
              <WeekName>금</WeekName>
              <WeekName>토</WeekName>
            </WeekNameFrame>
            {groo_saving_list.map((dayNum, index) => (
              <OneDay>
                <DayNumberFrame>
                  <DayNumber>{moment(dayNum.date).format("DD")}</DayNumber>
                  {moment(dayNum.date).format("DD") ===
                  moment(date).format("DD") ? (
                    <DayNumberCircle />
                  ) : null}
                </DayNumberFrame>
                {groo_saving_list &&
                Number(moment(groo_saving_list[index].date).format("YYMMDD")) -
                  Number(moment(date).format("YYMMDD")) >
                  0 ? (
                  <DayProgress count={getCountColor(-1)}></DayProgress>
                ) : (
                  <DayProgress
                    count={
                      groo_saving_list
                        ? getCountColor(groo_saving_list[index].proof_count)
                        : getCountColor(-1)
                    }
                  />
                )}
              </OneDay>
            ))}
          </WeekdayFrame>

          <ButtonsFrame>
            <ShortButton
              background="var(--third)"
              color="var(--primary)"
              onClick={toAct}
            >
              남은 빚 갚기
            </ShortButton>
            <ShortButton onClick={toMonthCal}>월별 내역</ShortButton>
          </ButtonsFrame>
        </HomeFrame>
      </MainFrame>
      <NavBar />
    </>
  );
}

const NotiBar = styled.div`
  position: relative;
  height: 26px;
  width: 100%;
  margin-top: max(calc(env(safe-area-inset-top) + 4px), 28px);
  margin-bottom: 20px;
`;

const NotificationIcon = styled(Notification)`
  position: absolute;
  right: 5.56%;
  filter: drop-shadow(2px 2px 6px rgba(0, 0, 0, 0.12));
`;

const EarthFrame = styled.div`
  width: 100%;
  min-height: calc(43.6% - 74px);
  height: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -24px;
`;

const TodayEarth = styled.div`
  text-align: center;
  font-size: 24px;
  font-weight: 550;
  line-height: 30px;
  color: var(--primary);
  div {
    font-size: 16px;
    color: var(--dark-gray);
    font-weight: 400;
  }
`;

const EarthLottie = styled.div`
  width: 52%;
  padding-top: 8px;
  cursor: pointer;
`;

const HomeFrame = styled(ModalFrame)`
  padding: 0px 5.56%;
  max-height: 56%;
  font-weight: 400;
  overflow-y: scroll;
`;

const ShowDate = styled.div`
  margin-top: calc(4px + 5.56%);
  font-size: 12px;
  color: var(--dark-gray);
`;

const NicknameLine = styled.div`
  margin-top: 3px;
  font-size: 18px;
`;

const Bold = styled.span`
  font-weight: 600;
`;

const GreenLeft = styled.div`
  margin-top: 14px;
  font-size: 28px;
  margin-bottom: 14px;
`;

const SummaryText = styled.div`
  margin-top: 14px;
  font-size: 14.5px;
  font-weight: 550;
`;

const WeekdayFrame = styled.div`
  position: relative;
  width: 105.56%;
  margin-left: -2.78%;
  height: 84px;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const WeekNameFrame = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-top: 14px;
  margin-bottom: 12px;
`;

const WeekName = styled.div`
  position: relative;
  width: calc(100% / 7);
  text-align: center;
`;

const OneDay = styled.div`
  position: relative;
  width: 14.2%;
  height: 90%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const DayNumberFrame = styled.div`
  position: relative;
  width: 100%;
  text-align: center;
  font-size: 13.5px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const DayNumber = styled.div`
  width: 100%;
  position: absolute;
  z-index: 2;
`;

const DayNumberCircle = styled.div`
  position: absolute;
  margin-top: 1px;
  width: 32px;
  height: 32px;
  background-color: var(--gray);
  border-radius: 50px;
  z-index: 1;
`;

const DayProgress = styled.div<{ count: string }>`
  width: 8px;
  height: 8px;
  border-radius: 2px;
  margin-top: 4px;
  background-color: ${(props) => props.count};
`;

const ButtonsFrame = styled.div`
  position: relative;
  width: 100%;
  margin-top: 48px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`;
