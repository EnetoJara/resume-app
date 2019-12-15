/* import body from "body-parser";
import compression from "compression";
import express, { Application, Request, Response } from "express";
import expressStatic from "express-static-gzip";
import expressWinston from "express-winston";
import helmet from "helmet";
import path from "path";
import winston from "winston";
import { DB } from "./models/index";
import { routes } from "./routes/index";
import {
    clientErrorHandler,
    errorHandler,
    logging,
} from "./utils/error-handler";
import { logger } from "./utils/logger";

export function serverConfig (db: DB): Application {
    logger.info(`serverConfig: ${db}`);
    const app: Application = express();
    app.use(helmet());
    app.use(compression());
    app.use(body.json());
    app.use(body.urlencoded({ extended: true }));
    app.use(
        expressStatic(path.join(__dirname, "./build"), { enableBrotli: true })
    );
    app.use("/api", routes(db));
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

    return app;
}
*/
