import React, { useCallback, useEffect, useState } from 'react';
import "./index.css"
import { useParams, useHistory } from 'react-router-dom';
import { getMoreRecommend } from '../../request/api';
const spaceGif = require("@/assets/images/space.gif")

interface IMoreProps {
  typeId: string
}

interface IComicItem {
  id: string;
  thumbImg: string;
  title: string;
  score?: string;
  desc?: string;
  tags: string[]
}

interface IRecommendData {
  posterImage: string;
  title: string;
  desc?: string;
  comicList: IComicItem[]
}

export default function More() {

  const { typeId } = useParams<IMoreProps>();
  const history = useHistory();
  const [recommendData, setRecommendData] = useState({} as IRecommendData)

  const fetchMoreRecommendData = useCallback(async () => {
    const response = await getMoreRecommend(typeId);
    return response.data.data as IRecommendData;
  }, [typeId]);

  useEffect(() => {
    fetchMoreRecommendData().then(data => {
      setRecommendData(data);
    })
  }, [fetchMoreRecommendData]);

  function onClickItem(bookId: string) {
    history.push(`/book/${bookId}`)
  }

  function goBack() {
    history.goBack();
  }


  return (
    <div className="mk-book">
      <div className="book-figure">
        <span className="goback ift-goback" onClick={goBack}> </span>
        <img className="figure" src={spaceGif} alt={recommendData.title} style={{ backgroundImage: `url(${recommendData.posterImage})` }} />
        <h1 className="title">{recommendData.title}</h1>
      </div>
      <div className="book-desc">
        <div className="icon-box">
          <span className="ift-heart">99</span>
          <span className="ift-share1">99</span>
          <span className="ift-comment">99</span>
        </div>
        <div className="content">{recommendData.desc}</div>
      </div>
      <ul className="mk-book-list">
        {
          recommendData.comicList?.map(item => {
            return (
              <li className="item" key={item.id} onClick={() => onClickItem(item.id)}>
                <div className="comic-item">
                  <div className="thumbnail">
                    <img src={spaceGif} alt={item.title} style={{ backgroundImage: `url(${item.thumbImg})` }} />
                    <span className="ift-xing score">{item.score}</span>
                  </div>
                </div>
                <div className="info">
                  <span className="title" >{item.title}</span>
                  <ul className="tags-box">
                    {
                      item.tags?.map((tag, idx) => <li className="tags" key={idx}> <span className="tags-txt">{tag}</span> </li>)
                    }
                  </ul>
                  <div className="reason">
                    <span className="strong">推荐理由:</span> <span className="content">{item.desc}</span>
                  </div>
                </div>
              </li>
            )
          })
        }
      </ul>
      <div className="mk-book-ft">共{recommendData.comicList?.length ?? 0}个推荐</div>
    </div>
  )
}