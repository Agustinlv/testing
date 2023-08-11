//Module imports
import winston from "winston";
import path from 'path';

//File imports
import { config } from '../config/environment.config.js';
import __dirname from "../utils.js";

const environment = config.environment.mode;

const filename = path.join(__dirname, '../errors.log');

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "cyan",
        error: "red",
        warn: "yellow",
        info: "blue",
        http: "green",
        debug: "white"
    }
};

const devLogger = winston.createLogger({

    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(winston.format.colorize({
                colors: customLevels.colors
            }),
            winston.format.simple() 
        )}),
    ]

});

const prodLogger = winston.createLogger({

    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(winston.format.colorize({
                colors: customLevels.colors
            }),
            winston.format.simple()
        )}),
        new winston.transports.File({filename: filename, level: 'error'})
    ]

});

let customLogger;

if (environment === "dev") {

    customLogger = devLogger;

} else {

    customLogger = prodLogger;

};

export const loggerPrefix = (filename, message) => {

    return `Date: ${new Date().toLocaleDateString()} - File: ${filename} - Message: ${message}`;

};

export default customLogger;