// const {createLogger, format, transports } = require('winston');
// const {combine, timestamp, printf, colorize} =format;

// //Define the log format
// const logFormat = printf(({level, message, timestamp })=>{
//     return `${timestamp} ${level} : ${message}`;
// });

// //Create the logger instance
// const logger = createLogger({
//     format: combine(
//         colorize(), // Enable colors for console logs
//         timestamp(), // Add a timestamp to logs
//         logFormat  // Use the defined log format
//     ),
//     transports: [
//         new transports.Console(), // Log to the console
//         new transports.File({ filename: 'logs/error.log', level:'error'}), // Log errors to error.log
//         new transports.File({filename: 'logs/combined.log' }) // Log all messages to combined.log
//     ]
// });

// module.exports = logger;

import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize } = format;

// Define the log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level} : ${message}`;
});

// Create the logger instance
const logger = createLogger({
    format: combine(
        colorize(), // Enable colors for console logs
        timestamp(), // Add a timestamp to logs
        logFormat  // Use the defined log format
    ),
    transports: [
        new transports.Console(), // Log to the console
        new transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to error.log
        new transports.File({ filename: 'logs/combined.log' }) // Log all messages to combined.log
    ]
});

export default logger;
