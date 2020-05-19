import React, { useEffect, useState } from 'react'
import CustomDots from "./dots/dots";
import Slider, { Settings } from "react-slick";
import { getSwiper } from "../../request/api"
import "./ComicSwiper.css";


function Swiper(props: Settings) {

  const [swiperData, setSwiperData] = useState([])

  useEffect(() => {
    getSwiper().then(response => {
      const data = response.data.data;
      setSwiperData(data);
    });
  }, []);

  const setting = Object.assign({
    dots: true,
    autoplay: true,
    infinite: true,
    autoplaySpeed: 2000,
    appendDots: CustomDots
  }, props)

  return (
    <Slider {...setting}>
      {swiperData.map((item: any) =>
        (
          <div key={item.id}>
            <img className="slide-img" src={item.src} alt={item.title} />
            <span className="slide-desc">{item.title}</span>
          </div>
        )
      )}
    </Slider >
  )
}

export default Swiper;