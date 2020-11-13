const logger = require("./logger");
const morgan = require("morgan");

const morganLogger = morgan.token("post", function (req, res) {
  if (req.body.name) {
    return JSON.stringify(req.body);
  } else {
    return null;
  }
});

const unknownEndPoint = (req, res) => {
  res.send("<h2>Unknown Endpoint<h2>");
};

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    logger.info("----Cast Error----", error);
    return res.status(400).json({ error: "malformed request" });
  } else if (error.name === "ValidationError") {
    logger.info("----validation Error----");
    logger.info("----validation Error----");

    return res.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  morganLogger,
  unknownEndPoint,
  errorHandler,
};
