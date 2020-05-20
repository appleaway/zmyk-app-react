import React, { useEffect, useState } from 'react';
import "./FooterNav.css"
import { NavLink, useRouteMatch } from 'react-router-dom';

const defaultFooterNav = [{
  path: "/home",
  name: "首页",
  activeIconClass: "ift-home",
  inActiveIconClass: "ift-home-outline",
}, {
  path: "/category",
  name: "分类",
  activeIconClass: "ift-class",
  inActiveIconClass: "ift-class-outline",
}, {
  path: "/update",
  name: "更新",
  activeIconClass: "ift-find",
  inActiveIconClass: "ift-find-outline",
}, {
  stop: true,
  path: "/mine",
  name: "我的",
  activeIconClass: "ift-mine",
  inActiveIconClass: "ift-mine-outline",
}]

export default function FooterNav() {

  const { path } = useRouteMatch();
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(path)
  }, [path])

  return (
    <>
      <div className="blank"></div>
      <ul className="mk-footernav">
        {
          defaultFooterNav.map((item, index) => {
            return (
              <li className={`${!item.stop ? 'item' : 'item stop'}`} key={index}>
                <NavLink to={item.path}  >
                  <div className="icon">
                    <i className={currentPath === item.path ? item.activeIconClass : item.inActiveIconClass}></i>
                  </div>
                  <span className="text">{item.name}</span>
                </NavLink >
              </li>
            )
          })
        }
      </ul>
    </>
  )
}