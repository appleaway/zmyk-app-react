import React, { useCallback, useEffect, useState } from 'react';
import FooterNav from "../../components/FooterNav/FooterNav";
import { TabBarPropsType } from "rmc-tabs"
import { Tabs } from 'antd-mobile';
import "./index.css"
import { getUpdateList } from '../../request/api';
import { formateDateText, getComicIdPath, hotText } from "../../utils";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
const hotPng = require("@/assets/images/hot.png")

interface IUpdateItem {
  author_name: string;
  comic_feature: string;
  comic_id: number;
  hot: number;
  comic_name: string;
  update_time: string;
  last_chapter: { id: string; name: string }
}

interface IUpdateData {
  title: string;
  list: IUpdateItem[]
}

interface IImageProp {
  alt?: string;
  height: number | string;
  src: string;
  width: number | string;
}


function Update() {

  const [tabs, setTabs] = useState([] as { title: string }[])
  const [updateData, setUpdateData] = useState([] as IUpdateData[])

  const fetchUpdateData = useCallback(async (): Promise<IUpdateData[]> => {
    const response = await getUpdateList();
    return response.data.data.update_list.map((item: any) => {
      const title: string = item.comicUpdateDate;
      const list: IUpdateItem[] = item.info;
      return {
        title,
        list
      }
    })
  }, []);

  useEffect(() => {
    fetchUpdateData().then(data => {
      const tabsData = data.map(item => ({ title: formateDateText(item.title) }));
      setTabs(tabsData);
      setUpdateData(data);
    })
  }, [fetchUpdateData]);

  return (
    <>
      <Tabs tabs={tabs} initialPage={6} renderTabBar={(props) => <CustomUpdateTabs {...props} />} prerenderingSiblingsNumber={0}>
        {
          updateData.map((list, index) => (
            <div key={index}>
              <ul className="update-comic-list">
                {
                  list.list?.map(item => {
                    const image = {
                      alt: "",
                      height: "auto",
                      width: "100%",
                      src: `https://image.zymkcdn.com/file/cover/${getComicIdPath(item.comic_id)}_2_1.jpg-720x360.jpg`
                    }
                    return <ListItem key={item.comic_id} image={image} data={item} />
                  })
                }
              </ul>
              <div className="tips-text">
                <p className="nomore">翻完了! 看看前一天的吧~</p>
              </div>
            </div>
          ))
        }
      </Tabs>
      <FooterNav></FooterNav>
    </>
  )
}
const ListItem = ({ image, data }: { image: IImageProp, data: IUpdateItem }) => {
  return (

    <li className="item comic-item">
      <div className="thumbnail">
        <LazyLoadImage
          effect="blur"
          alt={image.alt}
          height={image.height}
          src={image.src}
          width={image.width} />
      </div>
      <div className="hot_message">
        <img className="hot_img" src={hotPng} alt="hot" />
        <span>{hotText(data.hot)}</span>
      </div>
      <p className="title">{data.comic_name}</p>
      <p className="desc">{data.comic_feature}</p>
      <p className="update_page">{data.last_chapter?.name}</p>
    </li>
  )
}


function CustomUpdateTabs({ tabs, activeTab, goToTab }: TabBarPropsType) {
  return (
    <>
      <ul className="date-bar-list">
        {
          tabs.map((item, index) =>
            (
              <li className="date-bar" key={index} onClick={() => goToTab(index)}>
                <span className={`${activeTab === index ? "date-item active" : "date-item"}`}>{item.title}</span>
              </li>
            )
          )
        }
      </ul>
      <div className="date-bar-list-blank" ></div>
    </>
  )
}

export default Update;