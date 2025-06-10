import Express from "express";
import cookieParser from "cookie-parser";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as os from "os";
import l from "./logger";
import * as OpenApiValidator from "express-openapi-validator";
import errorHandler from "../api/middlewares/error.handler";
const mongoose = require("mongoose");
const cors = require("cors");




const app = new Express();
export default class ExpressServer {
  constructor() {
    const options = {
      keepAlive: 1,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      // useCreateIndex: true,
    };

    const root = path.normalize(`${__dirname}/../..`);

    const apiSpec = path.join(__dirname, "api.yml");
    const validateResponses = !!(
      process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION &&
      process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION.toLowerCase() === "true"
    );

    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || "100kb" }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || "100kb",
      })
    );
    app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || "100kb" }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(Express.static(`${root}/public`));

    app.use(cors());
    app.use(process.env.OPENAPI_SPEC || "/spec", Express.static(apiSpec));
    app.use(
      OpenApiValidator.middleware({
        apiSpec,
        validateResponses,
        ignorePaths: /.*\/spec(\/|$)/,
      })
    );

    // mongodb connection configuration
    let dbConnection;
    switch (process.env.NODE_ENV) {
      case "production":
        dbConnection = process.env.MONGODB_URL_PROD;
        break;
      case "development":
        dbConnection = process.env.MONGODB_URL_DEV;
        break;
      case "stage":
        dbConnection = process.env.MONGODB_URL_STAGE;
        break;
    }
    mongoose.connect(dbConnection, options);
    mongoose.connection.on("connected", function () {
      console.log(`${process.env.NODE_ENV} DB connected`);
    });
  }

  router(routes) {
    routes(app);
    app.use(errorHandler);
    return this;
  }

  listen(port = process.env.PORT) {
    const welcome = (p) => () =>
      l.info(
        `up and running in ${
          process.env.NODE_ENV || "development"
        } @: ${os.hostname()} on port: ${p}}`
      );

    http.createServer(app).listen(port, welcome(port));

    return app;
  }
}
