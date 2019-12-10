import http, { Server } from "http";
import { serverConfig } from "./express";
import { db } from "./models";
import { logger } from "./utils/logger";

db.sequelize
    .sync()
    .then(() => logger.info("sinced"))
    .catch(error => logger.error(error));
export const server: Server = http.createServer(serverConfig(db));

server.listen(Number(5000), () => {
    console.log("runnin");
});
