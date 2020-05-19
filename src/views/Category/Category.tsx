import React, { useEffect, useCallback, useState } from 'react';
import { Tabs } from "antd-mobile";
import { TabBarPropsType } from "rmc-tabs"
import { getCategory } from "../../request/api";
import FooterNav from "../../components/FooterNav/FooterNav";
import "./index.css";
import { useHistory } from 'react-router-dom';
const spaceGif = require("@/assets/images/space.gif");

interface ICategoryItem {
  id: string;
  img: string;
  name: string;
}

interface ICategory {
  title: string;
  list: ICategoryItem[]
}

export default function Category() {

  const [categoryList, setCategoryList] = useState([] as ICategory[]);
  const [tabsTitle, setTabsTitle] = useState([] as { title: string }[])

  const fetchCategoryData = useCallback(async () => {
    const response = await getCategory();
    return response.data.data as ICategory[];
  }, [])

  useEffect(() => {
    fetchCategoryData().then(data => {
      setCategoryList(data);
      setTabsTitle(data.map(c => ({ title: c.title })))
    })
  }, [fetchCategoryData])

  return (
    <>
      <Tabs tabs={tabsTitle} renderTabBar={(props) => <CategoryHeader {...props} />} >
        {
          categoryList.map((list, index) => <ul className="mk-category-list" key={index}>
            {
              list.list.map((item, idx) => <ContentItem key={idx} {...item} />)
            }
          </ul>)
        }
      </Tabs>
      <FooterNav></FooterNav>
    </>
  )
}

function ContentItem({ id, img, name }: ICategoryItem) {
  return (
    <li className="item">
      <div className="thumbnail">
        <img src={spaceGif} style={{ backgroundImage: `url(${img})` }} alt={name} />
      </div>
      <p className="name">{name}</p>
    </li>
  )
}

function CategoryHeader({ tabs, activeTab, goToTab }: TabBarPropsType) {

  const history = useHistory();

  function goBack() {
    history.goBack()
  }

  return (
    <>
      <header className="hd mk-category-header">
        <div className="left" onClick={goBack}>
          <i className="back ift-goback"></i>
        </div>
        <ul className="tab-toggle">
          {
            tabs.map((tab, index) => <li key={index} className={`${index === activeTab ? "item active" : "item"}`} onClick={() => goToTab(index)}> {tab.title} </li>)
          }
        </ul>
        <div className="right">
          <span title="漫画搜索" className="search ift-search">
          </span>
        </div>
      </header>
      <div className="blank"></div>
    </>
  )
}