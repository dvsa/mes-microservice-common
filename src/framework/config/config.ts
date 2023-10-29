/**
 * Check for a values existence, or return a default
 * @returns The value or default
 * @param value
 * @param defaultValue
 */
export const defaultIfNotPresent = <T>(value: string | null | undefined, defaultValue: T) => {
  if (!value || value?.trim().length === 0) {
    return defaultValue;
  }
  return value;
};

/**
 * Check for a values existence, or throw an error
 * @returns The value or error containing configKey
 * @param value
 * @param configKey
 */
export const throwIfNotPresent = (value: string | null | undefined, configKey: string) => {
  if (!value || value?.trim().length === 0) {
    throw new Error(`Configuration item ${configKey} was not provided with a value`);
  }
  return value;
};
