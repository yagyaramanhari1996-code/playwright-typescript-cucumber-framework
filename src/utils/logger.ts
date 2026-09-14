type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const LEVEL_ORDER: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO:  1,
  WARN:  2,
  ERROR: 3,
};

const MIN_LEVEL: LogLevel = (process.env.LOG_LEVEL?.toUpperCase() as LogLevel) ?? 'INFO';

function timestamp(): string {
  return new Date().toISOString();
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[MIN_LEVEL];
}

function format(level: LogLevel, message: string, meta?: unknown): string {
  const base = `[${timestamp()}] [${level.padEnd(5)}] ${message}`;
  return meta !== undefined ? `${base} ${JSON.stringify(meta)}` : base;
}

export const logger = {
  debug(message: string, meta?: unknown): void {
    if (shouldLog('DEBUG')) console.debug(format('DEBUG', message, meta));
  },
  info(message: string, meta?: unknown): void {
    if (shouldLog('INFO')) console.info(format('INFO', message, meta));
  },
  warn(message: string, meta?: unknown): void {
    if (shouldLog('WARN')) console.warn(format('WARN', message, meta));
  },
  error(message: string, meta?: unknown): void {
    if (shouldLog('ERROR')) console.error(format('ERROR', message, meta));
  },
};
