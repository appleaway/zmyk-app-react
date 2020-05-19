const express = require("express");
// 引入所需要的第三方包
const WLANIP = require("address").ip();
const app = express();

const HomeRouter = require("./home");
const BookRouter = require("./book");
const RecommendRouter = require("./recommend");

app.use("/", HomeRouter);
app.use("/", BookRouter);
app.use("/", RecommendRouter);

// ...
const server = app.listen(8888, function() {
  let port = server.address().port;
  console.log("Your App is running at http://%s:%s", WLANIP, port);
});

app.get("/", function(req, res) {
  res.send("Hello World!");
});
