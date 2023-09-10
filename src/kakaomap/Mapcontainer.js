import React, { useEffect, useState, useRef } from 'react';
import '../css/sidebar.css';
import { saveLocation } from './savelocation';

const { kakao } = window;

const MapContainer = ({ searchPlace }) => {
  // 장소 목록
  const PlaceList = ({ places }) => {
    return (
      <div className="place-list">
        <h2>장소 목록</h2>
        <ul>
          {places.map((place, index) => (
            <li key={index}>
              <span className={`markerbg marker_${index + 1}`}></span>
              <div className="info">
                <h5>{place.place_name}</h5>
                {place.road_address_name ? (
                  <>
                    <span style={{ display: 'block' }}>{place.road_address_name}</span>
                    <span className="jibun gray" style={{ display: 'block' }}>
                      <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_jibun.png" alt="지번" />
                      {place.address_name}
                    </span>
                  </>
                ) : (
                  <span>{place.address_name}</span>
                )}
                <span className="tel">{place.phone}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const itemsPerPage = 10; // 페이지 당 표시할 항목 수
  const [currentPage, setCurrentPage] = useState(1);

  const [places, setPlaces] = useState([]); // 장소 목록 상태
  const markers = useRef([]); // 마커 목록을 관리할 ref

  const nextPage = () => {
    if (startIndex + itemsPerPage < places.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 이전 페이지를 위한 이벤트 핸들러
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // 현재 페이지에 대한 시작 및 끝 인덱스 계산
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // 현재 페이지의 항목만 표시하기 위해 배열 슬라이스
  const placesToDisplay = places.slice(startIndex, endIndex);

  // const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    const map = new kakao.maps.Map(container, options);

    // 장소 검색 객체를 생성
    const ps = new kakao.maps.services.Places();

    // 인포윈도우 생성
    let infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    // 키워드로 장소를 검색
    ps.keywordSearch(searchPlace, placesSearchCB);

    // 키워드 검색 완료 시 호출되는 콜백함수
    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        // 이전 마커들을 지우기
        markers.current.forEach((marker) => {
          marker.setMap(null);
        });

        // 검색 결과를 상태에 업데이트
        setPlaces(data);

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가
        let bounds = new kakao.maps.LatLngBounds();

        // 새로운 마커들을 저장하기 위해 빈 배열 초기화
        markers.current = [];

        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정
        map.setBounds(bounds);
      }
    }
    // 지도에 마커를 표시하는 함수
    function displayMarker(place) {
      let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });

      // 마커를 markers 배열에 저장
      markers.current.push(marker);

      let isInfoWindowOpen = false; // 인포윈도우 상태를 추적하는 변수

      const handleSaveLocation = () => {
        saveLocation(place.place_name, place.address_name, place.phone, place.y, place.x);
        console.log(place.y, place.x);
        infowindow.close();
        isInfoWindowOpen = false;
      };

      // 마커에 클릭 이벤트 등록
      kakao.maps.event.addListener(marker, 'click', function () {
        // 마커 클릭 시 장소명이 인포윈도우에 표시됩니다.
        if (!isInfoWindowOpen) {
          infowindow.setContent(`
            <div style="padding:5px;font-size:12px;">
            ${place.place_name}
            <br />
            <button id="saveButton">저장</button>
          </div>
          `);
          infowindow.open(map, marker);

          // '저장' 버튼이 DOM에 추가된 후에 이벤트 리스너 등록
          setTimeout(() => {
            const saveButton = document.getElementById('saveButton');
            if (saveButton) saveButton.addEventListener('click', handleSaveLocation);
          }, 0);
          isInfoWindowOpen = true;
        } else {
          infowindow.close();
          // 선택한 장소 정보 초기화 및 '저장' 버튼의 이벤트 리스너 제거
          // setSelectedPlace(null);
          // const saveButton = document.getElementById('saveButton');
          const saveButton = document.getElementById('saveButton');
          if (saveButton) saveButton.removeEventListener('click', handleSaveLocation);

          isInfoWindowOpen = false;
        }

        const moveLatLon = new window.kakao.maps.LatLng(place.y, place.x);
        map.panTo(moveLatLon);
      });
    }
  }, [searchPlace]);

  return (
    <div style={{ display: 'flex' }}>
      {places.length > 0 && (
        <div className="sidebar">
          <PlaceList places={placesToDisplay} />
          <div>
            <button onClick={prevPage} disabled={currentPage === 1}>
              이전
            </button>
            <button onClick={nextPage} disabled={endIndex >= places.length}>
              다음
            </button>
          </div>
        </div>
      )}

      <div
        id="map"
        style={{
          //   position: 'absolute',
          flex: 2,
          width: '100vw',
          height: '100vh', // 지도의 높이 설정
        }}
      ></div>
    </div>
  );
};

export default MapContainer;
