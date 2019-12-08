import "@babel/register";
import "@babel/runtime/regenerator";
import "core-js";
import "es6-promise/auto";
import http, { Server } from "http";
import { serverConfig } from "./express";
import { db } from "./models";

export const server: Server = http.createServer(serverConfig(db));

server.listen(Number(process.env.PORT || 3001), () => {
    console.log("runnin");
});
