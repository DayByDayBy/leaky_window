import React from "react";
import UserInfoComponent, { LocationProvider } from "./components/UserInfo";
import Permissions from "./components/Permissions";
import './App.css';

 

const App: React.FC = () => {
  return (
    <div className="App">
      <LocationProvider>
      <div className="page-container">
      <UserInfoComponent />
      <div className="permissions-section">
        <Permissions />
      </div>
    </div>
      </LocationProvider>
    </div>
  );
};

export default App;
