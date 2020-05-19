import React from 'react';
import "./FooterNav.css"
import { NavLink, useRouteMatch } from 'react-router-dom';

export default function FooterNav() {

  const match = useRouteMatch();

  console.log("match", match)

  return (
    <>
      <div className="blank"></div>
      <ul className="mk-footernav">
        <li className="item">
          <NavLink to="/home" replace >
            <div className="icon">
              <i className="ift-home"></i>
            </div>
            <span className="text">首页</span>
          </NavLink >
        </li>
        <li className="item stop">
          <NavLink to="/sort" replace title="分类">
            <div className="icon">
              <i className="ift-class-outline"></i>
            </div>
            <span className="text">分类</span>
          </NavLink>
        </li>
        <li className="item">
          <NavLink to="/update" replace title="更新">
            <div className="icon">
              <i className="ift-find-outline"></i>
            </div>
            <span className="text">更新</span>
          </NavLink>
        </li>
        <li className="item">
          <NavLink to="/uc" replace title="我的">
            <div className="icon">
              <i className="ift-mine-outline"></i>
            </div>
            <span className="text">我的</span>
          </NavLink>
        </li>
      </ul>
    </>
  )
}