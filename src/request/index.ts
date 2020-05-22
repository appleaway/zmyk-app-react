import axios from "axios";
// axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "" : "/api"
});

instance.interceptors.request.use(
  function onFulfilled(config) {
    if (process.env.NODE_ENV === "development") {
      console.groupCollapsed(`请求: ${config.url}`);
      console.log(config);
      console.groupEnd();
    }
    return config;
  },
  function onRejected(error) {
    //
  }
);

instance.interceptors.response.use(
  function onFulfilled(response) {
    if (process.env.NODE_ENV === "development") {
      console.groupCollapsed(`响应: ${response.config.url}`);
      console.log(response);
      console.groupEnd();
    }
    return response;
  },
  function onRejected(error) {
    //
  }
);

export default instance;
