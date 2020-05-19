import React from 'react';
import { Link } from "react-router-dom"
import "./ComicItem.css";
const spaceGif = require("@/assets/images/space.gif")

export interface IComicItem {
  chapter?: string,
  desc?: string,
  id: string,
  score: string,
  thumbImg: string,
  title?: string,
  key?: number
}

export default function ComicItem(props: IComicItem) {
  return (
    <div className="comic-item">
      <Link to={`/book/${props.id}`}>
        <div className="thumbnail">
          <img className="comic-img" src={spaceGif} data-id={props.id} alt={props.title} style={{ backgroundImage: `url(${props.thumbImg})` }} />
          {props.chapter && <span className="chapter">{props.chapter}</span>}
          <span className="ift-xing score">{props.score}</span>
        </div>
        {
          props.title &&
          <h3 className="title">
            <span>{props.title}</span>
          </h3>
        }
        {
          props.desc &&
          <p className="desc">{props.desc}</p>
        }
      </Link>
    </div>
  )
}