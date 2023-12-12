import React from "react";
import styled from "styled-components";

interface MainFrameProps {
  headbar: string;
  navbar: string;
  bgcolor: string;
  marginsize: string;
  children: React.ReactNode;
}

export default function MainFrame({
  headbar,
  navbar,
  marginsize,
  bgcolor,
  children,
}: MainFrameProps) {
  var marginTop = "0";
  var frame = "0";
  var marginsides = 0;

  if (headbar === "yes" && navbar === "yes") {
    marginTop = "calc(48px + env(safe-area-inset-top))";
    frame = "calc(100% - 48px - env(safe-area-inset-top) - 76px";
  } else if (headbar === "yes" && navbar === "no") {
    marginTop = "calc(48px + env(safe-area-inset-top))";
    frame = "calc(100% - 48px - env(safe-area-inset-top))";
  } else if (headbar === "no" && navbar === "yes") {
    marginTop = "0";
    frame = "calc(100% - 76px)";
  } else if (headbar === "no" && navbar === "no") {
    marginTop = "0";
    frame = "100%";
  }

  if (marginsize === "small") {
    marginsides = 4.44;
  } else if (marginsize === "medium") {
    marginsides = 5.56;
  } else if (marginsize === "large") {
    marginsides = 6.67;
  } else if (marginsize === "no") {
    marginsides = 0;
  }

  return (
    <Main
      style={{
        backgroundColor: `var(--${bgcolor})`,
        height: `${frame}`,
        marginTop: `${marginTop}`,
        // paddingLeft: `${marginsides}%`,
        // paddingRight: `${marginsides}%`,
        padding: `0px ${marginsides}%`,
      }}
    >
      {/* <Margin /> */}
      {children}
    </Main>
  );
}

const Main = styled.div`
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background-color: var(--white);
  color: var(--black);
  overflow-x: hidden;
  overflow-y: scroll;
`;

// const Margin = styled.div`
//   position: relative;
//   width: 100%;
//   height: env(safe-area-inset-top);
// `;
