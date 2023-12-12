// import React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import HeadBar from "../../components/HeadBar/HeadBar";
import { ModalFrame } from "../../style/ModalFrame";
import "../../style/kakaomapOverlay.css";
import actList from "../../common/act.json";
import axiosInstance from "../../api/axiosInstance";

interface CategoryProps {
  isSelected: boolean;
}

declare global {
  interface Window {
    kakao: any;
  }
}

interface StoreProps {
  company_id: number;
  company_name: string;
  branch_name: string;
  latitude: number;
  longitude: number;
  distance: number;
}

interface StoreListProps {
  activity_type: string;
  stores: StoreProps[];
}

export default function MapPage() {
  const axios = axiosInstance();
  const { kakao } = window;
  const categoryList = [
    "전체보기",
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
    "",
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

  const [selectedCategoryIndex, setSelectedCategoryIndex] =
    useState<number>(10);
  const [mapLat, setMapLat] = useState(37.5013068);
  const [mapLng, setMapLng] = useState(127.0396597);
  const [mapLevel, setMapLevel] = useState(555);
  const [kakaoMap, setKakaoMap] = useState<any>(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setSelectedCategoryIndex(0);
    }, 250);
  }, []);

  var filteredList: StoreProps[] = [];

  // 클릭된 카테고리를 출력
  const handleCategoryClick = (index: number) => {
    if (selectedCategoryIndex === 0 && index === 0) {
    } else if (selectedCategoryIndex != index) {
      setSelectedCategoryIndex(index);
    } else if (selectedCategoryIndex != 0 && selectedCategoryIndex === index) {
      setSelectedCategoryIndex(0);
    }
  };
  const [store_list, setStoreList] = useState<StoreListProps[] | null>(null);

  if (selectedCategoryIndex === 0) {
    // @ts-ignore
    filteredList = store_list?.flatMap((item: any) => item.stores);
  } else {
    const selectedType = categoryInEnglish[selectedCategoryIndex];
    const foundItem = store_list?.find(
      (item: any) => item.activity_type === selectedType
    );
    filteredList = foundItem ? foundItem.stores : [];
  }
  filteredList.sort((a: any, b: any) => a.distance - b.distance);

  const calculateTime = (distance: number) => {
    if (distance < 80) {
      return "1분";
    } else if (distance < 4800) {
      return `${Math.round(distance / 80)}분`;
    } else {
      return `${Math.floor(distance / 4800)}시간`;
    }
  };

  function getLogoPath(companyName: string) {
    for (let act of actList) {
      for (let company of act.companies) {
        if (company.name === companyName) {
          return company.logo;
        }
      }
    }
  }

  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(37.5013068, 127.0396597),
      level: 4,
    };

    const map = new kakao.maps.Map(container, options);
    setKakaoMap(map);

    map.setMinLevel(1);
    map.setMaxLevel(8);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude - 0.00025;
        var lon = position.coords.longitude - 0.0003;
        var locPosition = new kakao.maps.LatLng(lat, lon);
        map.setCenter(locPosition);

        setMapLat(lat);
        setMapLng(lon);
        map.setCenter(locPosition);

        var imageSrc = "/images/netzero/gps-my.png";
        var imageSize = new kakao.maps.Size(32, 32);
        var imageOption = { offset: new kakao.maps.Point(16, 24) };

        var markerImage = new kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        );

        var marker = new kakao.maps.Marker({
          position: locPosition,
          image: markerImage,
        });

        map.setCenter(locPosition);
        getFirstStore(lat, lon);
        marker.setMap(map);
      });
    }
    kakao.maps.event.addListener(map, "dragend", function () {
      var center = map.getCenter();
      var newLat = center.getLat();
      var newLng = center.getLng();
      var mapLevel = map.getLevel();
      setMapLat(newLat);
      setMapLng(newLng);
      var radius = 555;
      if (mapLevel == 1) {
        radius = 108;
      } else if (mapLevel == 2) {
        radius = 162;
      } else if (mapLevel == 3) {
        radius = 310;
      } else if (mapLevel == 4) {
        radius = 555;
      } else if (mapLevel > 4) {
        radius = 1045;
      }
      setMapLevel(radius);
    });
  }, []);

  const clearMarkers = () => {
    // @ts-ignore
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  useEffect(() => {
    clearMarkers();

    getStore(mapLevel, mapLat, mapLng);
    // @ts-ignore
    const map = kakaoMap;

    // @ts-ignore
    const newMarkers: any = filteredList.map((store) => {
      const latlng = new kakao.maps.LatLng(store.latitude, store.longitude);
      const marker = new kakao.maps.Marker({ position: latlng });
      marker.setMap(kakaoMap);
      return marker;
    });

    setMarkers(newMarkers); // Update the markers state
  }, [mapLat, mapLng, selectedCategoryIndex]);

  useEffect(() => {
    setTimeout(() => {
      setSelectedCategoryIndex(0);
    }, 300);
  }, []);

  const getStore = async (radius: number, draglat: number, draglon: number) => {
    try {
      const response = await axios.get(
        `/cpoint/store?radius=${radius}&latitude=${draglat}&longitude=${draglon}`
      );
      const data = await response.data.store_list;
      setStoreList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getFirstStore = async (initlat: number, initlon: number) => {
    try {
      const response = await axios.get(
        `/cpoint/store?radius=505&latitude=${initlat}&longitude=${initlon}`
      );
      const data = await response.data.store_list;
      setStoreList(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <HeadBar pagename="지도" bgcolor="white" backbutton="yes" />
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
      <MapAndModal>
        <MapFrame>
          <Map id="map"></Map>
        </MapFrame>
        <MapModal>
          <CurrencyInfoFrame />

          <StoreScroll>
            {filteredList?.length > 0 ? (
              filteredList.map((Store: any, index: number) => (
                <StoreFrame key={index}>
                  <LogoFrame>
                    <Logo src={getLogoPath(Store.company_name)} />
                  </LogoFrame>
                  <StoreInfoFrame>
                    <StoreName>
                      {Store?.company_name} {Store?.branch_name}
                    </StoreName>
                    <StoreInfo>
                      {Store?.distance < 1000
                        ? `${parseInt(Store?.distance)}m`
                        : `${(Store?.distance / 1000).toFixed(1)}km`}
                      &nbsp;&nbsp;
                      <Middot>&middot;</Middot>&nbsp;&nbsp;
                      {calculateTime(Store?.distance)}
                    </StoreInfo>
                  </StoreInfoFrame>
                </StoreFrame>
              ))
            ) : (
              <NoStore>주위에 해당하는 매장이 없어요</NoStore>
            )}
            <HideLastBorder />
            <MarginBottom />
          </StoreScroll>
        </MapModal>
      </MapAndModal>
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

const MapAndModal = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100% - 52px - 48px - env(safe-area-inset-top));
  margin-top: calc(48px + env(safe-area-inset-top) + 51px);
`;

const MapFrame = styled.div`
  position: relative;
  width: 100%;
  height: 51.2%;
  background-color: var(--white);
`;

const Map = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const MapModal = styled(ModalFrame)`
  position: absolute;
  bottom: 0;
  height: 51.6%;
  overflow-y: hidden;
  z-index: 3;
`;

const CurrencyInfoFrame = styled.div`
  position: relative;
  width: 100%;
  height: 12px;
`;

const StoreScroll = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 16px);
  overflow-y: scroll;
`;

const StoreFrame = styled.div`
  position: relative;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--gray);
`;

const LogoFrame = styled.div`
  position: relative;
  width: 68px;
  height: 68px;
  border: 1px solid var(--gray);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Logo = styled.img`
  position: relative;
  width: 100%;
  height: auto;
`;

const StoreInfoFrame = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 14px;
`;

const StoreName = styled.div`
  position: relative;
  font-size: 15x;
  font-weight: 550;
`;

const StoreInfo = styled.div`
  position: relative;
  font-size: 12.5px;
  font-weight: 400;
  margin-top: 6px;
  color: var(--dark-gray);
`;

const Middot = styled.span`
  font-weight: 700;
`;

const HideLastBorder = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
  background-color: var(--white);
  margin-top: -2.5px;
`;

const NoStore = styled.div`
  position: absolute;
  top: calc(50% - 28px);
  width: 100%;
  text-align: center;
  font-size: 16px;
  color: var(--dark-gray);
  font-weight: 400;
`;

const MarginBottom = styled.div`
  width: 100%;
  height: 20px;
`;
