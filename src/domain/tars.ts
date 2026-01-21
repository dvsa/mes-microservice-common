import { ApplicationReference } from '@dvsa/mes-test-schema/categories/common';

/**
 * Gets either a formatted app ref or the booking reference, depending on whether the booking reference is available.
 *
 * @param appRef The application reference, as separate fields
 * @returns The booking reference or the formatted application reference
 */

export const getFormattedApplicationReference = (appRef: ApplicationReference): string => {
  if (appRef.bookingReference) {
    return appRef.bookingReference
  }
  return formatApplicationReference(appRef).toString();
};


/**
 * Formats application reference as a single number, of the form <``app-id``><``book-seq``><``check-digit``>.
 *
 * @param appRef The application reference, as separate fields
 * @returns The app id, booking sequence (padded to 2 digits) and check digit
 */

export const formatApplicationReference = (appRef: ApplicationReference): Number => {
  const formatter = Intl.NumberFormat('en-gb', { minimumIntegerDigits: 2 });
  return Number(`${appRef.applicationId}${formatter.format(Number(appRef.bookingSequence))}${appRef.checkDigit}`);
};
