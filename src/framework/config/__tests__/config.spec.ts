import {defaultIfNotPresent, throwIfNotPresent} from '../config';

describe('Config', () => {

  describe('defaultIfNotPresent', () => {
    it('should return the value when defined', () => {
      const value = defaultIfNotPresent('hello', 'default');
      expect(value).toEqual('hello');
    });

    it('should return the defaultValue when value is not defined', () => {
      const value = defaultIfNotPresent(null, 'default');
      expect(value).toEqual('default');
    });
  });

  describe('throwIfNotPresent', () => {
    it('should return the value when defined', () => {
      const value = throwIfNotPresent('hello', 'key');
      expect(value).toEqual('hello');
    });

    it('should throw an error containing the configKey', () => {
      expect(
        () => throwIfNotPresent(null, 'key')
      ).toThrow(new Error('Configuration item key was not provided with a value'));
    });
  });

});
