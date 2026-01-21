import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';
import {formatApplicationReference, getFormattedApplicationReference} from '../tars';

describe('formatApplicationReference', () => {
  it('Should map with leading zeros if needed', () => {
    const appRef: ApplicationReference = {
      applicationId: 1234,
      bookingSequence: 2,
      checkDigit: 3,
    };

    expect(formatApplicationReference(appRef)).toBe(1234023);
  });

  it('Should allow 2 digit booking sequence when specified', () => {
    const appRef: ApplicationReference = {
      applicationId: 1234,
      bookingSequence: 12,
      checkDigit: 3,
    };

    expect(formatApplicationReference(appRef)).toBe(1234123);
  });
});

describe('getFormattedApplicationReference', () => {
  it('Should return booking reference if there is one', () => {
    const appRef: ApplicationReference = {
      bookingReference: 'A',
    };

    expect(getFormattedApplicationReference(appRef)).toBe('A');
  });

  it('Should return a formatted app ref if there is no booking reference', () => {
    const appRef: ApplicationReference = {
      applicationId: 1234,
      bookingSequence: 12,
      checkDigit: 3,
    };

    expect(getFormattedApplicationReference(appRef)).toBe('1234123');
  });
});
