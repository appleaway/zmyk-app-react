import React from 'react';
import "./RankItem.css";
import { useHistory } from "react-router-dom"
const spaceGif = require("@/assets/images/space.gif")

export interface IRankItem {
  id: string;
  thumbImg: string;
  title: string;
  count: string;
  num: string;
  tags: string[]
}

export default function RankItem(props: IRankItem) {

  const history = useHistory();

  function onRankListItemClick(id: string) {
    history.push(`/book/${id}`);
  }

  return (
    <li className="item" onClick={() => onRankListItemClick(props.id)}>
      <div className="comic-item">
        <div className="thumbnail">
          <img className="img" src={spaceGif} alt={props.title} style={{ backgroundImage: `url(${props.thumbImg})` }} />
        </div>
      </div>
      <h3 className="title">
        <span title={props.title}>{props.title}</span>
      </h3>
      <ul className="tags-box">
        {
          props.tags.map((tag, idx) => (
            <span className="tags" key={idx}>
              <span className="tags-txt">{tag}</span>
            </span>
          ))
        }
      </ul>
      <span className="ift-fire count">{props.count}</span> <span className="num">{props.num}</span>
    </li>
  )
}