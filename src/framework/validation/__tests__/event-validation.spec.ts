import {APIGatewayProxyEventPathParameters} from 'aws-lambda';
import {getPathParam} from '../event-validation';

describe('event validation', () => {

  describe('getPathParam', () => {
    it('Should return null if no pathParams', () => {
      expect(getPathParam(null, '')).toBeNull();
    });

    it('Should return null if no key', () => {
      expect(getPathParam({}, '')).toBeNull();
    });

    it('Should return null if path param is the wrong type', () => {
      // @ts-ignore
      const dummyPathParams = {
        param: 1,
      } as APIGatewayProxyEventPathParameters;
      expect(getPathParam(dummyPathParams, 'param')).toBeNull();
    });

    it('Should return the pathParam when set', () => {
      const dummyPathParams = {
        param: 'value',
      } as APIGatewayProxyEventPathParameters;
      expect(getPathParam(dummyPathParams, 'param')).toBe('value');
    });
  });
});
