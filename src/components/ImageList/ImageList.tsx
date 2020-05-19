import React from 'react';
import "./ImageList.css";
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface IImageProp {
  alt?: string;
  height: number | string;
  src: string;
  width: number | string;
}

const MyImage = ({ image }: { image: IImageProp }) => (
  <div>
    <LazyLoadImage
      alt={image.alt}
      height={image.height}
      src={image.src} // use normal <img> attributes as props
      width={image.width} />
  </div>
);


export default function ImageList({ list, onShowHeader }: { list: string[]; onShowHeader: () => void }) {

  return (
    <ul className="image-list" onClick={onShowHeader}>
      {
        list.map((item, index) => {
          const imageElement = {
            alt: "",
            height: "auto",
            width: "100%",
            src: item
          }
          return (
            <li className="image-box" key={index}>
              <MyImage image={imageElement} />
            </li>
          )
        })
      }
    </ul>
  )
}