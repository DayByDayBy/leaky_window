import React from "react";
import UserInfo from "./components/UserInfo";
import Autofiller from "./components/Autofiller";
import './App.css';

const App: React.FC = () => {
  return (
    <section className="App">
      <h1 className="page-title">leaky window</h1>

      <Autofiller />

      <UserInfo />
    </section>
  );
};

export default App;
