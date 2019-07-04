import { ApplicationReference } from '@dvsa/mes-test-schema/categories/B';
import { formatApplicationReference } from '../tars';

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
