import "../assets/stylesheets/Header.css";
import React from "react";

function Header() {
  return (
    <div className="header">
      <div className="header-items">
        {/* TODO: Logo 이쁜걸로 바꿔주세요 */}
        {/* from: https://github.com/Templarian/MaterialDesign */}
        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19.5 15.5a.5.5 0 0 1-.5.5a.5.5 0 0 1-.5-.5v-7c0-1.93-2.07-3.5-4-3.5H6a4 4 0 0 0-4 4v10h4v-4h5v4h4v-4.5a.5.5 0 0 1 .5-.5a.5.5 0 0 1 .5.5V16a3 3 0 0 0 3 3a3 3 0 0 0 3-3v-2h-2.5z"/>
        </svg>
        <h1 className="header-name">
          VPQO: Visualization of PostgreSQL's Query Optimization Procedure
        </h1>
      </div>
      <hr />
    </div>
  );
}

export default Header;