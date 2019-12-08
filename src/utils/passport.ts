import fs from "fs";
import { sign, verify } from "jsonwebtoken";
import path from "path";

const privateKey = fs.readFileSync(
    path.join(__dirname, "../private.key"),
    "utf8"
);
const publicKEY = fs.readFileSync(
    path.join(__dirname, "../public.key"),
    "utf8"
);

export function createToken (userData: any) {
    return sign(userData, privateKey, { algorithm: "HS512", expiresIn: "1d" });
}

export function validateToken (token: string) {
    return verify(token, publicKEY, { algorithms: ["HS512"] });
}
