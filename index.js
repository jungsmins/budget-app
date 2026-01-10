const http = require("http");

const server = http.createServer((req, res) => {
  res.statusCode = 200;
});
