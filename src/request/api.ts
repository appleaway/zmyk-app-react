import instance from "./index";

/**
 * 首页轮播图数据
 */
export function getSwiper() {
  return instance({
    url: "/swiper"
  });
}

/**
 * 首页楼层数据
 */
export function getComicFloor() {
  return instance({
    url: "/floor"
  });
}

/**
 * 排行榜数据（人气，打赏，月票）
 */
export function getRanklist() {
  return instance({
    url: "/ranklist"
  });
}

/**
 * 排行榜数据（人气，打赏，月票）
 * @param {string} id 漫画id
 */
export function getBookDetail(id: string) {
  return instance({
    url: "/bookdetail",
    params: {
      id
    }
  });
}

/**
 * 漫画的章节数据
 * @param {string} id 漫画id
 */
export function getBookchapters(id: string) {
  return instance({
    url: "/bookchapters",
    params: {
      id
    }
  });
}

/**
 * 当前漫画的相关推荐
 * @param {string} bookId 漫画id
 */
export function getBookCorrelation(bookId: string) {
  return instance({
    url: "/correlation",
    params: {
      bookId
    }
  });
}

/**
 * 当前漫画章节的图片
 * @param {string} bookId 漫画id
 * @param {string} chapterId 章节id
 */
export function getChapterPic({
  bookId,
  chapterId
}: {
  bookId: string;
  chapterId: string;
}) {
  return instance({
    url: "/chapterPic",
    params: {
      bookId,
      chapterId
    }
  });
}

/**
 * 获取类别
 */
export function getCategory() {
  return instance({
    url: "/category"
  });
}

/**
 * 获取更多推荐
 * @param typeId 推荐类型id
 */
export function getMoreRecommend(typeId: string) {
  return instance({
    url: "/recommend",
    params: {
      typeId
    }
  });
}
