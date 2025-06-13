/**
 * Checks if a value is undefined, null, empty string, or NaN.
 * @param {any} v - The value to check.
 * @returns {boolean} True if the value is undefined, null, empty string, or NaN; otherwise, false.
 */
export const isUndef = (v) => v === null || v === undefined || v === '' || Number.isNaN(v)

/**
 * Checks if a value is a valid number (not undefined, null, empty string, or NaN).
 * @param {any} v - The value to check.
 * @returns {boolean} True if the value is a valid number; otherwise, false.
 */
export const isValidNumber = (v) => {
  if (isUndef(v)) return false
  return !isNaN(Number(v))
}
