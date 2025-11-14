import winston from 'winston';
import constants from './constants'

// Define a reusable log format
const logFormat = winston.format.combine(
  winston.format.colorize(), // Adds color to console output
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: constants.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
    }),
  ],
  exitOnError: false, // Prevent Winston from exiting on handled exceptions
});

export default logger;
