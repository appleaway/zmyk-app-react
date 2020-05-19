// 引入所需要的第三方包
const Page = require("./Page.js");
const Router = require("express").Router();
const cheerio = require("cheerio");

const selectors = {
  posterImage: ".book-figure .figure",
  bookTitle: ".book-figure .title",
  bookDesc: ".book-desc .content",
  comicItem: ".mk-book-list li.item"
};

function getRecommendData($) {
  let recommendData = {
    posterImage: $(selectors.posterImage).attr("data-src"),
    title: $(selectors.bookTitle).text(),
    desc: $(selectors.bookDesc).text()
  };
  let comicItem = [];
  $(selectors.comicItem).each((idx, item) => {
    let tags = [];
    $(item)
      .find(".tags-box .tags-txt")
      .text((idx, val) => {
        tags.push(val);
      });
    comicItem.push({
      thumbImg: $(item)
        .find(".thumbnail img")
        .attr("data-src"),
      id: $(item)
        .find(".thumbnail>a>img")
        .attr("data-id"),
      score: $(item)
        .find(".thumbnail>a .score")
        .text(),
      title: $(item)
        .find(".info .title")
        .text(),
      desc: $(item)
        .find(".info .reason .content")
        .text(),
      tags
    });
  });
  recommendData.comicList = comicItem;
  return recommendData;
}

Router.get("/recommend", (req, res, next) => {
  let typeId = req.query.typeId;
  let url = `https://m.zymk.cn/book/${typeId}.html`;
  Page.getHtml(url)
    .then(response => {
      let $ = cheerio.load(response.data);
      let data = getRecommendData($);
      res.send({
        code: 0,
        data,
        msg: "ok"
      });
    })
    .catch(err => {
      console.log(`页面"${url}"抓取失败`);
      console.log(err);
      res.send({
        code: 400,
        data: null,
        msg: `页面"${url}"抓取失败`
      });
    });
});

module.exports = Router;
