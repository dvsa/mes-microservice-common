import { debug, bootstrapLogging, info, warn, error, customMetric } from '../logger';
import { APIGatewayProxyEvent, ScheduledEvent } from 'aws-lambda';

describe('logger, bootstrapped', () => {
  beforeEach(() => {
    spyOn(console, 'log');
  });

  const eventWithoutStaffNumber: APIGatewayProxyEvent = {
    body: '',
    headers: {},
    httpMethod: 'GET',
    isBase64Encoded: false,
    path: '',
    pathParameters: {},
    queryStringParameters: null,
    stageVariables: {},
    // @ts-ignore
    requestContext: {},
    resource: '',
  };

  const eventWithStaffNumber: APIGatewayProxyEvent = {
    ...eventWithoutStaffNumber,
    // @ts-ignore
    requestContext: {
      authorizer: {
        staffNumber: '00112233',
      },
    },
  };

  const logMessage = 'Log Message';
  const logPrefix = 'Log Message: ';
  const obj = { aaa: 'bbb', ccc: 123, ddd: false };
  const s = 'test';
  const n = 54321;
  const b = false;
  const err = new Error('Oops');

  describe('debug', () => {
    beforeEach(() => {
      process.env.LOG_LEVEL = 'DEBUG';
      bootstrapLogging('test-service', eventWithoutStaffNumber);
    });

    it('Should log a simple message', () => {
      debug(logMessage);
      checkMessageWasLogged('DEBUG');
    });

    it('Should stringify an object', () => {
      debug(logPrefix, obj);
      checkObjectWasLogged('DEBUG');
    });

    it('Should stringify several objects', () => {
      debug(logPrefix, obj, s, n, b);
      checkSeveralObjectsWereLogged('DEBUG');
    });

    it('Should stringify an Error', () => {
      debug(logPrefix, err);
      checkErrorWasLogged('DEBUG');
    });
  });

  describe('info', () => {
    beforeEach(() => {
      process.env.LOG_LEVEL = 'INFO';
      bootstrapLogging('test-service', eventWithoutStaffNumber);
    });

    it('Should log a simple message', () => {
      info(logMessage);
      checkMessageWasLogged('INFO');
    });

    it('Should stringify an object', () => {
      info(logPrefix, obj);
      checkObjectWasLogged('INFO');
    });

    it('Should stringify several objects', () => {
      info(logPrefix, obj, s, n, b);
      checkSeveralObjectsWereLogged('INFO');
    });

    it('Should stringify an Error', () => {
      info(logPrefix, err);
      checkErrorWasLogged('INFO');
    });
  });

  describe('warn', () => {
    beforeEach(() => {
      process.env.LOG_LEVEL = 'WARN';
      bootstrapLogging('test-service', eventWithoutStaffNumber);
    });

    it('Should log a simple message', () => {
      warn(logMessage);
      checkMessageWasLogged('WARN');
    });

    it('Should stringify an object', () => {
      warn(logPrefix, obj);
      checkObjectWasLogged('WARN');
    });

    it('Should stringify several objects', () => {
      warn(logPrefix, obj, s, n, b);
      checkSeveralObjectsWereLogged('WARN');
    });

    it('Should stringify an Error', () => {
      warn(logPrefix, err);
      checkErrorWasLogged('WARN');
    });
  });

  describe('error', () => {
    beforeEach(() => {
      process.env.LOG_LEVEL = 'ERROR';
      bootstrapLogging('test-service', eventWithoutStaffNumber);
    });

    it('Should log a simple message', () => {
      error(logMessage);
      checkMessageWasLogged('ERROR');
    });

    it('Should stringify an object', () => {
      error(logPrefix, obj);
      checkObjectWasLogged('ERROR');
    });

    it('Should stringify several objects', () => {
      error(logPrefix, obj, s, n, b);
      checkSeveralObjectsWereLogged('ERROR');
    });

    it('Should stringify an Error', () => {
      error(logPrefix, err);
      checkErrorWasLogged('ERROR');
    });
  });

  describe('bootstrap', () => {
    it('Should log INFO if log level set to DEBUG', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      bootstrapLogging('test-service', eventWithoutStaffNumber);
      info(logMessage);
      checkMessageWasLogged('INFO');
    });

    it('Should log WARN if log level set to INFO', () => {
      process.env.LOG_LEVEL = 'INFO';
      bootstrapLogging('test-service', eventWithoutStaffNumber);
      warn(logMessage);
      checkMessageWasLogged('WARN');
    });

    it('Should log ERROR if log level set to WARN', () => {
      process.env.LOG_LEVEL = 'WARN';
      bootstrapLogging('test-service', eventWithoutStaffNumber);
      error(logMessage);
      checkMessageWasLogged('ERROR');
    });

    it('Should not log DEBUG if log level set to INFO', () => {
      process.env.LOG_LEVEL = 'INFO';
      bootstrapLogging('test-service', eventWithoutStaffNumber);
      debug(logMessage);
      expect(console.log).toHaveBeenCalledTimes(0);
    });

    it('Should not log INFO if log level set to WARN', () => {
      process.env.LOG_LEVEL = 'WARN';
      bootstrapLogging('test-service', eventWithoutStaffNumber);
      info(logMessage);
      expect(console.log).toHaveBeenCalledTimes(0);
    });

    it('Should not log WARN if log level set to ERROR', () => {
      process.env.LOG_LEVEL = 'ERROR';
      bootstrapLogging('test-service', eventWithoutStaffNumber);
      warn(logMessage);
      expect(console.log).toHaveBeenCalledTimes(0);
    });

    it('Should default to DEBUG if log level is invalid', () => {
      process.env.LOG_LEVEL = 'WIBBLE';
      bootstrapLogging('test-service', eventWithoutStaffNumber);
      debug(logMessage);
      checkMessageWasLogged('DEBUG');
    });

    it('Should default to DEBUG if log level not set', () => {
      process.env.LOG_LEVEL = undefined;
      bootstrapLogging('test-service', eventWithoutStaffNumber);
      debug(logMessage);
      checkMessageWasLogged('DEBUG');
    });

    it('Should log staff number, if set in request context', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      bootstrapLogging('test-service', eventWithStaffNumber);
      debug(logMessage);
      checkMessageWasLoggedWithStaffNumber('DEBUG');
    });

    it('Should accept a call that includes a ScheduledEvent', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      const scheduledEvent: ScheduledEvent = {
        account: '12345',
        region: 'eu-west-1',
        detail: 'details',
        'detail-type': 'type',
        source: 'CloudWatch',
        time: '2019-01-01 00:00:00',
        id: '999',
        resources: [],
      };
      bootstrapLogging('test-service', scheduledEvent);
      debug(logMessage);
      checkMessageWasLogged('DEBUG');
    });
  });

  describe('customMetric', () => {
    it('Should log the metric', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      bootstrapLogging('test-service', eventWithoutStaffNumber);
      customMetric('my-metric', 'my-description');
      expect(console.log).toHaveBeenCalledWith(`{"name":"my-metric","description":"my-description",` +
                                               `"service":"test-service"}`);
    });
    it('Should log a metric that includes a value', () => {
      process.env.LOG_LEVEL = 'DEBUG';
      bootstrapLogging('test-service', eventWithoutStaffNumber);
      customMetric('my-metric', 'my-description', 'my-value');
      expect(console.log).toHaveBeenCalledWith(`{"name":"my-metric","description":"my-description",` +
                                               `"service":"test-service","value":"my-value"}`);
    });
  });
});

function checkMessageWasLogged(level: string) {
  expect(console.log).toHaveBeenCalledWith(`{"service":"test-service","level":"${level}","message":"Log Message"}`);
}

function checkMessageWasLoggedWithStaffNumber(level: string) {
  expect(console.log).toHaveBeenCalledWith(`{"service":"test-service","staffNumber":"00112233","level":"${level}",` +
                                           `"message":"Log Message"}`);
}

function checkObjectWasLogged(level: string) {
  expect(console.log).toHaveBeenCalledWith(`{"service":"test-service","level":"${level}",` +
                                          '"message":"Log Message: ' +
                                          '{\\"aaa\\":\\"bbb\\",\\"ccc\\":123,\\"ddd\\":false}"}');
}

function checkSeveralObjectsWereLogged(level: string) {
  expect(console.log).toHaveBeenCalledWith(`{"service":"test-service","level":"${level}",` +
                                            '"message":"Log Message: ' +
                                            '{\\"aaa\\":\\"bbb\\",\\"ccc\\":123,\\"ddd\\":false}' +
                                            ' \\"test\\" 54321 false"}');
}

function checkErrorWasLogged(level: string) {
  expect(console.log).toHaveBeenCalledWith(`{"service":"test-service","level":"${level}",` +
                                            '"message":"Log Message: Error: Oops"}');
}
