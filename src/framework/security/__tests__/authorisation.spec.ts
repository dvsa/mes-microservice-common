import {getRoleFromRequestContext, getStaffNumberFromRequestContext} from '../authorisation';
import { APIGatewayEventRequestContext } from 'aws-lambda';

describe('authorisation', () => {
  describe('getStaffNumberFromRequestContext', () => {
    it('Should return null if no request context', () => {
      // @ts-ignore
      expect(getStaffNumberFromRequestContext(undefined)).toBeNull();
    });

    it('Should return null if staff number not set', () => {
      const dummyEvent = {} as APIGatewayEventRequestContext;
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
      const dummyEvent = {
        authorizer: {
          staffNumber: '00224466',
        },
      } as APIGatewayEventRequestContext;
      expect(getStaffNumberFromRequestContext(dummyEvent)).toBe('00224466');
    });
  });

  describe('getRoleFromRequestContext', () => {
    it('Should return null if no request context', () => {
      // @ts-ignore
      expect(getRoleFromRequestContext(undefined)).toBeNull();
    });

    it('Should return null if examiner role not set', () => {
      const dummyEvent = {} as APIGatewayEventRequestContext;
      expect(getRoleFromRequestContext(dummyEvent)).toBeNull();
    });

    it('Should return null if examiner role wrong type', () => {
      // @ts-ignore
      const dummyEvent: APIGatewayEventRequestContext = {
        authorizer: {
          examinerRole: 1, // should be a string
        },
      };
      expect(getRoleFromRequestContext(dummyEvent)).toBeNull();
    });

    it('Should return the examiner role when set', () => {
      // @ts-ignore
      const dummyEvent = {
        authorizer: {
          examinerRole: 'DE',
        },
      } as APIGatewayEventRequestContext;
      expect(getRoleFromRequestContext(dummyEvent)).toBe('DE');
    });
  });
});
