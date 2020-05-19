import React from 'react';
import "./dots.css";

export default function Dots(props: React.ReactElement[]) {
  
  return (
    <>
      <div className="swiper-pagination swiper-pagination-bullets">
        {
          props.map((node, index) => {
            const isActive = node.props.className.includes("slick-active");
            return (
              <span key={index} className={isActive ? "swiper-pagination-bullet-active swiper-pagination-bullet" : "swiper-pagination-bullet"}></span>
            )
          })
        }
      </div>
    </>
  )
}