import { licenceToIssue } from '../licence-type';

describe('licenseToIssue', () => {
  describe('rule1', () => {
    it('should return Manual when category C, transmission automatic and code78 false', () => {
      const retValue = licenceToIssue('C', 'Automatic', false);
      expect(retValue).toBe('Manual');
    });
    it('should return Manual when category D, transmission automatic and code78 false', () => {
      const retValue = licenceToIssue('D', 'Automatic', false);
      expect(retValue).toBe('Manual');
    });
    it('should return Manual when category C+E, transmission automatic and code78 false', () => {
      const retValue = licenceToIssue('C+E', 'Automatic', false);
      expect(retValue).toBe('Manual');
    });
    it('should return Manual when category D+E, transmission automatic and code78 false', () => {
      const retValue = licenceToIssue('D+E', 'Automatic', false);
      expect(retValue).toBe('Manual');
    });
  });

  describe('rule2', () => {
    it('should return Manual when category C, transmission manual and code78 true', () => {
      const retValue = licenceToIssue('C', 'Manual', true);
      expect(retValue).toBe('Manual');
    });
    it('should return Manual when category D, transmission manual and code78 true', () => {
      const retValue = licenceToIssue('D', 'Manual', true);
      expect(retValue).toBe('Manual');
    });
    it('should return Manual when category C+E, transmission manual and code78 true', () => {
      const retValue = licenceToIssue('C+E', 'Manual', true);
      expect(retValue).toBe('Manual');
    });
    it('should return Manual when category D+E, transmission manual and code78 true', () => {
      const retValue = licenceToIssue('D+E', 'Manual', true);
      expect(retValue).toBe('Manual');
    });
  });
  describe('rule3', () => {
    it('should return Manual when category C, transmission manual and code78 false', () => {
      const retValue = licenceToIssue('C', 'Manual', false);
      expect(retValue).toBe('Manual');
    });
    it('should return Manual when category D, transmission manual and code78 false', () => {
      const retValue = licenceToIssue('D', 'Manual', false);
      expect(retValue).toBe('Manual');
    });
    it('should return Manual when category C+E, transmission manual and code78 false', () => {
      const retValue = licenceToIssue('C+E', 'Manual', false);
      expect(retValue).toBe('Manual');
    });
    it('should return Manual when category D+E, transmission manual and code78 false', () => {
      const retValue = licenceToIssue('D+E', 'Manual', false);
      expect(retValue).toBe('Manual');
    });
  });
  describe('rule4', () => {
    it('should return Automatic when category C, transmission Automatic and code78 true', () => {
      const retValue = licenceToIssue('C', 'Automatic', true);
      expect(retValue).toBe('Automatic');
    });
    it('should return Automatic when category D, transmission Automatic and code78 true', () => {
      const retValue = licenceToIssue('D', 'Automatic', true);
      expect(retValue).toBe('Automatic');
    });
    it('should return Automatic when category C+E, transmission Automatic and code78 true', () => {
      const retValue = licenceToIssue('C+E', 'Automatic', true);
      expect(retValue).toBe('Automatic');
    });
    it('should return Automatic when category D+E, transmission Automatic and code78 true', () => {
      const retValue = licenceToIssue('D+E', 'Automatic', true);
      expect(retValue).toBe('Automatic');
    });
  });
  describe('other cases', () => {
    it('should return the passed in vehicle transmission if code78 undefined', () => {
      const retValue1 = licenceToIssue('C', 'Automatic', undefined);
      const retValue2 = licenceToIssue('D', 'Manual', undefined);
      expect(retValue1).toBe('Automatic');
      expect(retValue2).toBe('Manual');
    });

    it('should return the passed in vehicle transmission for other categories and code78 true', () => {
      const retValue1 = licenceToIssue('A', 'Automatic', true);
      const retValue2 = licenceToIssue('B', 'Manual', true);
      expect(retValue1).toBe('Automatic');
      expect(retValue2).toBe('Manual');
    });
    it('should return the passed in vehicle transmission for other categories and code78 false', () => {
      const retValue1 = licenceToIssue('A', 'Automatic', false);
      const retValue2 = licenceToIssue('B', 'Manual', false);
      expect(retValue1).toBe('Automatic');
      expect(retValue2).toBe('Manual');
    });

  });

});
