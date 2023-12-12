import React from 'react'
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ReactComponent as SearchIcon } from "../../assets/icons/search-icon.svg";
import { ReactComponent as CloseRing } from "../../assets/icons/close_ring.svg";
import axiosInstance from "../../api/axiosInstance";

interface SearchBarProps {
  setUserId: React.Dispatch<React.SetStateAction<number | null>>;
  type: string;
}

interface FriendDataProps {
  id: number;
  profileImg: string;
  nickname: string;
  groo: number;
}

const addComma = (groo: number) => {
  return groo.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
}

export default function SearchBar({ setUserId, type }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [entire, setEntire] = useState<FriendDataProps[]>([]);
  const [results, setReseults] = useState<FriendDataProps[]>([]);
  const [minuspx, setMinuspx] = useState(48);
  const axios = axiosInstance();

  useEffect(() => {
    if (type === "/follow") {
      setMinuspx(68);
    }
    getFriendsList()
  }, []);

  const getFriendsList = async () => {
    try {
      const response = await axios.get(`/member${type}/list`);
      const data = response.data;
      // console.log(data)
      const transUsers = data.member_list.map((member: any) => ({
        id: member.member_id,
        profileImg: member.profile_image_url,
        nickname: member.nickname,
        groo: member.groo - member.repay_groo
      }));
      setEntire(transUsers);
      if (type === "/follow") {
        setReseults(transUsers);        
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleCancel = () => {
    handleBlur();
    setInputValue("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tmpValue = e.target.value.trim();
    setInputValue(tmpValue);
    if (tmpValue) {
      setReseults(
        entire.filter((friend: FriendDataProps) =>
          friend.nickname.includes(tmpValue)
        )
      );
    } else if (type === "/follow") {
      setReseults(entire);
    } else if (results.length) {
      setReseults([]);
    }
  };

  const handleErase = () => {
    setInputValue("");
    if (type === "/follow") {
      setReseults(entire);
    }
  };

  return (
    <>
      <SearchBarFrame type={type}>
        <SearchWindow isFocused={isFocused} px={minuspx}>
          <SearchIcon />
          <SearchInput
            placeholder="검색.."
            onFocus={handleFocus}
            value={inputValue}
            onChange={handleChange}
          />
          {inputValue && <CloseRing onClick={handleErase} />}
        </SearchWindow>
        <CancelButton isFocused={isFocused} onClick={handleCancel}>
          취소
        </CancelButton>
      </SearchBarFrame>
      <SearchResultFrame isFocused={isFocused}>
        {results.map((user) => (
          <UserInfoContainer
            type={type}
            onClick={() => setUserId(user.id)}
          >
            <ProfileImg src={user.profileImg} />
            <TextBox>
              {user.nickname}
              <SubText>{addComma(user.groo)}그루</SubText>
            </TextBox>
          </UserInfoContainer>
        ))}
        <BottomBox>
          {results.length ? "마지막 검색 결과입니다." : "검색 결과가 없습니다."}
        </BottomBox>
      </SearchResultFrame>
    </>
  );
}

const SearchBarFrame = styled.div<{ type: string }>`
  position: absolute;
  z-index: 1;
  padding: ${(props) => (props.type === "" ? "0 20px" : "0")};
  left: 0;
  right: 0;
  height: 56px;
  border-bottom: 0.5px solid var(--gray);
  display: flex;
  align-items: center;
  margin-top: env(safe-area-inset-top);
  background-color: var(--white);
`;

const SearchWindow = styled.div<{ isFocused: boolean, px: number }>`
  /* margin: 0px 20px; */
  padding: 0px 6px;
  width: ${(props) => (props.isFocused ? `calc(100% - ${props?.px}px)` : "100%")};
  transition: width 0.3s ease-in-out;
  height: 36px;
  border-radius: 6px;
  background-color: var(--gray);
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  margin-left: 8px;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 15px;
`;

const CancelButton = styled.div<{ isFocused: Boolean }>`
  position: absolute;
  white-space: nowrap;
  font-size: 15px;
  right: -24px;
  right: ${(props) => (props.isFocused ? "18px" : "-24px")};
  opacity: ${(props) => (props.isFocused ? "1" : "0")};
  visibility: ${(props) => (props.isFocused ? "visible" : "hidden")};
  transition:
    opacity 0.3s ease-in-out,
    visibility 0.3s ease-in-out,
    right 0.3s ease-in-out;
`;

const SearchResultFrame = styled.div<{ isFocused: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  margin-top: calc(env(safe-area-inset-top) + 57px);
  height: calc(100% - 80px);
  z-index: 1;
  background-color: var(--white);
  overflow-y: scroll;
  visibility: ${(props) => (props.isFocused ? "visible" : "hidden")};
  opacity: ${(props) => (props.isFocused ? "1" : "0")};
  transition:
    visibility 0.3s,
    opacity 0.3s,
    transform 0.3s;
`;

const UserInfoContainer = styled.div<{ type: string }>`
  position: relative;
  left: 0;
  right: 0;
  padding: ${(props) => (props.type === "" ? "0 5.56%" : "0")};
  display: flex;
  align-items: center;
  margin: 20px 0;
`;

const ProfileImg = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 0.5px solid var(--nav-gray);
  box-sizing: border-box;
`;

const TextBox = styled.div`
  flex-grow: 1;
  margin-left: 12px;
  font-size: 15px;
  font-weight: 400;
  word-wrap: break-word;
`;

const SubText = styled.div`
  margin-top: 5px;
  font-size: 12px;
  color: var(--dark-gray);
  margin-bottom: 3px;
`;

const BottomBox = styled.div`
  text-align: center;
  padding: 20px;
  color: var(--dark-gray);
`;
