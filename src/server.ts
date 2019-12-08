import "@babel/register";
import "@babel/runtime/regenerator";
import "core-js";
import "es6-promise/auto";
import http from "http";
import { serverConfig } from "./express";
import { db } from "./models";

let server;
db.sequelize.authenticate().then(()=> {
    server = http.createServer(serverConfig(db));

    server.listen(Number(process.env.PORT), ()=> {
        console.log("runnin")
    })
})

export default server;
