require("dotenv").config();

exports.serverPort = 3000;
exports.sessionSecret = "12345";
exports.rate = {
  windowMs: 5 * 60 * 1000,
  max: 100,
};

exports.proxies = {
  "/tools": {
    protected: false,
    target: "http://127.0.0.1:1903/",
    changeOrigin: true,
    pathRewrite: {
      [`^/tools`]: "",
    },
  },
  "/": {
    protected: true,
    target: "http://127.0.0.1:8000/",
    changeOrigin: true,
    pathRewrite: {
      [`^/`]: "",
    },
  },
};
