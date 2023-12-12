// import React from 'react'
import styled from "styled-components";
import { ReactComponent as FillSvg } from "../../assets/icons/leaf-fill.svg";
import { ReactComponent as EmptySvg } from "../../assets/icons/leaf-empty.svg";

interface ScoreBarProps {
  title: string;
  score: number;
}

export const ScoreBar = ({title, score} : ScoreBarProps) => {
  const filledCircles = Array(score).fill(null).map((_, index) => <FillLeap key={index} />);
  const borderCircles = Array(5 - score).fill(null).map((_, index) => <EmptyLeap key={index} />);

  return (
    <AnalysisFrame>
      <span>{title}</span>
      <div>
        {filledCircles}
        {borderCircles}
      </div>
    </AnalysisFrame>
  )
}

const AnalysisFrame = styled.div`
  width: 100%;
  margin: 10px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;

  div {
    width: 65%;
    display: flex;
    justify-content: space-around;
  }

  span {
    width: 25%;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    color: var(--primary);
  }
`;

const FillLeap = styled(FillSvg)`
  width: 28px;
  height: 28px;
`;

const EmptyLeap = styled(EmptySvg)`
  width: 28px;
  height: 28px;
`;
