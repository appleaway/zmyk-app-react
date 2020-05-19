import React, { useEffect, useState } from 'react'
import RankItem, { IRankItem } from "./RankItem/RankItem";
import { Tabs } from "antd-mobile";
import { getRanklist } from "../../request/api"

interface IRankTabs {
  tabTitle: string;
  iconClass: string
}

interface IComicRank extends IRankTabs {
  list: IRankItem[]
}

export default function ComicRank() {

  const defaultTabs = [
    { title: <i className="ift-fire">人气榜</i> },
    { title: <i className="ift-love_money">打赏榜</i> },
    { title: <i className="ift-ticket">月票榜</i> },
  ];

  const [rankTabs, setRankTabs] = useState(defaultTabs);

  const [rankListElement, setRankListElement] = useState([] as JSX.Element[])

  useEffect(() => {
    getRanklist().then(response => {
      const data = response.data.data as IComicRank[];
      const tabs = data.map(list => ({ title: <i className={list.iconClass} >{list.tabTitle}</i> }));
      const ranklist = data.map((ulList, index) => (<ul className="mk-rank-list" key={index}>{ulList.list.map((item, idx) => <RankItem {...item} key={idx} />)}</ul>));
      setRankTabs(tabs);
      setRankListElement(ranklist);
    })
  }, [])


  const setting = {
    tabBarInactiveTextColor: "#999",
    tabBarActiveTextColor: "#fc6454",
    tabBarUnderlineStyle: { borderColor: "#fc6454" }
  }


  return (
    <div className="comic-rank">
      <Tabs tabs={rankTabs} {...setting}>
        {rankListElement}
      </Tabs>
    </div>
  )
}