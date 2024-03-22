import Header from "./Header";
import Sidebar from "./sidebar/Sidebar";
import MainView from "./MainView";
import React, { useState } from "react";


import "../App.css";


function Layout() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="main-container grow flex">
        <Sidebar />
        <MainView />
      </div>
    </div>
  );
}

export default Layout;