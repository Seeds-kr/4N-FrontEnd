import React, { useState } from 'react';
import SearchPlace from './kakaomap/SearchPlace'; // MapContainer 컴포넌트 import
import FolderManager from './kakaomap/FolderManager'; // FolderManager 경로를 적절하게 변경하세요.

function App() {
  const [userId, setUserId] = useState(null);

  return (
    <div>
      <SearchPlace setUserId={setUserId} />
      <FolderManager userId={userId} />
    </div>
  );
}

export default App;
