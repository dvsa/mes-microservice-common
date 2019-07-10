import { getStaffNumberFromRequestContext } from '../authorisation';
import { APIGatewayEventRequestContext } from 'aws-lambda';

describe('authorisation', () => {

  describe('getStaffNumberFromRequestContext', () => {

    it('Should return null if no request context', () => {
      // @ts-ignore
      expect(getStaffNumberFromRequestContext(undefined)).toBeNull();
    });

    it('Should return null if staff number not set', () => {
      // @ts-ignore
      const dummyEvent: APIGatewayEventRequestContext = {};
      expect(getStaffNumberFromRequestContext(dummyEvent)).toBeNull();
    });

    it('Should return null if staff number wrong type', () => {
      // @ts-ignore
      const dummyEvent: APIGatewayEventRequestContext = {
        authorizer: {
          staffNumber: 98765, // should be a string
        },
      };
      expect(getStaffNumberFromRequestContext(dummyEvent)).toBeNull();
    });

    it('Should return the staff number when set', () => {
      // @ts-ignore
      const dummyEvent: APIGatewayEventRequestContext = {
        authorizer: {
          staffNumber: '00224466',
        },
      };
      expect(getStaffNumberFromRequestContext(dummyEvent)).toBe('00224466');
    });
  });
});
