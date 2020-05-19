import React, { useState, useEffect } from 'react'
import FloorTitle, { IFloorTitle } from "./FloorTitle/FloorTitle";
import { getComicFloor } from "../../request/api";
import ComicItem, { IComicItem } from '../ComicItem/ComicItem';

interface IComicFloor {
  collections: IComicItem[],
  title: IFloorTitle
}

export default function ComicFloor() {

  const [floorData, setFloorData] = useState([] as IComicFloor[])

  useEffect(() => {
    getComicFloor().then(response => {
      const data = response.data.data as IComicFloor[];
      setFloorData(data);
    })
  }, [])

  return (
    <>
      {
        floorData.map((floor, index) => {
          const { title, collections } = floor;
          return (
            <div className="mk-floor" key={index}>
              <FloorTitle {...title} />
              <div className="comic-item-wrap">
                {collections.map((item, index) => <ComicItem key={index} {...item} />)}
              </div>
            </div>
          )
        })
      }
    </>
  )
}