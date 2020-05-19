import React, { Suspense, lazy } from 'react'
import { RouteProps } from "../../components/RouterView/RouterView"
import { Prompt, useLocation } from 'react-router-dom';
const ComicSwiper = lazy(() => import('../../components/ComicSwiper/ComicSwiper'))
const ComicFloor = lazy(() => import('../../components/ComicFloor/ComicFloor'));
const FooterNav = lazy(() => import("../../components/FooterNav/FooterNav"));
const ComicRank = lazy(() => import("../../components/ComicRank/ComicRank"));


function Home(props: RouteProps) {

  console.log("Home props", props);

  const currentLocation = useLocation();


  return (
    <Suspense fallback="Loading..." >
      <ComicSwiper />
      <ComicFloor />
      <ComicRank />
      {/* 把FooterNav放到最底部，自带一个空的blank撑起定位后的内容高度 */}
      <FooterNav />
      <Prompt message={location => location.pathname !== currentLocation.pathname} />
    </Suspense>
  )
}

export default Home