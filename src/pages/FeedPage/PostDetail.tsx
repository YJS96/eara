// import React from 'react'
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import HeadBar from "../../components/HeadBar/HeadBar";
import MainFrame from "../../components/MainFrame/MainFrame";
import NavBar from "../../components/NavBar/NavBar";
import { ReactComponent as PointCircle } from "../../assets/icons/point-circle.svg"
import { ReactComponent as GruCircle } from "../../assets/icons/gru-circle.svg"
// import { ReactComponent as LeafEmpty } from "../../assets/icons/leaf-empty.svg"
// import { ReactComponent as LeafFill } from "../../assets/icons/leaf-fill.svg"
import { ReactComponent as BallMenu } from "../../assets/icons/ball-menu-icon.svg"
import OptionModal from "../../components/Modal/OptionModal";
import axiosInstance from "../../api/axiosInstance";
import actData from "../../common/act.json";
import rewardData from "../../common/reward.json"

interface Post {
  reportId?: number;
  writerId?: number;
  act?: string;
  actDetail?: string;
  company?: string;
  createdAt?: string;
  image?: string;
  isMine?: boolean;
}

interface Reward {
  cpoint: number;
  groo: number;
}

const addComma = (groo: number) => {
  return groo.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
}

export default function PostDetail() {
  const navigate = useNavigate();
  const axios = axiosInstance();

  const { id } = useParams<{ id: string }>();
  // const [isLiked, setIsLiked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [post, setPost] = useState<Post>({});
  const [writerProfile, setWriterProfile] = useState("");
  const [writerNickname, setWriterNickname] = useState("");
  const [reward, setReward] = useState<Reward>({ cpoint: 0, groo: 0 });

  useEffect(() => {
    getPost();
  }, [id]);

  useEffect(() => {
    if (post.writerId) {
      getUsersInfo();
    }
  }, [post])

  const getPost = async () => {
    try {
      const response = await axios.get(`/proof/${id}`);
      const data = response.data;

      const date = new Date(data.created_at);
      const formattedDate = new Intl.DateTimeFormat("ko-KR", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);

      const act = actData.find(item => item.englishName === data.activity_type);
      const actName = act ? act.name : '';

      let companyName = "";
      if(data.c_company_id !== null) {
        const company = act?.companies.find(c => c.id === data.c_company_id);
        companyName = company ? company.name : '';
      }

      const rwd = rewardData.find(item => item.type === data.activity_type);
      if(rwd) {
        setReward({
          cpoint: data.c_company_id ? rwd.ntzPoint : 0,
          groo: rwd.groo
        });
      }

      setPost({
        reportId: data.proof_id,
        writerId: data.member_id,
        act: actName,
        actDetail: data.content,
        company: companyName,
        createdAt: formattedDate,
        image: data.picture[0].url,
        isMine: data.is_mine
      });

    } catch (error) {
      console.log(error);
    }
  }

  const getUsersInfo = async () => {
    try {
      const response = await axios.get(`/member?memberId=${post.writerId}`);
      const memberData = response.data.member_list;

      setWriterProfile(memberData[0].profile_image_url);
      setWriterNickname(memberData[0].nickname);
    } catch (error) {
      console.log(error);
    }
  }

  const deletePost = async () => {
    try {
      await axios.delete(`/proof/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  // const toggleLeaf = () => {
  //   setIsLiked(!isLiked);
  // }

  const goToProfile = (userId: number) => {
    if (userId === undefined) return;
    
    if(post.isMine) {
      navigate(`/mypage`);
    } else {
      navigate(`/profile/${userId}`);
    }
  }

  const showModal = (e : any) => {
    e.stopPropagation();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleDelete = () => {
    deletePost();
    setModalOpen(false);
    navigate(-1);
  }

  return (
    <>
      <HeadBar pagename="활동 인증" bgcolor="white" backbutton="yes" center={true} />
      <MainFrame headbar="yes" navbar="yes" bgcolor="white" marginsize="small">
        <PostFrame>
          <WriterContainer onClick={() => post.writerId && goToProfile(post.writerId)}>
            <ProfileImg src={writerProfile} />
            <TextBox>
              <Bold>{writerNickname}</Bold>
              <SubText>{post.createdAt}</SubText>
            </TextBox>
            {post.isMine && 
              <BallMenu onClick={showModal} />
            }
          </WriterContainer>
          <ActImg src={post.image} />
          {/* <ReactionContainer>
            {isLiked ? <LeafFill onClick={toggleLeaf} /> : <LeafEmpty onClick={toggleLeaf} />}
            <ReactionText><Bold>{post.likedUser}</Bold>님 외 {post.liked}명이 좋아해요</ReactionText>
          </ReactionContainer> */}
        </PostFrame>
        <RewardContainer>
          {(reward.cpoint !== 0) && 
            <>
              <PointCircle />
              <RewardText>{addComma(reward.cpoint)} 포인트 적립</RewardText>
            </>
          }
          <GruCircle />
          <RewardText>{addComma(reward.groo)} 그루 갚음</RewardText>
        </RewardContainer>
        <MiddleMargin/>
        <ActContainer>
          <ActText>활동</ActText>
          <ActText>{post.act}</ActText>
        </ActContainer>
        {post.company &&
          <ActContainer>
            <ActText>기업</ActText>
            <ActText>{post.company}</ActText>
          </ActContainer>}
        {post.actDetail &&
          <ActContainer>
            <ActText>내용</ActText>
            <ActText>{post.actDetail}</ActText>
          </ActContainer>}
      </MainFrame>
      <OptionModal title="게시물 삭제" content="정말로 인증 내역을 삭제하시겠습니까?" btnText="삭제" isOpen={modalOpen} closeModal={closeModal} onConfirm={handleDelete}/>
      <NavBar />
    </>
  )
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

const Bold = styled.span`
  font-weight: 600;
`;

const SubText = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: var(--dark-gray);
`;

const ActImg = styled.img`
  width: 100vw;
  max-width: calc(100% + 2 * 5.56%);
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;

// const ReactionContainer = styled.div`
//   margin-top: 8px;
//   display: flex;
//   align-items: center;
// `;

// const ReactionText = styled.div`
//   margin-left: 4px;
//   font-size: 12px;
// `;

const RewardContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 14px;
`;

const RewardText = styled.div`
  margin-left: 8px;
  margin-right: 3%;
  font-size: 14px;
  color: var(--dark-gray);
`;

const MiddleMargin = styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  height: 8px;
  background-color: var(--background);
`;

const ActContainer = styled.div`
  display: flex;
  margin-top: 14px;
`;

const ActText = styled.div`
  font-size: 16px;
  word-wrap: break-word;
  &:not(:last-child) {
    color: var(--dark-gray);
    margin-right: 16px;
  }
`;
