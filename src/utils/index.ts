/**
 * 把十进制整数转换成对应中文单位的
 * @param {number} num 十进制整数
 */
export function hotText(num: number) {
  let numStr = num.toString();
  // 个、十、百、千、万、十万、百万、千万、亿、十亿、百亿、千亿...
  if (numStr.length < 6) {
    // 小于10w
    return numStr;
  } else if (numStr.length < 7) {
    // 大于10w小于100w，保留一位小数，单位万
    return (+numStr.slice(0, -3) / 10).toFixed(1) + "万";
  } else if (numStr.length < 9) {
    // 大于100w小于1亿，不保留小数位，单位万
    return numStr.slice(0, -4) + "万";
  } else if (numStr.length < 11) {
    // 大于1E小于100亿，保留一位小数，单位亿
    return (+numStr.slice(0, -7) / 10).toFixed(1) + "亿";
  } else {
    // 大于100亿，不保留小数位，单位亿
    return numStr.slice(0, -8) + "亿";
  }
}

/**
 * 根据漫画id获取其对应的封面id
 * @param {string | number} comic_id 漫画id
 */
export function getComicIdPath(comic_id: string | number) {
  return `${comic_id}`.padStart(9, "0").replace(/(?=(\B)(\d{3})+$)/g, "/");
}

/**
 * 把单字日期转成双字表示
 * @param text 单字日期
 */
export function formateDateText(text: string) {
  const weekText = ["一", "二", "三", "四", "五", "六", "日"];
  const dayText = ["昨", "今"];
  if (weekText.includes(text)) {
    return `周${text}`
  } else if (dayText.includes(text)) {
    return `${text}天`
  } else {
    return text;
  }
}