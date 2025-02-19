import winston from "winston";
import path from "path";
import fs from 'fs';

// Ensure logs directory exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Simple but nice console format
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message }) => {
        const icon = level.includes('error') ? '❌' : 
                     level.includes('warn') ? '⚠️' : 
                     level.includes('info') ? 'ℹ️' : '🔍';
        return `${icon} ${timestamp} [${level}]: ${message}`;
    })
);

const logger = winston.createLogger({
    level: 'info',
    transports: [
        // Console logs
        new winston.transports.Console({
            format: consoleFormat
        }),
        
        // Error logs
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error'
        }),
        
        // All logs
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log')
        })
    ]
});

export default logger;