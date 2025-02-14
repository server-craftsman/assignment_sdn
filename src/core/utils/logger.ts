import winston from "winston";
import path from "path";

// Custom log format with color and timestamp
const logFormat = winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
        const coloredLevel = level.toUpperCase();
        const formattedMessage = stack 
            ? `[${timestamp}] ${coloredLevel}: ${message}\nStack Trace: ${stack}`
            : `[${timestamp}] ${coloredLevel}: ${message}`;
        return formattedMessage;
    })
);

// Create log directory if it doesn't exist
const logDir = path.join(process.cwd(), 'logs');

const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        // Console transport with full color and formatting
        new winston.transports.Console({
            format: logFormat
        }),
        
        // Error log file - only captures error and above
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.json()
            )
        }),
        
        // Combined log file - captures all logs
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            format: winston.format.combine(
                winston.format.json()
            )
        })
    ],
    
    // Unhandled exception handling
    exceptionHandlers: [
        new winston.transports.File({ 
            filename: path.join(logDir, 'exceptions.log') 
        })
    ],
    
    // Rejection handling
    rejectionHandlers: [
        new winston.transports.File({ 
            filename: path.join(logDir, 'rejections.log') 
        })
    ]
});

export default logger;