import React from "react";
import UserInfoComponent, { LocationProvider } from "./components/UserInfo";

 

const App: React.FC = () => {
  return (
    <div className="App">
      <LocationProvider>
        <UserInfoComponent />
      </LocationProvider>
    </div>
  );
};

export default App;
