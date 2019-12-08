import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf } = format;

export const myFormat = printf(
    info => `[${info.timestamp}] [${info.level}] => ${info.message}`
);

export const logger = createLogger({
    level: "info",
    format: combine(
        label({ label: "order-api errors" }),
        timestamp(),
        myFormat
    ),

    transports: [
        new transports.File({ filename: "aggregated.log" }),
        new transports.Console(),
    ],
});
