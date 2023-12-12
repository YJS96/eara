import { useRef, useState, useEffect } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import "../../style/ImageCropper.css";
import styled from "styled-components";
import AnimationModal from "../../components/Modal/AnimationModal";
import { ShortButton } from "../../style";
import { ReactComponent as RotateSvg } from "../../assets/icons/rotate-icon.svg";
import { ReactComponent as ResetSvg } from "../../assets/icons/reset-icon.svg";

interface CropProps {
  onCrop: (image: string) => void;
  children: React.ReactNode;
}

const ImageCropper = ({ onCrop, children }: CropProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [image, setImage] = useState<null | string>(null);
  const [rotation, setRotation] = useState(0);
  const [marginValue, setMarginValue] = useState(- 8);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen === false) {
      setTimeout(() => {
        setImage(null);
      }, 260);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.target.files;

    if (!files) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setIsOpen(true);
    };
    reader.readAsDataURL(files[0]);
  };

  const handleCancleClick = () => {
    setIsOpen(false);
    setRotation(0);
  };

  // const handleChildrenClick = () => {
  //   if (inputRef.current) inputRef.current.click();
  // };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      onCrop(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      handleCancleClick();
    }
  };

  const rotateImage = (degrees: number) => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      if (degrees >= 0) {
        cropperRef.current?.cropper.rotate(degrees - rotation);
        setRotation(degrees);
        if (degrees < 334) {
          setMarginValue(degrees/3.6 - 8.65);
        } else {
          setMarginValue(84);
        }
      } else {
        cropperRef.current?.cropper.rotate(degrees);
      }
    }
  };

  const handleResetClick = () => {
    if (cropperRef.current) {
      cropperRef.current.cropper.reset();
      setRotation(0);
    }
  };

  return (
    <Container>
      <ImageInput
        type="file"
        id="file"
        accept="image/*"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <InputLabel htmlFor="file">{children}</InputLabel>
      {/* <span onClick={handleChildrenClick}>{children}</span> */}
      <AnimationModal isOpen={isOpen} closeModal={handleCancleClick}>
        <ModalTitle>이미지 편집하기</ModalTitle>
        <IconFrame>
          <RotateSvg onClick={() => rotateImage(-90)} />
          <ResetSvg onClick={handleResetClick} />
        </IconFrame>
        <div className="content-wrapper">
          <Cropper
            ref={cropperRef}
            aspectRatio={1}
            src={image ? image : ""}
            viewMode={1}
            background={false}
            responsive
            autoCropArea={1}
            checkOrientation={false}
            guides
            style={{
              width: "calc(100% - 4px)",
              display: "flex",
              justifyContent: "center",
            }}
          />
        </div>
        <TextFrame>
          <Text left={marginValue}>{rotation}°</Text>
        </TextFrame>
        <Slider
          type="range"
          min="0"
          max="360"
          value={rotation}
          onChange={(e) => rotateImage(Number(e.target.value))}
        />
        <div className="footer">
          <ShortButton
            background="var(--third)"
            color="var(--primary)"
            onClick={handleCancleClick}
          >
            취소
          </ShortButton>
          <ShortButton onClick={getCropData}>적용하기</ShortButton>
        </div>
      </AnimationModal>
    </Container>
  );
};

export default ImageCropper;

const Container = styled.div`
  background-color: var(--background);
  border: 1px solid var(--gray);
  position: relative;
  width: 100%;
`;

const ImageInput = styled.input`
  position: relative;
  width: 100%;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
  z-index: 2;
`;

const InputLabel = styled.label`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
  overflow: hidden;
  z-index: 2;
`;

const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 550;
  text-align: center;
`;

const TextFrame = styled.div`
  width: 100%;
  max-width: 464px;
`
const Text = styled.div<{left: number}>`
  font-size: 15px;
  width: 48px;
  text-align: end;
  font-weight: 400;
  margin-left: ${(props) => `${props.left}%`};
`;

const IconFrame = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 8px;
`;

const Slider = styled.input`
  width: calc(100% - 4px);
  background-color: transparent;
  accent-color: var(--primary);
  margin: 10px 0;
`;
