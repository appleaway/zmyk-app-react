import React from 'react';
import "./FloorTitle.css";

export interface IFloorTitle {
  id: string
  iconClass: string
  title: string
  summary: string
}

export default function FloorTitle(props: IFloorTitle) {

  return (
    <div className="hd">
      <div className="main">
        <i className={`icon ${props.iconClass}`}></i>
        <h2 className="title">{props.title}</h2>
        <p className="summary">{props.summary}</p>
      </div>
      <a href={`/more/${props.id}`} title={props.title} className="more">
        <i className="ift-mantou"></i>更多</a>
    </div>
  )
}