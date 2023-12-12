// import React from "react";
import { useState, useEffect } from "react";
import HeadBar from "../../components/HeadBar/HeadBar";
import NavBar from "../../components/NavBar/NavBar";
import MainFrame from "../../components/MainFrame/MainFrame";
import styled from "styled-components";
import { ShadowBox } from "../../components/ShadowBox/ShadowBox";
import { ReactComponent as Connected } from "../../assets/icons/connected-icon.svg";
import CompanyDetail from "../../components/Modal/CompanyDetail";
import CompanyList from "../../common/act.json";
import axiosInstance from "../../api/axiosInstance";

interface CategoryProps {
  isSelected: boolean;
}

interface CompanyConnectProps {
  id: number;
  name: string;
  is_connect: boolean;
  policies: string;
}

export default function CompanyPage() {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<number>(0);
  const [company_list, setCompanyList] = useState<CompanyConnectProps[] | null>(
    null
  );

  const axios = axiosInstance();

  const showModal = (index: number) => {
    setSelectedCompany(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const categoryList = [
    "전자영수증",
    "텀블러",
    "일회용컵 반환",
    "리필스테이션",
    "다회용기",
    "고품질 재활용품",
    "친환경제품",
    "무공해차",
    "폐휴대폰",
  ];

  const categoryInEnglish = [
    "ELECTRONIC_RECEIPT",
    "TUMBLER",
    "DISPOSABLE_CUP",
    "REFILL_STATION",
    "MULTI_USE_CONTAINER",
    "HIGH_QUALITY_RECYCLED_PRODUCTS",
    "ECO_FRIENDLY_PRODUCTS",
    "EMISSION_FREE_CAR",
    "DISCARDED_PHONE",
  ];

  const handleCategoryClick = (index: number) => {
    if (selectedCategoryIndex === index) {
    } else if (selectedCategoryIndex != index) {
      setSelectedCategoryIndex(index);
    }
  };

  const filteredCompanies = (
    CompanyList.find(
      (category) => category.name === categoryList[selectedCategoryIndex]
    )?.companies || []
  ).sort((a, b) => a.name.localeCompare(b.name, "en"));

  const getCompanyConnected = async () => {
    try {
      const response = await axios.get(
        `/cpoint/company?category=${categoryInEnglish[selectedCategoryIndex]}`
      );
      const data = await response.data.company_list;
      setCompanyList(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCompanyConnected();
  }, []);

  useEffect(() => {
    getCompanyConnected();
  }, [selectedCategoryIndex]);

  return (
    <>
      <HeadBar pagename="참여기업" bgcolor="white" backbutton="yes" />

      <Categories>
        <Margin />
        {categoryList.map((category, index) => (
          <Category
            key={index}
            isSelected={index === selectedCategoryIndex}
            onClick={() => handleCategoryClick(index)}
          >
            {category}
          </Category>
        ))}
      </Categories>

      <MainFrame
        headbar="yes"
        navbar="yes"
        bgcolor="background"
        marginsize="large"
      >
        <ConnectedFrame>
          연동됨
          <ConnectedIcon />
        </ConnectedFrame>

        <CompaniesFrame>
          {filteredCompanies.map((company, index: number) => (
            <CompanyFrame
              onClick={() => {
                showModal(index);
              }}
            >
              {company_list ? (
                company_list[index]?.is_connect === true ? (
                  <CompanyConnected />
                ) : null
              ) : null}
              {/* {company_list[index]?.is_connect === true ? <CompanyConnected /> : null} */}
              <LogoImgFrame>
                <LogoImg src={company.logo} />
              </LogoImgFrame>
              <Companyname>{company.name}</Companyname>
            </CompanyFrame>
          ))}
          <MarginBottom />
        </CompaniesFrame>
      </MainFrame>

      {modalOpen ? (
        <CompanyDetail
          closeModal={closeModal}
          companyInfo={filteredCompanies[selectedCompany]}
          isConnected={
            company_list ? company_list[selectedCompany]?.is_connect : false
          }
        />
      ) : null}
      <NavBar />
    </>
  );
}

const Categories = styled.div`
  position: absolute;
  z-index: 3;
  margin-top: max(47px, calc(47px + env(safe-area-inset-top)));
  width: 100%;
  height: 52px;
  background-color: var(--white);
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  overflow-x: auto;
  border-bottom: 1px solid var(--gray);
`;

const Margin = styled.div`
  position: relative;
  width: 14px;
  height: 100%;
`;

const Category = styled.div<CategoryProps>`
  position: relative;
  height: 32px;
  width: auto;
  border-radius: 20px;
  border: ${(props) =>
    props.isSelected ? "1px solid transparent" : "1px solid var(--gray)"};
  background-color: ${(props) =>
    props.isSelected ? "var(--primary)" : "var(--white)"};
  color: ${(props) => (props.isSelected ? "var(--white)" : "var(--dark-gray)")};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: 400;
  margin-right: 12px;
  margin-bottom: 2.5px;
  padding: 0px 14px;
`;

const ConnectedFrame = styled.div`
  position: relative;
  width: 100%;
  margin-top: 70px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 10px;
  color: var(--dark-gray);
  font-weight: 400;
`;

const ConnectedIcon = styled(Connected)`
  margin-top: 1.8px;
  margin-left: 4px;
  margin-right: 1.5px;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.06));
`;

const CompaniesFrame = styled.div`
  position: relative;
  width: 100%;
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow-y: scroll;
`;

const CompanyFrame = styled(ShadowBox)`
  width: 47.4%;
  height: 84px;
  margin-top: 8px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
`;

const LogoImgFrame = styled.div`
  position: relative;
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// img로 바꾸기
const LogoImg = styled.img`
  height: 100%;
  max-width: 72%;
  background-color: var(--white);
`;

const Companyname = styled.div`
  position: relative;
  width: 100%;
  text-align: center;
  margin-top: 6px;
`;

const MarginBottom = styled.div`
  position: relative;
  width: 100%;
  height: 8px;
`;

const CompanyConnected = styled(Connected)`
  position: absolute;
  top: 10px;
  right: 10px;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.06));
`;
