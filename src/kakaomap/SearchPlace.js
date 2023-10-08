// SearchPlace.js
import React, { useState } from 'react';
import MapContainer from '../kakaomap/Mapcontainer';
import { login } from '../pages/Login';

const SearchPlace = ({ setUserId }) => {
  const [inputText, setInputText] = useState('');
  const [place, setPlace] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [useremail, setUseremail] = useState('');
  const [password, setPassword] = useState('');

  const onChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlace(inputText);
    setInputText('');
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      // 로그인 API 호출 및 사용자 ID 설정
      const id = await login(useremail, password);
      setUserId(id);

      // 상태 초기화
      setUseremail('');
      setPassword('');

      // 로그인 폼 숨김 처리
      setShowLogin(false);

      // 장소 검색 실행
      setPlace(inputText);
    } catch (error) {
      console.error('로그인 오류:', error);
    }
  };

  return (
    <>
      <form className="inputForm" onSubmit={handleSubmit}>
        <input placeholder="Search Place..." onChange={onChange} value={inputText} />
        <button type="submit">검색</button>
        <button onClick={handleLoginClick}>로그인하기</button>
      </form>
      {showLogin && (
        <form onSubmit={handleLoginSubmit}>
          <input type="text" placeholder="Useremail..." onChange={(e) => setUseremail(e.target.value)} value={useremail} />
          <input type="password" placeholder="Password..." onChange={(e) => setPassword(e.target.value)} value={password} />
          <button type="submit">로그인</button>
        </form>
      )}
      <MapContainer searchPlace={place} />
    </>
  );
};
export default SearchPlace;
