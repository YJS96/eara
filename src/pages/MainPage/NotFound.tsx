import { useState, useEffect } from "react";
import styled from "styled-components";
import MainFrame from "../../components/MainFrame/MainFrame";
import { useLottie } from "lottie-react";
import Judge from "../../assets/lottie/judge.json";
import { useNavigate } from "react-router-dom";
import AnimationModal from "../../components/Modal/AnimationModal";
import axiosInstance from "../../api/axiosInstance";

interface DeveloperProps {
  member_id: number;
  groo: number;
  repay_groo: number;
  profile_image_url: string;
  nickname: string;
}

export default function NotFound() {
  const [modalOpen, setModalOpen] = useState(false);
  const [developers, setDevelopers] = useState<DeveloperProps[]>([]);
  const navigate = useNavigate();

  const axios = axiosInstance();

  const goToMain = () => {
    navigate("/main");
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openModalFunction = () => {
    setModalOpen(true);
  };

  const options = {
    animationData: Judge,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options);

  const getDevelopers = async () => {
    try {
      const response = await axios.get(
        `/member?memberId=1&memberId=2&memberId=3&memberId=4&memberId=5&memberId=8`
      );
      const data = await response.data.member_list;
      // console.log(data)
      setDevelopers(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDevelopers();
  }, []);

  return (
    <>
      <MainFrame headbar="no" navbar="no" bgcolor="white" marginsize="no">
        <JudgeFrame>{View}</JudgeFrame>
        <Text>존재하지 않는 페이지에요</Text>
        <GoMain onClick={goToMain}>메인으로 돌아가기</GoMain>
        <Developers onClick={openModalFunction}>개발자들과 친구하기</Developers>
        <Welcome>놀러와주세요..</Welcome>
        <AnimationModal
          isOpen={modalOpen}
          closeModal={closeModal}
          closeBtn={true}
        >
          <ThreeDevelopersFrame>
            {developers.map((dev) => (
              <DevelopersFrame
                onClick={() => {
                  navigate(`/profile/${dev.member_id}`);
                }}
              >
                <DeveloperProfile>
                  <ProfileImage src={dev.profile_image_url} />
                </DeveloperProfile>
                <DeveloperNickname>{dev?.nickname}</DeveloperNickname>
              </DevelopersFrame>
            ))}
          </ThreeDevelopersFrame>
        </AnimationModal>
      </MainFrame>
    </>
  );
}

const JudgeFrame = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-left: 8%;
  margin-top: 8px;
`;

const Text = styled.div`
  width: 100%;
  text-align: center;
  font-size: 20px;
  margin-bottom: 40px;
`;

const GoMain = styled(Text)`
  font-size: 16px;
`;

const Developers = styled(Text)`
  font-size: 12px;
`;

const Welcome = styled(Text)`
  font-size: 10px;
`;

const ThreeDevelopersFrame = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  font-size: 13px;
`;

const DevelopersFrame = styled.div`
  position: relative;
  width: calc(100% / 3);
  height: 120px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const DeveloperProfile = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  margin-top: 8px;
  border-radius: 100px;
  background-color: var(--white);
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const ProfileImage = styled.img`
  position: relative;
  width: 100%;
`;

const DeveloperNickname = styled.div`
  position: relative;
  width: 100%;
  text-align: center;
  margin-top: 4px;
`;
