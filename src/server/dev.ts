import http from "http";
import { expressApp } from "./express";

const DEFAULT_PORT = process.env.SERVER_PORT || 3000;
const server = http.createServer(expressApp());

server.listen(DEFAULT_PORT, () => console.log("running"));
