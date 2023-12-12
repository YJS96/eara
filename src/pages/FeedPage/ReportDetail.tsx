// import React from 'react'
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import HeadBar from "../../components/HeadBar/HeadBar";
import MainFrame from "../../components/MainFrame/MainFrame";
import NavBar from "../../components/NavBar/NavBar";
import { ReactComponent as GruCircle } from "../../assets/icons/gru-circle.svg";
import { ReactComponent as DropRight } from "../../assets/icons/drop-right-icon.svg";
import axiosInstance from "../../api/axiosInstance";
import reportData from "../../common/report.json";

interface Report {
  reportId?: number;
  writerId?: number;
  targetId?: number;
  actDetail?: string;
  actType?: string;
  createdAt?: string;
  images?: string[];
}

export default function ReportDetail() {
  const axios = axiosInstance();

  const { id } = useParams<{ id: string }>();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const [report, setReport] = useState<Report>({ images: [] });
  const [writerProfile, setWriterProfile] = useState("");
  const [writerNickname, setWriterNickname] = useState("");
  const [targetNickname, setTargetNickname] = useState("");
  const [actContent, setActContent] = useState("");
  const [fine, setFine] = useState(0);

  useEffect(() => {
    getReport();
  }, [id]);

  useEffect(() => {
    if (report.writerId && report.targetId) {
      getUsersInfo();
    }
  }, [report])

  const getReport = async () => {
    try {
      const response = await axios.get(`/accusation/${id}`);
      const data = response.data;

      const date = new Date(data.created_at);
      const formattedDate = new Intl.DateTimeFormat("ko-KR", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);

      let coverImg = "";
      const actData = reportData.find(item => item.type === data.activity_type);
      if (actData) {
        setActContent(actData.content);
        setFine(actData.fine);
        coverImg = actData.imgUrl;
      }

      const reportImages = data.image_list.imageURL_1 ? [data.image_list.imageURL_1] : [];
      const images = coverImg ? [coverImg, ...reportImages] : reportImages;

      setReport({
        reportId: data.accusation_id,
        writerId: data.witness_id,
        targetId: data.member_id,
        actType: data.activity_type,
        actDetail: data.activity_detail,
        createdAt: formattedDate,
        images: images
      });

    } catch (error) {
      console.log(error);
    }
  }

  const getUsersInfo = async () => {
    try {
      const response = await axios.get(`/member?memberId=${report.writerId}&memberId=${report.targetId}`);
      const memberData = response.data.member_list;

      setWriterProfile(memberData[0].profile_image_url);
      setWriterNickname(memberData[0].nickname);
      setTargetNickname(memberData[1].nickname);
    } catch (error) {
      console.log(error);
    }
  }

  const handleImageChange = (e: any) => {
    if (!report.images) {
      return;
    }

    const containerWidth = e.currentTarget.offsetWidth;
    const clickX = e.clientX - e.currentTarget.getBoundingClientRect().left;

    if (clickX < containerWidth / 2 && currentImgIndex > 0) {
      setCurrentImgIndex(prevIndex => {
        return prevIndex - 1;
      });
    } else if (clickX >= containerWidth / 2 && currentImgIndex < report.images.length - 1) {
      setCurrentImgIndex(prevIndex => {
        return prevIndex + 1;
      });
    }
  };

  const handleImageChangeByDot = (index: number) => {
    setCurrentImgIndex(index);
  };

  return (
    <>
      <HeadBar
        pagename="경고장"
        bgcolor="white"
        backbutton="yes"
        center={true}
      />
      <MainFrame headbar="yes" navbar="yes" bgcolor="white" marginsize="small">
        <PostFrame>
          <WriterContainer>
            <ProfileImg src={writerProfile} />
            <TextBox>
              <MainText>
                <Bold>{writerNickname}</Bold>
                <DropRight style={{ margin: "0 8px" }} />
                <Bold>{targetNickname}</Bold>
              </MainText>
              <SubText>{report.createdAt}</SubText>
            </TextBox>
          </WriterContainer>
          <SlideContainer onClick={handleImageChange}>
            <Slides currentImgIndex={currentImgIndex}>
              {report.images && report.images.map((img, index) => (
                <img src={img} key={index} style={{ width: '100%', flexShrink: 0 }} />
              ))}
            </Slides>
          </SlideContainer>
          <Dots>
            {report.images && report.images.map((_, index) => (
              <Dot key={index} active={index === currentImgIndex} onClick={() => handleImageChangeByDot(index)} />
            ))}
          </Dots>
          <ReactionContainer>
            <BigGruCircle />
            <ReactionText>
              <Bold>벌금 {fine}그루</Bold>
            </ReactionText>
          </ReactionContainer>
          <ActText>
            <Bold>{writerNickname}</Bold>님이 {targetNickname}님의{" "}
            {report.actType === "OTHER" ? (
              <span>
                환경 오염({report.actDetail}) 현장을 목격했습니다. <br />
              </span>
            ) : (
              <span>
                {actContent} 현장을 목격했습니다. <br />
              </span>
            )}
          </ActText>
        </PostFrame>
      </MainFrame>
      <NavBar />
    </>
  );
}

const PostFrame = styled.div`
  position: relative;
  padding: 12px 0px;
`;

const WriterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const ProfileImg = styled.img`
  width: 50px;
  height: 50px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  border: 0.5px solid var(--nav-gray);
  box-sizing: border-box;
`;

const TextBox = styled.div`
  margin-left: 4%;
  width: 100%;
  font-size: 14px;
  word-wrap: break-word;
`;

const MainText = styled.div`
  display: flex;
  align-items: center;
`;

const Bold = styled.span`
  font-weight: 600;
`;

const SubText = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: var(--dark-gray);
`;

const SlideContainer = styled.div`
  overflow: hidden;
  width: 100vw;
  max-width: calc(100% + 2 * 5.56%);
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: -16px;
`;

const Slides = styled.div<{ currentImgIndex: number }>`
  display: flex;
  transition: all 0.3s ease; 
  transform: translateX(-${props => props.currentImgIndex * 100}%);
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  z-index: 1;
  position: relative;
  bottom: 16px;
  cursor: pointer;
`;

const Dot = styled.div<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: 0 4px;
  background-color: ${(props) => (props.active ? "var(--gray)" : "var(--nav-gray)")};
`;

const ReactionContainer = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
`;

const BigGruCircle = styled(GruCircle)`
  width: 16px;
  height: 16px;
  margin: 4px 4px 4px 0;
`;

const ReactionText = styled.div`
  margin-left: 4px;
  font-size: 14px;
`;

const ActText = styled.div`
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
`;