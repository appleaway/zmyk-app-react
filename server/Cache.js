const maxSize = 10 * 1024 * 1024; // 缓存存储10MB的页面数据
const expirationTime = 3 * 60 * 1000; // 3分钟内不重复请求

class Cache {
  constructor() {
    this.cache = [];
  }
  /** 添加缓存 */
  append(id, data) {
    let existData = this.cache.find(i => i.id === id);
    // 如果不存在则需要添加
    if (!existData) {
      // 判断缓存空间是否充足
      console.log("已存储容量：", this.totalSize(), "数据大小：", data.length);
      if (this.totalSize() + data.length > maxSize) {
        // 空间不够则需要移除某一个
        this.sortByViews();
        let index = this.cache.findIndex(i => i.length >= data.length);
        if (index === -1) return; // 没找到足够大小的不缓存了
        console.log("index", index);
        this.cache[index] = {
          id,
          data,
          views: 1,
          expires: Date.now() + expirationTime
        };
      } else {
        // 直接添加
        this.cache.push({
          id,
          data,
          views: 1,
          expires: Date.now() + expirationTime
        });
      }
    } else if (this.isExpires(existData)) {
      console.log(`页面"${existData.id}"数据已过期, 需要重新替换!`);
      // 替换旧的
      let index = this.cache.findIndex(i => i.id === existData.id);
      this.cache[index] = {
        id,
        data,
        views: existData.views + 1,
        expires: Date.now() + expirationTime
      };
    }
  }
  /** 判断缓存是否过期, false表示未过期, true表示已过期 */
  isExpires(data) {
    return data.expires < Date.now();
  }
  /** 根据唯一标识找到缓存数据, 并判断过期时间 */
  findById(id) {
    let cacheData = this.cache.find(i => i.id === id);
    if (cacheData && !this.isExpires(cacheData)) {
      // 存在则拿缓存, 然后浏览数+1
      cacheData.views += 1;
      return cacheData;
    }
  }
  /** 按浏览次数最少的排 */
  sortByViews() {
    return this.cache.sort((a, b) => a.views - b.views);
  }
  /** 按占用空间最大的排 */
  sortBySize() {
    return this.cache.sort((a, b) => b.length - a.length);
  }
  /** 当前缓存总大小 */
  totalSize() {
    return this.cache.reduce((total, curr) => (total += curr.data.length), 0);
  }
}

// export default new Cache();
module.exports = new Cache();
