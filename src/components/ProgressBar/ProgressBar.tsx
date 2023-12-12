// import React from 'react'
import { useState, useEffect } from "react";
import styled from "styled-components";

interface ProgressBarProps {
  progress: number;
  greeninit: number;
}

export default function ProgressBar({ progress, greeninit }: ProgressBarProps) {
  const [newProgress, setNewProgress] = useState(0);
  const [progressMargin, setProgressMargin] = useState(3.5);

  var newMargin = progress;
  if (progress < 4) {
    newMargin = 3.5;
  }

  if (progress > 96) {
    newMargin = 96;
  }

  if (progress >= 100) {
    newMargin = 95;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setNewProgress(progress);
    }, 180);
    return () => clearTimeout(timer);
  }, [progress]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressMargin(newMargin);
    }, 180);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <ProgressFrame>
      <ProgressRate style={{ marginLeft: `calc(${progressMargin}% - 11px)` }}>
        {progress}%
      </ProgressRate>
      <ProgressBarBack />
      <ProgressBarFront style={{ width: `${newProgress}%` }} />
      <GreenFirst>
        {greeninit?.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
        그루
      </GreenFirst>
    </ProgressFrame>
  );
}

const ProgressFrame = styled.div`
  position: relative;
  width: 100%;
  height: 50px;
`;

const ProgressRate = styled.div`
  position: absolute;
  font-size: 11px;
  color: var(--dark-gray);
  margin-top: 1px;
  transition: margin-left 0.75s ease;
`;
const ProgressBarBack = styled.div`
  position: absolute;
  margin-top: 20px;
  width: 100%;
  height: 8px;
  background-color: var(--third);
  border-radius: 16px;
  z-index: 1;
`;

const ProgressBarFront = styled.div`
  position: absolute;
  margin-top: 20px;
  width: 0;
  height: 8px;
  background-color: var(--primary);
  border-radius: 16px;
  z-index: 2;
  transition: width 0.75s ease;
`;
const GreenFirst = styled.div`
  position: absolute;
  right: 0px;
  margin-top: 35px;
  font-size: 11px;
  color: var(--dark-gray);
`;
