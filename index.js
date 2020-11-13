require("dotenv").config();
const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const phoneBookRouter = require("./controllers/phoneBook");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

//connecting to the database
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info(`connected to the database`);
  })
  .catch((error) => {
    logger.error(`errot connecting to database`, error.message);
  });

//  Description:: middleware sequence
app.use(cors());
app.use(express.static("build"));
app.use(express.json());

app.use(
  middleware.morganLogger(
    ":method :url status-:status (:res[content-length]-:response-time ms)\n:post\n:user-agent"
  )
);

// Description:: Normal routes
app.use("/api", phoneBookRouter);

// Description:: CATCH ALL UNKNOWNENDPOINTS (MiddleWare)
app.use(middleware.unknownEndPoint);

// Description:: ERROR HANDLING (MiddleWare)
app.use(middleware.errorHandler);

// Description:: initiating server
app.listen(config.PORT, () => {
  logger.info(`server is running on Port:${config.PORT}`);
});
