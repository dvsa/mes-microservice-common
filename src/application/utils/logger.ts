import { APIGatewayProxyEvent, ScheduledEvent } from 'aws-lambda';
import { getStaffNumberFromRequestContext } from '../../framework/security/authorisation';

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

enum LogLevelCode {
  DEBUG = 3,
  INFO = 2,
  WARN = 1,
  ERROR = 0,
}

type LogContext = {
  service: string;
  staffNumber?: string;
};

type LogEntry = {
  level: LogLevel;
  message: string;
};

let logContext: LogContext;
let logLevel: LogLevelCode;

/**
 * Initialises the logging system, needs to be called early in Lambda execution (e.g. at the beginning of the handler
 * function).
 *
 * Looks for an environment variable called ``LOG_LEVEL`` to use, which can be set to ``DEBUG``, ``INFO``, ``WARN``
 * or ``ERROR``. Only log messages at a level equal or above the configured level are actually output. If not set,
 * the default log level is ``DEBUG``.
 *
 * Accepts either an APIGatewayProxyEvent or a ScheduledEvent.
 * If the event is an APIGatewayProxyEvent with a request context including a staff number set by the custom authoriser,
 * that is included in the structured log output.
 *
 * @param serviceName The name of the lambda service (convention is kebab-case)
 * @param event The lambda event being processed
 */
export function bootstrapLogging(serviceName: string, event: APIGatewayProxyEvent | ScheduledEvent): void {
  logContext = {
    service: serviceName,
  };

  if (event && instanceOfAPIGatewayProxyEvent(event)) {
    const staffNumber = getStaffNumberFromRequestContext(event.requestContext);
    if (staffNumber) {
      logContext.staffNumber = staffNumber;
    }
  }

  logLevel = nameToCode(process.env.LOG_LEVEL);
}

function instanceOfAPIGatewayProxyEvent(object: any): object is APIGatewayProxyEvent {
  return 'requestContext' in object;
}

function nameToCode(name: string | undefined): LogLevelCode {
  switch (name) {
    case 'DEBUG':
      return LogLevelCode.DEBUG;

    case 'INFO':
      return LogLevelCode.INFO;

    case 'WARN':
      return LogLevelCode.WARN;

    case 'ERROR':
      return LogLevelCode.ERROR;

    default:
      if (name) {
        warn(`${name} is an invalid log level. Defaulting to DEBUG`);
      } else {
        warn('No log level set, defaulting to DEBUG');
      }
      return LogLevelCode.DEBUG;
  }
}

/**
 * Writes a debug level log message. Should be used to record more verbose low level details of what has happened.
 * @param msg The log message
 * @param objs Optional values to append to the log message. If a type of ``Error``, the name and error message is
 *             logged. All other values are passed to ``JSON.stringify(..)``
 */
export function debug(msg: string, ...objs: any[]): void {
  if (logLevel >= LogLevelCode.DEBUG) {
    log(LogLevel.DEBUG, formatMessage(msg, objs));
  }
}

/**
 * Writes an info level log message. Should be used to record brief high level details of what has happened.
 * @param msg The log message
 * @param objs Optional values to append to the log message. If a type of ``Error``, the name and error message is
 *             logged. All other values are passed to ``JSON.stringify(..)``
 */
export function info(msg: string, ...objs: any[]): void {
  if (logLevel >= LogLevelCode.INFO) {
    log(LogLevel.INFO, formatMessage(msg, objs));
  }
}

/**
 * Writes a warn level log message. Should be used for scenarios where something bad has happened, but the system can
 * continue, no data has been lost, and the primary action can be completed.
 * @param msg The log message
 * @param objs Optional values to append to the log message. If a type of ``Error``, the name and error message is
 *             logged. All other values are passed to ``JSON.stringify(..)``
 */
export function warn(msg: string, ...objs: any[]): void {
  if (logLevel >= LogLevelCode.WARN) {
    log(LogLevel.WARN, formatMessage(msg, objs));
  }
}

/**
 * Writes an error level log message. Should be used for scenarios where something bad has happened, and either the
 * system cannot continue, data has been lost, or an action cannot be completed.
 * @param msg The log message
 * @param objs Optional values to append to the log message. If a type of ``Error``, the name and error message is
 *             logged. All other values are passed to ``JSON.stringify(..)``
 */
export function error(msg: string, ...objs: any[]): void {
  log(LogLevel.ERROR, formatMessage(msg, objs));
}

/**
 * Writes a custom metric. Should be used with CloudWatch metric filters, that scrape values from log messages.
 * @param name The metric name
 * @param description The metric description
 */
export function customMetric(name: string, description: string): void {
  if (logContext) {
    console.log(JSON.stringify({ name, description, service: logContext.service }));
  } else {
    console.log(JSON.stringify({ name, description }));
  }
}

function formatMessage(msg: string, objs: any[]): string {
  if (objs.length > 0) {
    return msg + (objs.map((x: any) => {
      if (x instanceof Error) {
        return `${x.name}: ${x.message}`;
      }
      return JSON.stringify(x);
    }).join(' '));
  }
  return msg;
}

function log(logLevel: string, msg: string): void {
  if (logContext) {
    console.log(JSON.stringify({ ...logContext, level: logLevel, message: msg }));
  } else {
    console.log(JSON.stringify({ level: logLevel, message: msg }));
  }
}
