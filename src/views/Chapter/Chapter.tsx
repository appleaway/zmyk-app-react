import React, { useCallback, useEffect, useState } from 'react';
import { Toast } from "antd-mobile";
import { useHistory, useParams } from "react-router-dom"
import ImageList from "../../components/ImageList/ImageList";
import { getChapterPic, getBookchapters } from "../../request/api";
import { useRecordChapterId } from "../Book/Book"
import "./index.css";

interface IChapterParams { bookId: string; chapterId: string }
interface IBookChapter { id: string; index: number; txt: string; }

export default function Chapter() {

  const params = useParams<IChapterParams>();
  const { bookId, chapterId } = params;
  const [imageList, setImageList] = useState([] as string[]);
  const [chaptersData, setChaptersData] = useState([] as IBookChapter[])
  const { status: showStatus, onStatusChange: onShowHeader } = useToggleShowStatus();


  const fetchChaptersData = useCallback(async () => {
    const response = await getBookchapters(bookId);
    return response.data.data as IBookChapter[];
  }, [bookId]);

  useEffect(() => {
    fetchChaptersData().then(data => {
      setChaptersData(data);
    })
  }, [fetchChaptersData])



  const fetchChapterPicData = useCallback(async () => {
    const response = await getChapterPic({ bookId, chapterId });
    return response.data.data as { picCount: string; picList: string[] };
  }, [bookId, chapterId])

  useEffect(() => {
    setImageList([]); // 先清空，防止页面滚动位置不变
    fetchChapterPicData().then(data => {
      setImageList(data.picList);
    })
  }, [fetchChapterPicData]);

  return (
    <div id="comic-chapter">
      <ChapterHeader status={showStatus} chaptersData={chaptersData} />
      <ImageList onShowHeader={onShowHeader} list={imageList} />
      <ChapterFooter status={showStatus} chaptersData={chaptersData} />
    </div>
  )
}

function ChapterHeader({ status, chaptersData }: { status: boolean; chaptersData: IBookChapter[] }) {

  const history = useHistory();
  const params = useParams<IChapterParams>();


  function onBackToCatalog() {
    history.goBack();
  }

  const title = chaptersData.find(chapter => chapter.id === params.chapterId);

  return (
    <header className={`comic-header top-nav top ${!status ? 'hide' : ""}`} style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
      <div className="left" onClick={onBackToCatalog}>
        <i className="back ift-goback"></i>
      </div>
      <div className="hd-center">
        <h1>{title?.txt}</h1>
      </div>
      <div className="right">
        <div className="right-menu">
          <div className="nav-more">
            <div className="hd">
              <i className="ift-more"></i>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function ChapterFooter({ status, chaptersData }: { status: boolean; chaptersData: IBookChapter[] }) {

  const history = useHistory();
  const params = useParams<IChapterParams>();
  const { onReadChapterIdChange } = useRecordChapterId(params.bookId);

  function onPrevChapterClick() {
    const currentChapter = chaptersData.find(chapter => chapter.id === params.chapterId);
    if (!currentChapter) return;
    if (currentChapter.index === 0) return Toast.info("已经是第一章了！");
    const prevChapter = chaptersData.find(chapter => chapter.index === currentChapter.index - 1)!;
    onReadChapterIdChange(prevChapter);
    history.replace(`/chapter/${params.bookId}/${prevChapter.id}`);
  }

  function onBackToCatalog() {
    history.goBack();
  }

  function onNextChapterClick() {
    const currentChapter = chaptersData.find(chapter => chapter.id === params.chapterId);
    if (!currentChapter) return;
    if (currentChapter.index === chaptersData.length - 1) return Toast.info("已经是最新一章了！");
    const nextChapter = chaptersData.find(chapter => chapter.index === currentChapter.index + 1)!;
    onReadChapterIdChange(nextChapter);
    history.replace(`/chapter/${params.bookId}/${nextChapter.id}`);
  }

  return (
    <ul className={`tools bot ${!status ? 'hide' : ""}`}>
      <li className="item" onClick={onPrevChapterClick}>
        <div className="hd">
          <i className="ift-prev"></i>
          <span className="text">上章</span>
        </div>
      </li>
      <li className="item" onClick={onBackToCatalog}>
        <div className="hd">
          <i className="ift-chapter"></i>
          <span className="text">返回目录</span>
        </div>
      </li>
      <li className="item" onClick={onNextChapterClick}>
        <div className="hd">
          <i className="ift-next"></i>
          <span title="下章" className="text">下章</span>
        </div>
      </li>
    </ul>
  )
}

function useToggleShowStatus() {
  const [status, setStuatus] = useState(false);

  function onStatusChange() {
    setStuatus(!status);
  }

  return {
    status,
    onStatusChange
  }
}