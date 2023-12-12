// import React from 'react'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import styled from "styled-components";
import NavBar from "../../components/NavBar/NavBar";
import MainFrame from "../../components/MainFrame/MainFrame";
import SearchBar from "../../components/SearchBar/SearchBar";
import { ReactComponent as PointCircle } from "../../assets/icons/point-circle.svg";
import { ReactComponent as GruCircle } from "../../assets/icons/gru-circle.svg";
// import { ReactComponent as LeafEmpty } from "../../assets/icons/leaf-empty.svg";
// import { ReactComponent as LeafFill } from "../../assets/icons/leaf-fill.svg";
import useInfScroll from "../../hooks/useInfScroll";
import axiosInstance from "../../api/axiosInstance";
import rewardData from "../../common/reward.json"

interface Post {
  proof_id: number;
  member_id: number;
  content: string;
  c_company_id: number | null;
  created_at: string;
  picture: { name: string, url: string }[];
  writerProfileImg?: string;
  writerNickname?: string;
  activity_type?: string | number;
  activity?: string;
  cpoint: number;
  groo: number;
}

interface UserInfo {
  member_id: number;
  profile_image_url: string;
  nickname: string;
}

const addComma = (groo: number) => {
  return groo.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
}

export default function FeedPage() {
  const navigate = useNavigate();
  const axios = axiosInstance();

  // const [isLiked, setIsLiked] = useState(false);
  const [searchUserId, setSearchUserId] = useState<number|null>(null);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [curPosts, setCurPosts] = useState(0);
  const [morePosts, setMorePosts] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

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

  useEffect(() => {
    getPosts();
  }, []);
  
  useEffect(() => {
    if (searchUserId) {
      navigate(`/profile/${searchUserId}`)
      // setSearchUserId(null);
    }
  }, [searchUserId]);

  const goToProfile = (e: any, userId: number) => {
    e.stopPropagation()
    navigate(`/profile/${userId}`)
  }

  const goToDetail = (postId: number) => {
    navigate(`/post/${postId}`)
  }

  // const toggleLeaf = () => {
  //   setIsLiked(!isLiked);
  // };

  const { ref: feedInfScrollRef } = useInfScroll({
    getMore: () => {
      getPosts();
    },
    hasMore: morePosts,
  })

  const getMemberInfo = async (members: number[]) => {
    try {
      const response = await axios.get(`/member?memberId=${members.join('&memberId=')}`);
      return response.data.member_list;
    } catch (error) {
      console.error('멤버 정보 가져오기 실패:', error);
      return [];
    }
  };

  const getPosts = async () => {
    if (isLoadingPosts) return;
    setIsLoadingPosts(true);

    try {
      const nowPosts = curPosts;
      const response = await axios.get(`/proof/feed?page=${nowPosts}&size=12`);
      const data = response.data;
      // console.log(data);

      if(response.status !== 204) {
        const memberIdsObj = data.proof.reduce((acc: { [key: number]: boolean }, post: Post) => {
          acc[post.member_id] = true;
          return acc;
        }, {});

        const memberIds = Object.keys(memberIdsObj).map(id => parseInt(id));
        const membersInfo = await getMemberInfo(memberIds);

        const updatedPosts = data.proof.map((post: Post) => {
          const memberInfo = membersInfo.find((member: UserInfo) => member.member_id === post.member_id);
          
          const rwd = rewardData.find(item => item.type === post.activity_type);
          const activity = rwd ? rwd.typeInKorean : "";
          const cpoint = (rwd && post.c_company_id) ? rwd.ntzPoint : 0;
          const groo = rwd ? rwd.groo : 0;

          return {
            ...post,
            writerProfileImg: memberInfo.profile_image_url,
            writerNickname: memberInfo.nickname,
            activity,
            cpoint,
            groo,
          };
        });
        
        setPosts((prevPosts) => [...prevPosts, ...updatedPosts]);
        setCurPosts(nowPosts+1);
      } else {
        setMorePosts(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  return (
    <>
      <SearchBar setUserId={setSearchUserId} type=""/>
      <MainFrame headbar="yes" navbar="yes" bgcolor="white" marginsize="small">
        <Margin />
        {posts.map((post, index) => (
          <PostFrame key={index} onClick={() => goToDetail(post.proof_id)}>
            <WriterContainer>
              <ProfileImg
                src={post.writerProfileImg}
                onClick={(event) => goToProfile(event, post.member_id)}
              />
              <TextBox>
                <Bold onClick={(event) => goToProfile(event, post.member_id)}>{post.writerNickname}</Bold>
                님이&nbsp;
                <Bold>{post.activity}</Bold>에 참여했어요!
                <RewardContainer>
                {(post.cpoint !== 0) && 
                    <>
                      <PointCircle />
                      <RewardText>{addComma(post.cpoint)} 포인트 적립</RewardText>
                    </>
                  }
                  <GruCircle />
                  <RewardText>{addComma(post.groo)} 그루 갚음</RewardText>
                  <RewardText style={{ marginLeft: 0 }}> |&nbsp;&nbsp;{formatDate(post.created_at)} </RewardText>
                </RewardContainer>
              </TextBox>
            </WriterContainer>
            <ContentContainer>
              <ActImg src={post.picture[0].url} />
              {/* <ReactionContainer>
                {isLiked ? (
                  <LeafFill onClick={toggleLeaf} />
                ) : (
                  <LeafEmpty onClick={toggleLeaf} />
                )}
                <ReactionText>
                  <Bold>{post.likedUser}</Bold>님 외 {post.liked}명이 좋아해요
                </ReactionText>
              </ReactionContainer> */}
            </ContentContainer>
            <div ref={feedInfScrollRef} />
          </PostFrame>
        ))}
      </MainFrame>

      <NavBar />
    </>
  );
}

const Margin = styled.div`
  position: relative;
  height: 8px;
  width: 100%;
`

const PostFrame = styled.div`
  position: relative;
  padding: 16px 0px;
  border-bottom: 0.5px solid var(--gray);
`;

const WriterContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const ProfileImg = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 0.5px solid var(--nav-gray);
  box-sizing: border-box;
`;

const TextBox = styled.div`
  margin-top: 4px;
  margin-left: 4%;
  width: calc(96% - 48px);
  font-size: 14px;
  word-wrap: break-word;
`;

const Bold = styled.span`
  font-weight: 600;
`;

const RewardContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

const RewardText = styled.div`
  margin-left: 4px;
  margin-right: 2.5%;
  font-size: 12px;
  color: var(--dark-gray);
  white-space: nowrap;
`;

const ContentContainer = styled.div`
  margin-left: calc(4% + 50px);
`;

const ActImg = styled.img`
  width: 100%;
`;

// const ReactionContainer = styled.div`
//   margin-top: 4px;
//   display: flex;
//   align-items: center;
// `;

// const ReactionText = styled.div`
//   margin-left: 4px;
//   font-size: 12px;
// `;
