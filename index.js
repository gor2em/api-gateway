// import all the required packages
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const expressWinston = require("express-winston");
const helmet = require("helmet");
const { createProxyMiddleware } = require("http-proxy-middleware");
const responseTime = require("response-time");
const winston = require("winston");
const config = require("./config");

// functionality moved to config.js
// require("dotenv").config();

// configure the application
const app = express();
const port = config.serverPort;
// const secret = config.sessionSecret;
// const store = new session.MemoryStore();
const JWT = require("jsonwebtoken")

// functionality moved to config.js
// const secret = process.env.SESSION_SECRET;
// const port = 3000;

const alwaysAllow = (_1, _2, next) => {
  next();
};


const protect = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1] || null;
  if (token === null) res.sendStatus(401);

  JWT.verify(token, "AS81JZ139SJNQR910", (err, user) => {

    console.log(err)

    if (err) {
      return res.sendStatus(403);
    }

    console.log("user" ,user)

    res.user = user;
    next();
  });

};

app.disable("x-powered-by");

app.use(helmet());

app.use(responseTime());

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.json(),
    statusLevels: true,
    meta: false,
    level: "debug",
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
    expressFormat: true,
    ignoreRoute() {
      return false;
    },
  })
);

app.use(cors());

app.use(rateLimit(config.rate));


Object.keys(config.proxies).forEach((path) => {
  const { protected, ...options } = config.proxies[path];
  const check = protected ? protect : alwaysAllow;
  app.use(path, check, createProxyMiddleware(options));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
