const superagent = require("superagent");
const Cache = require("./Cache");

class Page {
  constructor() {
    this.request = {};
  }

  getHtml(url) {
    if (this.request[url]) {
      console.log(`并发请求"${url}"，进行合并`);
      return this.request[url];
    }
    let cacheData = Cache.findById(url);
    if (cacheData) {
      // use cache
      console.log(`"${url}": 使用缓存数据`, "请求次数为:", cacheData.views);
      return new Promise((resolve, reject) => {
        let data = cacheData.data.toString();
        resolve({
          data: data,
          msg: "ok use cache",
          success: true
        });
      });
    } else {
      return this.requestHtml(url);
    }
  }

  requestHtml(url) {
    console.log(`请求页面数据: "${url}"`);
    return (this.request[url] = superagent
      .get(url)
      .then(res => {
        let data = Buffer.from(res.text);
        Cache.append(url, data);
        // 这里可以使用定时器设置延迟置空，让更多相同的请求在某一个时间内返回相同的数据
        this.request[url] = null;
        return Promise.resolve({
          data: res.text,
          msg: "ok",
          success: true
        });
      })
      .catch(err => {
        console.log("页面数据请求发生错误", err);
        // 这里可以使用定时器设置延迟置空，让更多相同的请求在某一个时间内返回相同的数据
        this.request[url] = null;
        // err.message, err.response
        return Promise.reject({
          data: err.response,
          msg: err.message,
          success: false
        });
      }));
  }
}

module.exports = new Page();
