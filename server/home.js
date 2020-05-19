// 引入所需要的第三方包
const axios = require("axios");
const Page = require("./Page.js");
const Router = require("express").Router();
const cheerio = require("cheerio");

let swiperData = [];
let floorData = [];
let ranklistData = [];
let categoryData = [];

interval(); //

function interval() {
  Page.getHtml("https://m.zymk.cn/")
    .then(data => {
      let $ = cheerio.load(data.data);
      swiperData = getSwiperData($);
      floorData = getMKFloorData($);
      ranklistData = getRankListData($);
      categoryData = getMKCategoryData($);
    })
    .catch(err => {
      console.log(`抓取页面"${"https://m.zymk.cn/"}"失败 - ${err}`);
    });
  setTimeout(() => {
    interval();
  }, 60 * 1000);
}

function getSwiperData($) {
  let imgs = [];
  $(".swiper-wrapper>a").each((idx, el) => {
    imgs.push({
      id: el.attribs.href.replace(/\//g, ""),
      title: el.attribs.title,
      src: el.attribs["data-src"]
    });
  });
  return imgs;
}

function getMKFloorData($) {
  let floor = [];
  $(".mk-floor").each((idx, el) => {
    let collections = [];
    // 找封面图信息
    $(el)
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
    let more = $(el)
      .find("a.more")
      .attr("href");
    floor.push({
      title: {
        id: more ? more.match(/\d+/)[0] : "",
        iconClass: $(el)
          .find(".hd .main")
          .find("i.icon")
          .attr("class"),
        title: $(el)
          .find(".hd .main")
          .find("h2.title")
          .text(),
        summary: $(el)
          .find(".hd .main")
          .find("p.summary")
          .text()
      },
      collections: collections
    });
  });
  return floor;
}

function getRankListData($) {
  let ranklistData = [];
  $(".mk-rank-list").each((idx, el) => {
    let list = [];
    $(el)
      .find("li.item")
      .each((idx, item) => {
        let tags = [];
        $(item)
          .find(".tags-box .tags-txt")
          .text((idx, content) => {
            tags.push(content);
          });
        list.push({
          id: $(item)
            .find(".thumbnail>a>img")
            .attr("data-id"),
          title: $(item)
            .find("h3.title a")
            .text(),
          thumbImg: $(item)
            .find(".thumbnail>a>img")
            .attr("data-src"),
          tags: tags,
          count: $(item)
            .find(".count")
            .text(),
          num: $(item)
            .find(".num")
            .text()
        });
      });
    if (idx === 0) {
      ranklistData.push({
        tabTitle: "人气榜",
        iconClass: "ift-fire",
        list
      });
    } else if (idx === 1) {
      ranklistData.push({
        tabTitle: "打赏榜",
        iconClass: "ift-love_money",
        list
      });
    } else if (idx === 2) {
      ranklistData.push({
        tabTitle: "月票榜",
        iconClass: "ift-ticket",
        list
      });
    }
  });
  return ranklistData;
}

function getMKCategoryData($) {
  let category = [];
  $(".mk-classify .tab-toggle .item").each((idx, el) => {
    category.push({
      title: $(el).text()
    });
  });
  $(".mk-classify .mk-class-list").each((idx, el) => {
    let list = [];
    $(el)
      .find(".item a")
      .each((idx, item) => {
        list.push({
          id: $(item)
            .attr("href")
            .match(/\d+/)[0],
          img: $(item)
            .find("img")
            .attr("data-src"),
          name: $(item)
            .find(".name")
            .text()
        });
      });
    category[idx].list = list;
  });
  return category;
}

Router.get("/swiper", (req, res, next) => {
  res.send({
    code: 0,
    data: swiperData,
    msg: ""
  });
});

Router.get("/floor", (req, res, next) => {
  res.send({
    code: 0,
    data: floorData,
    msg: ""
  });
});

Router.get("/ranklist", (req, res, next) => {
  res.send({
    code: 0,
    data: ranklistData,
    msg: ""
  });
});

Router.get("/category", (req, res, next) => {
  res.send({
    code: 0,
    data: categoryData,
    msg: ""
  });
});

let lastSuccessUpdateTime = 0;
let updateTime = 5 * 60 * 1000;
let updateRequest = null;
Router.get("/getupdatecomic_list", async (req, res, next) => {
  if (updateRequest !== null) {
    handlerReponse();
  } else {
    updateRequest = axios.get("https://m.zymk.cn/api/getupdatecomic_list/");
    handlerReponse();
  }

  function handlerReponse() {
    updateRequest.then(successCallBack).catch(errorCallBack);
  }

  function successCallBack(resp) {
    requestExpiresHandler();
    res.send({
      code: 0,
      data: resp.data.data,
      msg: ""
    });
  }

  function errorCallBack(err) {
    updateRequest = null;
    res.send({
      code: 400,
      data: null,
      msg: err.toString()
    });
  }

  function requestExpiresHandler() {
    if (lastSuccessUpdateTime <= Date.now()) {
      lastSuccessUpdateTime = Date.now() + updateTime;
      updateRequest = null;
    }
  }
});

module.exports = Router;
