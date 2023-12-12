// import React from 'react'
import styled from "styled-components";

interface DetailInputProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  type: string;
}

export default function DetailInput({ value, setValue, type }: DetailInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nowInput = e.target.value;
    if (nowInput.length < 21) {
      setValue(nowInput);
    }
  }

  const placeholder = type === "post" 
    ? "ex) 플로깅, 플러그 뽑기 등"
    : "ex) 쓰레기 무단 투기, 차량 요일제 무시 등";

  return (
    <>
      <InfoName>
        기타 사유 입력
        <Text>{value.length}/20</Text>
      </InfoName>
      <Input
        value={value}
        maxLength={20}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
    </>
  )
}

const InfoName = styled.div`
  position: relative;
  width: 100%;
  font-size: 14px;
  color: var(--dark-gray);
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
`;

const Text = styled.div`
  color: var(--dark-gray);
  font-size: 11.5px;
  font-weight: 400;
  margin: 6px 4px 0 0;
`;

const Input = styled.input`
  width: calc(100% - 8px);
  font-size: 13px;
  outline: none;
  border: none;
  border-bottom: 1px solid var(--nav-gray);
  border-radius: 0px;
  background-color: var(--white);
  padding: 4px;

  &::placeholder {
    font-weight: 300;
  }
`;
