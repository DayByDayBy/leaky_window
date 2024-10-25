import React from "react";
import UserInfoComponent, { LocationProvider } from "./components/UserInfo";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <LocationProvider>
        <div className="page-container">
          <UserInfoComponent />
        </div>
      </LocationProvider>
    </div>
  );
};

export default App;
