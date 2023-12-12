import { ChangeEvent, useState } from "react";
import HeadBar from "../../components/HeadBar/HeadBar";
import MainFrame from "../../components/MainFrame/MainFrame";
import styled from "styled-components";
import { ShortButton, LongButton } from "../../style";
// import { ReactComponent as Dropdown } from "../../assets/icons/dropdown.svg";
// import areasList from "../../common/seoul-area.json";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Edit } from "../../assets/icons/edit-icon.svg";
// import initFcm from "../../util/fcm.ts";
import toast, { Toaster } from "react-hot-toast";

interface GenderButtonProps {
  isSelected: boolean;
}

// interface DropdownProps {
//   isOpen: boolean;
// }

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

export default function SignupPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>("male");
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  // const [selectedArea, setSelectedArea] = useState<number>(0);
  const [nickname, setNickname] = useState<string>("");
  const [isNicknameChecked, setIsNicknameChecked] = useState<boolean>(false);
  // const [userInfo, setUserInfo] = useState<UserInfoProps | null>(null);
  // const [groo, setGroo] = useState(0);
  const [getNoti, setGetNoti] = useState(false);

  const navigate = useNavigate();
  const groo = JSON.parse(localStorage.getItem("testGroo") || "0");

  // const onToggle = () => setIsOpen(!isOpen);
  const userInfo: UserInfoProps = {
    member_id: 1,
    nickname: "환경구해",
    groo: 60000,
    bill: 3200,
    bill_count: 4,
    profile_image_url:
      "https://github.com/YJS96/eara_test_repo/blob/main/public/images/logo-nobackground.png?raw=true",
    is_test_done: true,
    repay_groo: 400,
  };
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);
    }
  };

  const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
    if (event.target.value) {
      setIsNicknameChecked(false);
    }
  };

  // const onOptionClicked = (index: number) => () => {
  //   setSelectedArea(index);
  //   setIsOpen(false);
  // };

  const handleGenderSelection = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleCheckNickname = async () => {
    setIsNicknameChecked(true);
    toast.success("사용 가능한 닉네임입니다");
    localStorage.setItem("newNickname", nickname);
  };

  // const getUserInfo = async () => {
  //   try {
  //     const response = await axios.get(`/member/detail`);
  //     const data = await response.data;
  //     if (data.member_id && data.is_test_done) {
  //       window.alert("이미 어라 회원입니다.");
  //       navigate("/");
  //     } else {
  //       const initGroo = JSON.parse(localStorage.getItem("testGroo") || "0");
  //       if (initGroo) {
  //         setGroo(initGroo);
  //         // localStorage.removeItem("testGroo");
  //       } else {
  //         window.alert("테스트를 먼저 진행해주세요");
  //         navigate("/welcome");
  //       }
  //     }
  //     setUserInfo(data);
  //     setNickname(data.nickname);
  //     setFirstNickname(data.nickname);
  //     // console.log(firstNickname)
  //     // console.log(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const signupClicked = async () => {
    window.alert("가입되었습니다");
    navigate("/main");
  };

  // useEffect(() => {
  //   getUserInfo();
  // }, []);

  const handleNoti = () => {
    if (!getNoti) {
      // initFcm();
      toast.success("알림 수신에 동의하셨습니다");
      setGetNoti(true);
    }
  };

  return (
    <>
      <HeadBar pagename="회원 정보 입력" bgcolor="white" backbutton="no" />
      <MainFrame headbar="yes" navbar="no" bgcolor="white" marginsize="large">
        <Toaster
          containerStyle={{
            position: "fixed",
            zIndex: "999",
            top: "calc(env(safe-area-inset-top) * 2 + 20px)",
          }}
        />
        <ProfileNickname>
          <ProfileFrame>
            <ProfileEditIcon htmlFor="file">
              <ProfileEdit />
            </ProfileEditIcon>
            <ProfileInput
              type="file"
              id="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <InputLabel htmlFor="file"></InputLabel>
            {selectedImage ? (
              <ProfileImage src={selectedImage} />
            ) : (
              // <NoProfile src="../src/assets/icons/upload-image-icon.png" />
              <ProfileImage src={userInfo?.profile_image_url} />
            )}
          </ProfileFrame>
          <NicknameFrame>
            <InfoName>닉네임</InfoName>
            <NicknameCheck>
              <NicknameInput
                type="text"
                maxLength={8}
                value={nickname}
                onChange={handleNicknameChange}
                placeholder={userInfo?.nickname}
              />
              <CheckButton
                onClick={handleCheckNickname}
                isNicknameValid={nickname.length >= 2}
              >
                중복확인
              </CheckButton>
            </NicknameCheck>
          </NicknameFrame>
        </ProfileNickname>

        <InfoName>성별</InfoName>
        <GenderButtonFrame>
          <GenderButton
            onClick={() => handleGenderSelection("male")}
            isSelected={selectedGender === "male"}
          >
            남자
          </GenderButton>
          <GenderButton
            onClick={() => handleGenderSelection("female")}
            isSelected={selectedGender === "female"}
          >
            여자
          </GenderButton>
        </GenderButtonFrame>

        {/* <InfoName>활동 지역</InfoName>
        <PlaceFrame>
          <BigGray>서울시</BigGray>
          <DropdownFrame>
            <AreaName onClick={onToggle}>{areasList[selectedArea]}</AreaName>
            <PointDown isOpen={isOpen} onClick={onToggle} />
            <DropdownAreas isOpen={isOpen}>
              {isOpen &&
                areasList.map((area, index) => (
                  <OneArea
                    onClick={onOptionClicked(index)}
                    style={{
                      color:
                        index === selectedArea
                          ? "var(--black)"
                          : "var(--nav-gray)",
                    }}
                  >
                    {area}
                  </OneArea>
                ))}
            </DropdownAreas>
          </DropdownFrame>
        </PlaceFrame> */}
        <InfoName>알림</InfoName>
        <NotiAllow>
          <div>어라가 소식을 보내드려요</div>
          <NotiAllowButton onClick={handleNoti} getNoti={getNoti}>
            받기
          </NotiAllowButton>
        </NotiAllow>
        <InfoName>시작 빚</InfoName>
        <InitialGroo>{groo},000그루</InitialGroo>
        <SignupFrame>
          <SignupButton disabled={!isNicknameChecked} onClick={signupClicked}>
            가입하기
          </SignupButton>
          <Terms>
            회원가입 시 어라의 개인정보 처리방침 및 이용약관에
            <br />
            동의하는 것으로 간주합니다
          </Terms>
        </SignupFrame>
      </MainFrame>
    </>
  );
}

const ProfileNickname = styled.div`
  position: relative;
  width: 100%;
  margin-top: 20px;
  display: flex;
  height: 84px;
  align-items: center;
  margin-bottom: 26px;
  font-weight: 400;
`;

const ProfileFrame = styled.div`
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 100px;
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.06);
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileEditIcon = styled.label`
  position: absolute;
  z-index: 4;
  right: 0;
  bottom: 0;
  width: 20px;
  height: 20px;
  background-color: var(--white);
  border: 1px solid var(--gray);
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileEdit = styled(Edit)`
  width: 88%;
  height: 88%;
  path {
    fill: var(--dark-gray);
  }
`;

const ProfileInput = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
  z-index: 2;
`;

const InputLabel = styled.label`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
  overflow: hidden;
  z-index: 3;
`;

const ProfileImage = styled.img`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 100px;
  object-fit: cover;
  /* border: 1px solid var(--nav-gray); */
`;

// const NoProfile = styled.img`
//   position: absolute;
//   margin-left: 3px;
//   width: 40%;
//   height: 40%;
//   z-index: 1;
// `;

const NicknameFrame = styled.div`
  position: relative;
  height: 100%;
  margin-left: 20px;
  width: calc(100% - 88px);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InfoName = styled.div`
  position: relative;
  width: 100%;
  font-size: 13px;
  color: var(--dark-gray);
`;

const NicknameCheck = styled.div`
  position: relative;
  height: 24px;
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const NicknameInput = styled.input`
  position: relative;
  width: calc(100% - 68px);
  height: 100%;
  border: none;
  background-color: var(--white);
  border-bottom: 1.5px solid var(--nav-gray);
  font-size: 17px;
  font-weight: 400;
  border-radius: 0px !important;
  padding-left: 0px;
  &:focus {
    border-bottom: 1.5px solid var(--primary);
    outline: none;
  }
  &:active {
    border-color: var(--primary);
  }
  &::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::placeholder {
    color: var(--nav-gray);
  }
`;

const CheckButton = styled.div<{ isNicknameValid: boolean }>`
  margin-bottom: 4px;
  color: var(--dark-gray);
  color: ${({ isNicknameValid }) =>
    isNicknameValid ? "var(--primary)" : "var(--dark-gray)"};
  transition: color 0.3s ease-in-out;
  font-size: 14.5px;
  font-weight: 500;
  white-space: nowrap;
`;

const GenderButtonFrame = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  margin-bottom: 40px;
`;

const GenderButton = styled(ShortButton)<GenderButtonProps>`
  border: ${(props) =>
    props.isSelected ? "1px solid transparent" : "1px solid var(--nav-gray)"};
  color: ${(props) => (props.isSelected ? "var(--white)" : "var(--nav-gray)")};
  background-color: ${(props) =>
    props.isSelected ? "var(--primary)" : "var(--white)"};
  height: 34px;
`;

// const PlaceFrame = styled.div`
//   position: relative;
//   width: 100%;
//   margin-bottom: 40px;
//   margin-top: 8px;
//   display: flex;
//   justify-content: space-between;
// `;

// const DropdownFrame = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   width: 50%;
// `;

// const AreaName = styled.div`
//   width: 68px;
//   height: 100%;
//   display: flex;
//   /* border: 1px black solid; */
// `;

// const DropdownAreas = styled.div<DropdownProps>`
//   position: absolute;
//   margin-left: -8px;
//   height: ${({ isOpen }) => (isOpen ? "120px" : "0px")};
//   transition: height 0.25s ease;
//   width: 98px;
//   margin-top: 24px;
//   /* border: 1px var(--nav-gray) solid; */
//   border-radius: 0px 0px 10px 10px;
//   box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.08);
//   overflow-y: scroll;
//   overflow-x: hidden;
// `;

// const OneArea = styled.div`
//   position: relative;
//   width: 100%;
//   height: 34px;
//   border-bottom: 1px solid var(--gray);
//   color: var(--nav-gray);
//   display: flex;
//   align-items: center;
//   padding-left: 8px;
//   font-size: 15px;
// `;

// const PointDown = styled(Dropdown)<DropdownProps>`
//   /* transform: rotate( 90deg); */
//   transform: ${({ isOpen }) => (isOpen ? "rotate(270deg)" : "rotate(90deg)")};
//   transition: transform 0.25s ease;
//   width: 20px;
//   height: 20px;
// `;

const BigGray = styled.div`
  font-size: 18px;
  color: var(--nav-gray);
`;

const InitialGroo = styled(BigGray)`
  margin-top: 8px;
  margin-bottom: 40px;
`;

const NotiAllow = styled(InitialGroo)`
  width: 100%;
  /* border: 1px solid black; */
  display: flex;
  justify-content: space-between;
`;

const NotiAllowButton = styled.div<{ getNoti: boolean }>`
  color: ${({ getNoti }) => (getNoti ? "var(--nav-gray)" : "var(--black)")};
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-top: 1px;
  margin-right: 2px;
`;

const SignupFrame = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 144px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SignupButton = styled(LongButton)<{ disabled: boolean }>`
  width: calc(86.67%);
  margin-bottom: 28px;
  background-color: ${({ disabled }) =>
    disabled ? "var(--nav-gray)" : "var(--primary)"};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
`;

const Terms = styled(InfoName)`
  width: 100%;
  font-size: 11.5px;
  text-align: center;
  margin-top: 0px;
  font-weight: 300;
`;
