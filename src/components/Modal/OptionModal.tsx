import styled from "styled-components";
import AnimationModal from "./AnimationModal";

interface OptionModalProps {
  title: string;
  content: string;
  btnText:string;
  isOpen: boolean;
  closeModal: () => void;
  onConfirm?: () => void;
}

export default function OptionModal({
  title,
  content,
  btnText,
  isOpen,
  closeModal,
  onConfirm
}: OptionModalProps) {
  
  return (
    <AnimationModal isOpen={isOpen} closeModal={closeModal}>
      <NotiFrame>
        <NotiTitle>{title}</NotiTitle>
        <NotiContent>{content}</NotiContent>
      </NotiFrame>
      <OptionFrame>
        <Opt onClick={onConfirm}>
          <OptText isRed={true}>{btnText}</OptText>
        </Opt>
        <Opt onClick={closeModal}>
          <OptText>취소</OptText>
        </Opt>
      </OptionFrame>
    </AnimationModal>
  );
};

const NotiFrame = styled.div`
  text-align: center;
  margin-bottom: 28px;
`;

const NotiTitle = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
`;

const NotiContent = styled.div`
  color: var(--dark-gray);
`;

const OptionFrame = styled.div`
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--gray);
  background-color: var(--background);
`;

const Opt = styled.div`
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:not(:last-child) {
    border-bottom: 1px solid var(--gray);
  }
`;

const OptText = styled.div<{ isRed?: boolean }>`
  font-weight: 500;
  margin-top: 1px;
  
  ${(props) => props.isRed && `color: var(--red);`}
`;