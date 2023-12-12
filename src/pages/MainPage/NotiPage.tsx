import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import moment from "moment";
import NavBar from "../../components/NavBar/NavBar";
import HeadBar from "../../components/HeadBar/HeadBar";
import MainFrame from "../../components/MainFrame/MainFrame";
import styled from "styled-components";
import FollowBtn from "../../components/Buttons/FollowButton";
import axiosInstance from "../../api/axiosInstance";
import reportData from "../../common/report.json";
import { ReactComponent as Notification } from "../../assets/icons/noti-setting.svg";

interface NotiProps {
  senderId: number;
  type: string;
  createdAt: string;
  content: string;
  accusationType: string | null;
}

interface User {
  nickname: string;
  profileImg: string;
  status: string;
}

interface Users{
  [userId: number]: User;
}

const formatDate = (createdAt: string): string => {
  const createdMoment = moment(createdAt);
  const now = moment();
  const diffDays = now.diff(createdMoment, 'days');
  const diffHours = now.diff(createdMoment, 'hours');
  const diffMinutes = now.diff(createdMoment, 'minutes');
  const diffSeconds = now.diff(createdMoment, 'seconds');

  if (diffDays >= 7) {
    return createdMoment.format(createdMoment.year() === now.year() ? 'MM월 DD일' : 'YYYY년 MM월 DD일');
  } else if (diffDays > 0) {
    return `${diffDays}일 전`;
  } else if (diffHours > 0) {
    return `${diffHours}시간 전`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes}분 전`;
  } else if (diffSeconds > 0) {
    return `${diffSeconds}초 전`;
  } else {
    return '방금 전';
  }
};

const findeTemplate = (type: string) => {
  const report = reportData.find(item => item.type === type);
  if (report) {
    return report.imgUrl;
  }
  return reportData[5].imgUrl;
}

export default function NotiPage() {
  const axios = axiosInstance();
  const navigate = useNavigate();
  const today = new Date();
  const startDate = moment(today).subtract(7, 'days').format("YYYY-MM-DD");
  const endDate = moment(today).add(1, 'day').format("YYYY-MM-DD");
  const [notiDatas, setNotiDatas] = useState<NotiProps[]|null>(null);
  const [userDatas, setUserDatas] = useState<Users>({});

  useEffect (() => {
    getNotification()
  }, [])

  const getNotification = async () => {
    try {
      const response = await axios.get(
        `/notification?startDate=${startDate}&endDate=${endDate}`
      );
      const data = response.data.notification_list;
      const updateNotis = data.map((noti: any) => ({
        senderId: noti.sender,
        type: noti.notification_type,
        createdAt: noti.created_at,
        content: noti.content,
        accusationType: noti.accusation_type,
      }));
      setNotiDatas(updateNotis);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (notiDatas) {
      // console.log(notiDatas)
      const uniqueSenderIds = Array.from(
        new Set(notiDatas?.map(noti => noti.senderId))
      );
      uniqueSenderIds?.map((senderId) =>{
        getFriendInfo(senderId);
      })
    }
  }, [notiDatas]);

  const getFriendInfo = async (id: number) => {
    let status = "";
    try {
      const response = await axios.get(`/member/follow?memberId=${id}`);
      status = response.data.follow_status;
    } catch (error) {
      console.log(error);
    }

    let nickname = "";
    let profileImg = "";
    try {
      const response = await axios.get(`/member?memberId=${id}`);
      const data = response.data.member_list[0];
      nickname = data.nickname;
      profileImg = data.profile_image_url;
    } catch (error) {
      console.log(error);
    }
    
    const userInfo = {
      [id]: {
        nickname: nickname,
        profileImg: profileImg,
        status: status,
      }
    };
    setUserDatas((prev) => ({ ...prev, ...userInfo }));
  }

  const updateUserStatus = (userId:number, newStatus:string) => {
    setUserDatas((prevUserDatas) => {
      const updatedUser = {
        ...prevUserDatas[userId],
        status: newStatus,
      };
      return {
        ...prevUserDatas,
        [userId]: updatedUser,
      };
    });
  };

  return (
    <>
      <HeadBar pagename="알림" bgcolor="white" backbutton="yes" />
      <MainFrame headbar="yes" navbar="yes" bgcolor="white" marginsize="medium">
        <MarginFrame />
        {notiDatas ? (
          notiDatas.map((notice, index) => (
            <Container key={index}>
              <LeftContainer>
                <ProfileImg
                  src={userDatas[notice.senderId]?.profileImg}
                  onClick={() => {navigate(`/profile/${notice.senderId}`)}}
                />
                <TextContainer>
                  <NickName>{userDatas[notice.senderId]?.nickname}</NickName>
                  님이 {notice.content}
                  <Time>{formatDate(notice.createdAt)}</Time>
                </TextContainer>
              </LeftContainer>
              {notice.accusationType ? (
                <WitnessImg src={findeTemplate(notice.accusationType)} />
              ) : userDatas[notice.senderId]?.status === "ACCEPT" ? (
                  <FollowBtn
                    status={userDatas[notice.senderId]?.status}
                    setStatus={newStatus => updateUserStatus(notice.senderId, newStatus as string)}
                    target={notice.senderId}
                  />
              ) : (
                ""
              )}
            </Container>
          ))
        ) : (
          <NoNoti>
           <Notification/>
            알림이 없습니다.
          </NoNoti>
        )}
      </MainFrame>
      <NavBar />
    </>
  );
}

const MarginFrame = styled.div`
  margin: 8px;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
`;

const LeftContainer = styled.div`
  flex-shrink: 2;
  width: 100%;
  display: flex;
  align-items: center;
`;

const ProfileImg = styled.img`
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 0.5px solid var(--nav-gray);
  margin-right: 4%;
`;

const WitnessImg = styled.img`
  flex-shrink: 0;
  height: 60px;
`;

const TextContainer = styled.div`
  flex-shrink: 2;
  width: calc(92% - 42px);
  color: var(--black);
  font-size: 13px;
  font-weight: 400;
  word-wrap: break-word;
`;

const NickName = styled.span`
  font-weight: 500;
`;

const Time = styled.span`
  padding-left: 2%;
  color: var(--dark-gray);
`;

const NoNoti = styled.div`
  margin-top: 120px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  color: var(--dark-gray);
`;
