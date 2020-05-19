import React from 'react';
import { useHistory } from "react-router-dom"
import "./ComicHeader.css";

export default function ComicHeader() {

  const history = useHistory();

  function goBack() {
    history.goBack();
  }

  return (
    <header className="mk-header top-nav">
      <div className="left" onClick={goBack}>
        <i className="back ift-goback"></i>
      </div>
      <div className="right">
        <span className="like ift-collect">
        </span>
        <p className="msg ift-message" title="漫画热评">
          <span className="cy_cmt_count">99+</span>
        </p>
      </div>
    </header>
  )
}