// import React from "react";
import { useState, useEffect } from "react";
import HeadBar from "../../components/HeadBar/HeadBar";
import MainFrame from "../../components/MainFrame/MainFrame";
import NavBar from "../../components/NavBar/NavBar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../style/MonthCalendar.css";
import styled from "styled-components";
import moment from "moment";
// import axiosInstance from "../../api/axiosInstance";

interface GrooSavingProps {
  date: string;
  proof_sum: number;
  proof_count: number;
  accusation_sum: number;
  accusation_count: number;
}

interface MonthCalendarProps {
  proof_sum: number;
  proof_count: number;
  accusation_sum: number;
  accusation_count: number;
  groo_saving_list: GrooSavingProps[];
}

const date = new Date();
const date2 = moment(date).format("DD");

export default function CalendarPage() {
  const [value, onChange] = useState<any>(new Date());
  const monthOfActiveDate = moment(value).format("YYYY-MM");
  const [activeMonth, setActiveMonth] = useState(monthOfActiveDate);
  // const [monthGroo, setMonthGroo] = useState<MonthCalendarProps | null>(null);

  const monthGroo: MonthCalendarProps = {
    proof_sum: 2400,
    proof_count: 10,
    accusation_sum: 240,
    accusation_count: 2,
    groo_saving_list: [
      {
        date: `2023-${moment(monthOfActiveDate).format("MM")}-01`,
        proof_sum: 120,
        proof_count: 1,
        accusation_sum: 0,
        accusation_count: 0,
      },
      {
        date: `2023-${moment(monthOfActiveDate).format("MM")}-03`,
        proof_sum: 180,
        proof_count: 1,
        accusation_sum: 60,
        accusation_count: 1,
      },
      {
        date: `2023-${moment(monthOfActiveDate).format("MM")}-05`,
        proof_sum: 0,
        proof_count: 0,
        accusation_sum: 120,
        accusation_count: 3,
      },
      {
        date: `2023-${moment(monthOfActiveDate).format("MM")}-07`,
        proof_sum: 240,
        proof_count: 2,
        accusation_sum: 0,
        accusation_count: 0,
      },
      {
        date: `2023-${moment(monthOfActiveDate).format("MM")}-08`,
        proof_sum: 110,
        proof_count: 1,
        accusation_sum: 0,
        accusation_count: 0,
      },
      {
        date: `2023-${moment(monthOfActiveDate).format("MM")}-10`,
        proof_sum: 210,
        proof_count: 2,
        accusation_sum: 180,
        accusation_count: 1,
      },
      {
        date: `2023-${moment(monthOfActiveDate).format("MM")}-12`,
        proof_sum: 100,
        proof_count: 1,
        accusation_sum: 0,
        accusation_count: 0,
      },
      {
        date: `2023-${moment(monthOfActiveDate).format("MM")}-13`,
        proof_sum: 130,
        proof_count: 1,
        accusation_sum: 0,
        accusation_count: 0,
      },
      {
        date: `2023-${moment(monthOfActiveDate).format("MM")}-15`,
        proof_sum: 1100,
        proof_count: 5,
        accusation_sum: 240,
        accusation_count: 3,
      },
      {
        date: `2023-${moment(monthOfActiveDate).format("MM")}-16`,
        proof_sum: 130,
        proof_count: 1,
        accusation_sum: 0,
        accusation_count: 0,
      },
      {
        date: `2023-${moment(monthOfActiveDate).format("MM")}-17`,
        proof_sum: 130,
        proof_count: 1,
        accusation_sum: 80,
        accusation_count: 1,
      },
      {
        date: `2023-${moment(monthOfActiveDate).format("MM")}-20`,
        proof_sum: 170,
        proof_count: 2,
        accusation_sum: 0,
        accusation_count: 0,
      },
      {
        date: `2023-${moment(monthOfActiveDate).format("MM")}-21`,
        proof_sum: 2420,
        proof_count: 3,
        accusation_sum: 0,
        accusation_count: 0,
      },
      {
        date: `2023-${moment(monthOfActiveDate).format("MM")}-22`,
        proof_sum: 0,
        proof_count: 0,
        accusation_sum: 1240,
        accusation_count: 6,
      },
      {
        date: `2023-${moment(monthOfActiveDate).format("MM")}-24`,
        proof_sum: 680,
        proof_count: 4,
        accusation_sum: 120,
        accusation_count: 1,
      },
      {
        date: `2023-${moment(monthOfActiveDate).format("MM")}-26`,
        proof_sum: 300,
        proof_count: 2,
        accusation_sum: 0,
        accusation_count: 0,
      },
      {
        date: `2023-${moment(monthOfActiveDate).format("MM")}-28`,
        proof_sum: 300,
        proof_count: 2,
        accusation_sum: 0,
        accusation_count: 0,
      },
    ],
  };

  const sumProof = monthGroo.groo_saving_list.reduce((sum, item) => {
    const day = new Date(item.date).getDate();
    return day <= Number(date2) ? sum + item.proof_sum : sum;
  }, 0);

  const sumProofCount = monthGroo.groo_saving_list.reduce((sum, item) => {
    const day = new Date(item.date).getDate();
    return day <= Number(date2) ? sum + item.proof_count : sum;
  }, 0);

  const sumAccusation = monthGroo.groo_saving_list.reduce((sum, item) => {
    const day = new Date(item.date).getDate();
    return day <= Number(date2) ? sum + item.accusation_sum : sum;
  }, 0);

  const sumAccusationCount = monthGroo.groo_saving_list.reduce((sum, item) => {
    const day = new Date(item.date).getDate();
    return day <= Number(date2) ? sum + item.accusation_count : sum;
  }, 0);

  // const axios = axiosInstance();

  // const apiYear = activeMonth.slice(0, 4);
  // const apiMonth = Number(activeMonth.slice(5, 7));

  // const getMonthAct = async () => {
  //   try {
  //     const response = await axios.get(
  //       `/groo?year=${apiYear}&month=${apiMonth}`
  //     );
  //     const data = await response.data;
  //     setMonthGroo(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getActiveMonth = (activeStartDate: moment.MomentInput) => {
    const newActiveMonth = moment(activeStartDate).format("YYYY-MM");
    setActiveMonth(newActiveMonth);
  };

  useEffect(() => {
    // getMonthAct();
  }, [activeMonth]);

  const generateComma = (price: number) => {
    return price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <HeadBar pagename="월별 활동 내역" bgcolor="white" backbutton="yes" />
      <MainFrame headbar="yes" navbar="yes" bgcolor="white" marginsize="large">
        <MonthCalendar
          className="MonthCalendar"
          onChange={onChange}
          value={value}
          calendarType="gregory"
          locale="ko-KR"
          minDetail="month"
          showNeighboringMonth={false}
          showNavigation={true}
          onActiveStartDateChange={({ activeStartDate }) =>
            getActiveMonth(activeStartDate)
          }
          // @ts-ignore
          formatDay={(locale, date) =>
            new Date(date).toLocaleDateString("en-us", { day: "2-digit" })
          }
          // @ts-ignore
          tileContent={({ date, view }) => {
            const data = monthGroo?.groo_saving_list.find(
              (x: any) =>
                x.date === moment(date).format("YYYY-MM-DD") &&
                Number(moment(x.date).format("DD")) <= Number(date2)
            );
            if (data) {
              return (
                <GrewFrame>
                  {data.proof_sum != 0 ? (
                    <PlusGrew>
                      +{generateComma(Number(data.proof_sum))}
                    </PlusGrew>
                  ) : null}
                  {data.accusation_sum != 0 ? (
                    <MinusGrew>
                      -{generateComma(Number(data.accusation_sum))}
                    </MinusGrew>
                  ) : null}
                </GrewFrame>
              );
            }
          }}
        />
        <MonthSumText>
          {Number(moment(activeMonth).format("YYYY-MM").slice(5, 7))}월 종합내역
        </MonthSumText>

        {monthGroo?.proof_count === null &&
        monthGroo?.accusation_count === null ? (
          <MonthActText style={{ marginTop: "-8px", fontSize: "15px" }}>
            활동 탭에서 환경활동을 시작해보세요
          </MonthActText>
        ) : (
          <MonthActFrame>
            <MonthActText>전체 활동</MonthActText>
            <ActCountFrame>
              <ActCountText>{sumProofCount}회</ActCountText>
              <ActGrewCount>
                {generateComma(sumProof)}
                그루
              </ActGrewCount>
            </ActCountFrame>
          </MonthActFrame>
        )}

        {monthGroo?.proof_count === null &&
        monthGroo?.accusation_count === null ? (
          <></>
        ) : (
          <MonthActFrame>
            <MonthActText>전체 제보</MonthActText>
            <ActCountFrame>
              <ActCountText>{sumAccusationCount}회</ActCountText>
              <ReportGrewCount>
                -{generateComma(sumAccusation)}
                그루
              </ReportGrewCount>
            </ActCountFrame>
          </MonthActFrame>
        )}
        <Margin />
      </MainFrame>
      <NavBar />
    </>
  );
}

const MonthCalendar = styled(Calendar)``;

const GrewFrame = styled.div`
  position: absolute;
  width: calc(100% / 7);
  margin-top: -40px;
  margin-left: -2.8%;
  display: flex;
  flex-direction: column;
  font-weight: 400;
  justify-content: flex-start;
  align-items: flex-start;
`;

const PlusGrew = styled.div`
  font-size: 12px;
  color: var(--primary);
  position: relative;
  width: 100%;
  text-align: center;
  height: 12px;
  margin-bottom: 5px;
`;

const MinusGrew = styled.div`
  font-size: 12px;
  color: var(--red);
  position: relative;
  width: 100%;
  text-align: center;
  height: 12px;
`;

const MonthSumText = styled.div`
  position: relative;
  margin-top: 36px;
  margin-bottom: 24px;
  font-size: 18px;
  font-weight: 550;
`;

const MonthActFrame = styled.div`
  position: relative;
  width: calc(100% - 4px);
  margin-left: 2px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 400;
  margin-bottom: 24px;
`;

const MonthActText = styled.div``;

const ActCountFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ActCountText = styled.div`
  margin-bottom: 3px;
`;

const ActGrewCount = styled.div`
  color: var(--primary);
  font-size: 12px;
`;

const ReportGrewCount = styled.div`
  color: var(--red);
  font-size: 12px;
`;

const Margin = styled.div`
  width: 100%;
  height: 24px;
`;
