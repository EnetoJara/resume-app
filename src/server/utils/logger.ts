import winston from "winston";

const { colorize, combine, timestamp, label, printf, json } = winston.format;

const custom = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        verbose: 3,
        debug: 4,
        http: 5,
    },
    colors: {
        error: "red",
        warn: "orange",
        info: "white bold yellow",
        verbose: "blue",
        debug: "green",
        http: "pink",
    },
};
winston.addColors(custom.colors);
export const myFormat = printf(info => {
    return `[${info.timestamp}] [${info.level}] [38;5;13m[1m=>[22m[39m ${info.message} ${info.meta}`;
});

export const logger = winston.createLogger({
    levels: custom.levels,
    format: combine(
        label({ label: "order-api errors" }),
        timestamp(),
        colorize({ colors: custom.colors }),
        json(),
        myFormat
    ),

    transports: [
        new winston.transports.File({ filename: "info.log", level: "info" }),
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.Http({ host: "localhost", port: 3000 }),
        new winston.transports.Console(),
    ],
});

logger.info("Will not be logged in either transport!");
logger.info("Will be logged in both transports!");
