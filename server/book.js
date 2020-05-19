// 引入所需要的第三方包
const Page = require("./Page.js");
const Router = require("express").Router();
const cheerio = require("cheerio");

const selectors = {
  thumbnailImage: "div.mk-detail > div.comic-info > div.comic-item > div > img",
  name: "div.mk-detail > div.comic-info > h1",
  author: "div.mk-detail > div.comic-info > span.author",
  tags: "div.mk-detail > div.comic-info > ul > li",
  fire: "div.mk-detail > div.comic-info > span.hasread.ift-fire",
  score: "div.mk-detail > div.comic-info > div.comic-item > div > span",
  lastUpdateTime: "#updateTime",
  chapters: ".chapterlist .chapterBtn",
  pic: "#content .comiclist .comicpage img",
  summary: ".comic-detail p.content",
  authorName: ".comic-detail  .author-main .author-name .name",
  authorLevel: ".comic-detail .author-main .author-name .author-level",
  authorFans: ".comic-detail .author-main .author-fans .fans-num",
  authorAnnouncement: ".comic-detail > div:last-child.content",
  authorProductioin: ".autor-production .comic-item"
};

function getBookDetailData($) {
  let tags = [];
  $(selectors.tags).text((idx, val) => {
    tags.push(val);
  });
  return {
    thumbnailImage: $(selectors.thumbnailImage).attr("data-src"),
    name: $(selectors.name).text(),
    author: $(selectors.author).text(),
    fire: $(selectors.fire).text(),
    score: $(selectors.score).text(),
    lastUpdateTime: $(selectors.lastUpdateTime).text(),
    tags
  };
}

function getBookChapters($) {
  let chapters = [];
  let allChapters = $(selectors.chapters);
  let length = allChapters.length;
  allChapters.each((idx, el) => {
    chapters.push({
      index: length - idx - 1,
      txt: $(el).text(),
      id: $(el)
        .attr("href")
        .replace(".html", "")
    });
  });
  return chapters;
}

function getChaptersPic($) {
  let picList = [];
  let picCount = $(".pages-num .total-page").text();
  let firstPic = $(".comiclist script")
    .html()
    .match(/(?<=").*?(?=")/g)
    .filter(s => /^http(.*)?\.middle$/.test(s))[0];
  for (var i = 1; i <= picCount; i++) {
    picList.push(
      firstPic.replace(/(\d+)(\.jpe?g|png)/, ($0, $1, $2) => i + $2)
    );
  }
  return {
    picCount,
    picList
  };
}

function getCorrelation($) {
  let collections = [];
  $(".mk-recommend")
    .find(".comic-item")
    .each((idx, el) => {
      collections.push({
        thumbImg: $(el)
          .find(".thumbnail>a>img")
          .attr("data-src"),
        id: $(el)
          .find(".thumbnail>a>img")
          .attr("data-id"),
        chapter: $(el)
          .find(".thumbnail>a .chapter")
          .text(),
        score: $(el)
          .find(".thumbnail>a .score")
          .text(),
        title: $(el)
          .find(".title>a")
          .text(),
        desc: $(el)
          .find(".desc")
          .text()
      });
    });
  return collections;
}

function getAuthorDetail($) {
  let authorData = {
    summary: $(selectors.summary).text(),
    authorName: $(selectors.authorName).text(),
    authorFans: $(selectors.authorFans).text(),
    authorLevel: $(selectors.authorLevel).attr("class"),
    authorAnnouncement: $(selectors.authorAnnouncement).text()
  };
  let authorProductioin = [];
  $(selectors.authorProductioin).each((idx, el) => {
    authorProductioin.push({
      thumbImg: $(el)
        .find(".thumbnail>a>img")
        .attr("data-src"),
      id: $(el)
        .find(".thumbnail>a>img")
        .attr("data-id"),
      chapter: $(el)
        .find(".thumbnail>a .chapter")
        .text(),
      score: $(el)
        .find(".thumbnail>a .score")
        .text(),
      title: $(el)
        .find(".title>a")
        .text(),
      desc: $(el)
        .find(".desc")
        .text()
    });
  });
  authorData.authorProductioin = authorProductioin;
  return authorData;
}

Router.get("/bookdetail", (req, res, next) => {
  let id = req.query.id;
  let url = `https://m.zymk.cn/${id}`;
  Page.getHtml(url)
    .then(response => {
      let $ = cheerio.load(response.data);
      let bookDetail = getBookDetailData($);
      let authorDetail = getAuthorDetail($);
      res.send({
        code: 0,
        data: {
          bookDetail,
          authorDetail
        },
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
Router.get("/bookchapters", (req, res, next) => {
  let id = req.query.id;
  let url = `https://m.zymk.cn/${id}`;
  Page.getHtml(url)
    .then(response => {
      let $ = cheerio.load(response.data);
      let data = getBookChapters($);
      res.send({
        code: 0,
        data: data,
        msg: "ok"
      });
    })
    .catch(err => {
      console.log(`页面"${url}"抓取失败`);
      res.send({
        code: 400,
        data: null,
        msg: `页面"${url}"抓取失败`
      });
    });
});

Router.get("/chapterPic", (req, res, next) => {
  let bookId = req.query.bookId;
  let chapterId = req.query.chapterId;
  let url = `https://m.zymk.cn/${bookId}/${chapterId}.html`;
  Page.getHtml(url)
    .then(response => {
      let $ = cheerio.load(response.data);
      let data = getChaptersPic($);
      res.send({
        code: 0,
        data: data,
        msg: "ok"
      });
    })
    .catch(err => {
      console.log(`页面"${url}"抓取失败`);
      res.send({
        code: 400,
        data: null,
        msg: `页面"${url}"抓取失败`
      });
    });
});

Router.get("/correlation", (req, res, next) => {
  let bookId = req.query.bookId;
  let url = `https://m.zymk.cn/${bookId}`;
  Page.getHtml(url)
    .then(response => {
      let $ = cheerio.load(response.data);
      let data = getCorrelation($);
      res.send({
        code: 0,
        data: data,
        msg: "ok"
      });
    })
    .catch(err => {
      console.log(`页面"${url}"抓取失败`);
      res.send({
        code: 400,
        data: null,
        msg: `页面"${url}"抓取失败`
      });
    });
});

module.exports = Router;
