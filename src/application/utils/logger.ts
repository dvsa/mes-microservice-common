import { APIGatewayProxyEvent, ScheduledEvent } from 'aws-lambda';
import * as moment from 'moment';
import { getStaffNumberFromRequestContext, getRoleFromRequestContext } from '../../framework/security/authorisation';
import { ExaminerRole } from "../../domain/examiner-role";
import {Tracer} from "@aws-lambda-powertools/tracer";

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
  role?: ExaminerRole;
  xRayTraceId?: string;
  coldStart?: boolean;
};

export let logContext: LogContext;
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
 * that is included in the structured log output, along with the examiner role.
 *
 * @param functionName The name of the lambda function (convention is kebab-case)
 * @param event The lambda event being processed
 * @param tracer
 */
export function bootstrapLogging(functionName: string, event: APIGatewayProxyEvent | ScheduledEvent, tracer?: Tracer): void {
  logContext = {
    service: functionName,
  };

  if (event && instanceOfAPIGatewayProxyEvent(event)) {
    const staffNumber = getStaffNumberFromRequestContext(event.requestContext);
    if (staffNumber) logContext.staffNumber = staffNumber;

    const role = getRoleFromRequestContext(event.requestContext);
    if (role) logContext.role = role;
  }

  if (!!tracer) {
    logContext.coldStart = tracer.isColdStart();
    logContext.xRayTraceId = tracer.getRootXrayTraceId();
  }

  logLevel = nameToCode(process.env.LOG_LEVEL);
}

function instanceOfAPIGatewayProxyEvent(object: APIGatewayProxyEvent | ScheduledEvent): object is APIGatewayProxyEvent {
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
 * @param value An optional value to include in the metric log output
 */
export function customMetric(name: string, description: string, value?: any): void {
  let logObject: any = { name, description };
  if (logContext) {
    const { service } = logContext;
    logObject = { ...logObject, service };
  }
  if (value !== undefined) {
    logObject = { ...logObject, value };
  }
  console.log(JSON.stringify(logObject));
}

/**
 * Writes a custom metric for a time duration. Should be used with CloudWatch metric filters, that scrape values from
 * log messages. Writes the metric value as fractions of a second.
 * @param name The metric name
 * @param description The metric description
 * @param start The start time of the duration
 * @param end The end time of the duration
 */
export function customDurationMetric(name: string, description: string, start: Date, end: Date): void {
  customMetric(name, description, moment(end).diff(moment(start), 'seconds', true));
}

function formatMessage(msg: string, objs: any[]): string {
  if (objs.length > 0) {
    return msg + (objs.map((x: any) => {
      if (x instanceof Error) {
        return ` ${x.name}: ${x.message}`;
      }
      return ` ${JSON.stringify(x)}`;
    }).join(''));
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
