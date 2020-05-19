import React, { useEffect, useState, useCallback } from 'react';
import ComicHeader from "../../components/ComicHeader/ComicHeader";
import ComicItem, { IComicItem } from '../../components/ComicItem/ComicItem';
import { getBookDetail, getBookchapters, getBookCorrelation } from "../../request/api"
import "./index.css";
import { Tabs } from 'antd-mobile';
import { useHistory, useParams } from 'react-router-dom';
const spaceGif = require("@/assets/images/space.gif");

interface IBookDetail {
  author?: string;
  fire?: string;
  lastUpdateTime?: string;
  name?: string;
  score?: string;
  tags: string[];
  thumbnailImage?: string;
}

interface IAuthorDetail {
  authorAnnouncement?: string;
  authorFans?: string;
  authorLevel?: string;
  authorName?: string;
  summary?: string;
  authorProductioin: IComicItem[];
}

interface IBookChapter {
  id: string
  index: number
  txt: string
}

function Book(props: any) {

  const tabs = [{ title: "详情" }, { title: "目录" }, { title: "支持" }]
  const setting = {
    initialPage: 1,
    swipeable: false,
    tabBarInactiveTextColor: "#999",
    tabBarActiveTextColor: "#fc6454",
    tabBarUnderlineStyle: { borderColor: "#fc6454" }
  }

  const id = props.match.params.id as string;

  const [bookDetail, setBookDetail] = useState({ tags: [] } as IBookDetail);
  const [authorDetail, setAuthorDetail] = useState({ authorProductioin: [] } as IAuthorDetail);
  const [correlation, setCorrelation] = useState([] as IComicItem[])

  const fetchBookDetailData = useCallback(async () => {
    const response = await getBookDetail(id);
    return response.data.data as {
      bookDetail: IBookDetail;
      authorDetail: IAuthorDetail
    };
  }, [id])

  const fetchBookCorrelation = useCallback(async () => {
    const response = await getBookCorrelation(id);
    return response.data.data as IComicItem[];
  }, [id])

  useEffect(() => {
    fetchBookDetailData().then(data => {
      setBookDetail(data.bookDetail);
      setAuthorDetail(data.authorDetail);
    });

    fetchBookCorrelation().then(data => {
      setCorrelation(data);
    })
  }, [fetchBookDetailData, fetchBookCorrelation])


  return (
    <>
      <ComicDetail bookDetail={bookDetail} />
      <Tabs tabs={tabs} {...setting}>
        <ComicIntroduce authorDetail={authorDetail} />
        <ComicChapters lastUpdateTime={bookDetail.lastUpdateTime} />
        <h2>支持一下</h2>
      </Tabs>
      <div className="mk-floor mk-recommend">
        <div className="hd"><h2 className="title">相关推荐</h2></div>
        <div className="comic-item-wrap">
          {correlation.map((item, index) => <ComicItem key={index} {...item} />)}
        </div>
      </div>
    </>
  );
}


function ComicDetail({ bookDetail }: { bookDetail: IBookDetail }) {

  return (
    <div className="mk-detail">
      <div className="comic-info">
        <div className="cover-bg">
          <img src={spaceGif} alt={bookDetail.name} className="thumbnail" style={{ backgroundImage: `url(${bookDetail.thumbnailImage})` }} />
        </div>
        <ComicHeader />
        <div className="comic-item">
          <div className="thumbnail">
            <img src={spaceGif} alt="" style={{ backgroundImage: `url(${bookDetail.thumbnailImage})` }} />
            <span className="ift-xing score">{bookDetail.score}</span>
          </div>
        </div>
        <h1 className="name">{bookDetail.name}</h1>
        <span className="author">{bookDetail.author}</span>
        <ul className="tags-box">
          {bookDetail.tags.map((tag, idx) => <li className="tags" key={idx}>
            <span className="tags-txt">{tag}</span>
          </li>)}
        </ul>
        <span className="hasread ift-fire">{bookDetail.fire}</span>
      </div>
      <div className="handlebox">
        <span className="downApp">离线缓存</span>
        <span className="read">开始阅读</span>
      </div>
    </div>
  )
}

function ComicChapters({ lastUpdateTime }: { lastUpdateTime?: string }) {

  const history = useHistory();
  const params = useParams<{ id: string }>()
  const [bookChapters, setBookChapters] = useState([] as IBookChapter[]);
  const { status: viewAllStatus, text: viewAllText, onStatusChange: onViewAllChange } = useToggleViewAll();
  const { status: orderStauts, text: orderText, onStatusChange: onOrderChange } = useToggleOrder();
  const { readChapterId, onReadChapterIdChange } = useRecordChapterId(params.id);


  function changeBookChaptersOrder() {
    bookChapters.reverse();
  }

  const fetchBookChaptersData = useCallback(async () => {
    const response = await getBookchapters(params.id)
    return response.data.data as IBookChapter[];
  }, [params.id])

  useEffect(() => {
    fetchBookChaptersData().then(data => {
      setBookChapters(data);
    })
  }, [fetchBookChaptersData]);

  function toChapter(chapter: IBookChapter) {
    onReadChapterIdChange(chapter)
    history.push(`/chapter/${params.id}/${chapter.id}`);
  }


  return (
    <div className="mk-chapterlist-box">
      <div className="hd">
        <span>最后更新:</span>
        <time id="updateTime" className="time">{lastUpdateTime}</time>
        <span className={`order-switch ift-${orderStauts ? 'up' : 'down'}`} onClick={() => { onOrderChange(); changeBookChaptersOrder(); }}>{orderText}</span>
      </div>
      <div className="bd">
        <ul className="chapterlist" style={{ height: viewAllStatus ? "auto" : "" }}>
          {
            bookChapters.map(chapters =>
              <li className="item" key={chapters.id}>
                <i className={`readChapter ${chapters.id === readChapterId ? "ift-read" : ""}`}></i>
                <div className="chapterBtn" onClick={() => toChapter(chapters)} >
                  <span className="ellipsis">{chapters.txt}</span>
                </div>
              </li>
            )
          }
        </ul>
      </div>
      <div className="ft">
        <span className="more" id="chapterSwitch" onClick={onViewAllChange}>{viewAllText}</span>
      </div>
    </div>
  )
}



function ComicIntroduce({ authorDetail }: { authorDetail: IAuthorDetail }) {

  return (
    <>
      <div className="comic-detail">
        <div className="hd">
          <h2 className="title">剧情简介</h2>
        </div>
        <p className="content">{authorDetail.summary}</p>
        <div className="hd">
          <h2 className="title">作者信息</h2>
        </div>
        <div className="content">
          <div className="author-info">
            <img className="author-avatar" src={spaceGif} alt="" />
            <div className="author-main">
              <div className="author-name">
                <span className="name">{authorDetail.authorName}</span>
                <i className={authorDetail.authorLevel}>
                </i>
              </div>
              <p className="author-fans">粉丝<span className="fans-num">{authorDetail.authorFans}</span>人</p>
            </div>
          </div>
        </div>
        <div className="hd">
          <h2 className="title">作者公告</h2>
        </div>
        <div className="content">{authorDetail.authorAnnouncement}</div>
      </div>
      <AuthorProduction collections={authorDetail.authorProductioin} />
    </>
  )
}


function AuthorProduction({ collections }: { collections: IComicItem[] }) {
  return (
    <div className="autor-production">
      <div className="hd">
        <i className="ift-works">
        </i>
        <h2 className="title">作者作品</h2>
      </div>
      <div className="mk-floor">
        <div className="comic-item-wrap">
          {collections.map((item, index) => <ComicItem key={index} {...item} />)}
        </div>
      </div>
    </div>
  )
}

/** 
 * 查看全部/收起 方法的hook
 * @param {Object} initial 
 */
function useToggleViewAll(initial = { status: false, foldText: "查看全部", unfoldText: "收起" }) {
  const [status, setStatus] = useState(initial.status);
  const [text, setText] = useState(initial.status ? initial.unfoldText : initial.foldText);

  function onStatusChange() {
    setStatus(!status);
  }

  useEffect(() => {
    setText(status ? initial.unfoldText : initial.foldText);
  }, [initial.foldText, initial.unfoldText, status])

  return {
    status,
    text,
    onStatusChange
  }

}

/**
 * 升序降序 hook
 * @param initial 升序降序
 */
function useToggleOrder(initial = { asc: false, ascText: "升序", descText: "降序" }) {
  const [status, setStatus] = useState(initial.asc);
  const [text, setText] = useState(initial.asc ? initial.ascText : initial.descText);

  function onStatusChange() {
    setStatus(!status);
  }

  useEffect(() => {
    setText(status ? initial.ascText : initial.descText)
  }, [initial.ascText, initial.descText, status])
  return {
    status,
    text,
    onStatusChange
  }
}

export function useRecordChapterId(bookId: string) {
  const defaultId = window.localStorage.getItem(`/book/${bookId}`) || "";

  const [readChapterId, setReadChapterId] = useState(defaultId);

  function onReadChapterIdChange(chapter: IBookChapter) {
    window.localStorage.setItem(`/book/${bookId}`, chapter.id);
    setReadChapterId(chapter.id);
  }

  return {
    readChapterId,
    onReadChapterIdChange
  }
}

export default Book