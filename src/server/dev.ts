import body from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import expressStatic from "express-static-gzip";
import expressWinston from "express-winston";
import http from "http";
import path from "path";
import winston from "winston";
import { db } from "./models/index";
import { routes } from "./routes/index";
import { logger } from "./utils/logger";

db.sequelize
    .authenticate()
    .then(() => logger.info("sinced"))
    .catch(error => logger.error(error));
const app: Application = express();
app.use(cors());
app.use(body.json());
app.use(body.urlencoded({ extended: true }));
app.use(expressStatic(path.join(__dirname, "./build"), { enableBrotli: true }));
app.use("", routes(db));

app.use(
    expressWinston.errorLogger({
        transports: [new winston.transports.Console()],
    })
);
const server = http.createServer(app);

server.listen(Number(process.env.SERVER_PORT), () =>
    logger.info("server runnning stuff")
);
