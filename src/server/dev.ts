import body from "body-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import expressStatic from "express-static-gzip";
import expressWinston from "express-winston";
import http from "http";
import path from "path";
import winston from "winston";
import { db } from "./models/index";
import { routes } from "./routes/index";
import {
    clientErrorHandler,
    errorHandler,
    logging,
} from "./utils/error-handler";
import { logger } from "./utils/logger";

const app: Application = express();
app.use(cors());
app.use(body.json());
app.use(body.urlencoded({ extended: true }));
app.use(expressStatic(path.join(__dirname, "./build"), { enableBrotli: true }));
app.use(routes(db));
app.all("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "./build/index.html"));
});

app.use(
    expressWinston.errorLogger({
        transports: [new winston.transports.Console()],
    })
);
app.use(logging);
app.use(clientErrorHandler);
app.use(errorHandler);
const server = http.createServer(app);

server.listen(Number(process.env.SERVER_PORT), () =>
    logger.info("server runnning stuff")
);
