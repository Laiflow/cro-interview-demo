// Wrap Decimal calculation and handle return value
import Decimal from 'decimal.js'
import { isNaN, toNumber } from 'lodash-es'

/**
 * Converts the input to a Decimal instance.
 * If the input is undefined or null, returns Decimal(0).
 * If the input is not a valid number, returns Decimal(NaN).
 * @param {any} a - The value to convert.
 * @returns {Decimal} The Decimal instance.
 */
export function transformParam(a) {
  // If input is undefined or null, treat as 0
  if (a == null) {
    a = new Decimal(0)
  }
  if (!Decimal.isDecimal(a)) {
    const isNaNVal = isNaN(toNumber(a))
    a = new Decimal(isNaNVal ? NaN : a)
  }

  return a
}

/**
 * Returns the negated value of a number.
 * @param {any} a - The value to negate.
 * @returns {Decimal} The negated value.
 */
export const negated = (a) => {
  a = transformParam(a)
  return a.negated()
}

/**
 * Returns a function that adds b to a.
 * @param {any} a - The first value.
 * @returns {(b: any) => Decimal} Function that adds b to a.
 */
export const plus = (a) => {
  a = transformParam(a)
  return (b) => {
    b = transformParam(b)
    return a.plus(b)
  }
}

/**
 * Returns a function that subtracts b from a.
 * @param {any} a - The first value.
 * @returns {(b: any) => Decimal} Function that subtracts b from a.
 */
export const minus = (a) => {
  a = transformParam(a)
  return (b) => {
    b = transformParam(b)
    return a.minus(b)
  }
}

/**
 * Returns a function that multiplies a by b.
 * @param {any} a - The first value.
 * @returns {(b: any) => Decimal} Function that multiplies a by b.
 */
export const multiply = (a) => {
  a = transformParam(a)
  return (b) => {
    b = transformParam(b)
    return a.times(b)
  }
}

/**
 * Returns the minimum value among the arguments.
 * @param {...any[]} rest - The values to compare.
 * @returns {Decimal} The minimum value.
 */
export const min = (...rest) => {
  const params = rest.map((r) => transformParam(r))
  return Decimal.min(...params)
}

/**
 * Returns the maximum value among the arguments.
 * @param {...any[]} rest - The values to compare.
 * @returns {Decimal} The maximum value.
 */
export const max = (...rest) => {
  const params = rest.map((r) => transformParam(r))
  return Decimal.max(...params)
}

/**
 * Returns a function that checks if a equals b.
 * @param {any} a - The first value.
 * @returns {(b: any) => boolean} Function that checks equality.
 */
export const equals = (a) => {
  a = transformParam(a)
  return (b) => {
    b = transformParam(b)
    return a.equals(b)
  }
}

/**
 * Returns a function that divides a by b. If b is 0, returns Decimal(0).
 * @param {any} a - The numerator.
 * @returns {(b: any) => Decimal} Function that divides a by b.
 */
export const dividedBy = (a) => {
  a = transformParam(a)
  return (b) => {
    b = transformParam(b)
    if (equals(b)(0)) {
      // If denominator is 0, return 0
      return new Decimal(0)
    }
    return a.dividedBy(b)
  }
}

/**
 * Returns the percentage value of a (a * 100).
 * @param {any} a - The value to convert to percentage.
 * @returns {Decimal} The percentage value.
 */
export const percentage = (a) => {
  a = transformParam(a)
  return multiply(a)(100)
}

/**
 * Rounds a value to the nearest integer.
 * @param {any} a - The value to round.
 * @returns {Decimal} The rounded value.
 */
export const round = (a) => {
  a = transformParam(a)
  return a.round()
}

/**
 * Returns the absolute value of a.
 * @param {any} a - The value.
 * @returns {Decimal} The absolute value.
 */
export const abs = (a) => {
  a = transformParam(a)
  return a.absoluteValue()
}

/**
 * Returns a function that formats a to a fixed number of decimal places.
 * @param {any} a - The value to format.
 * @returns {(b: number, mod?: Decimal.Rounding) => string} Function to format a.
 */
export const toFixed = (a) => {
  a = transformParam(a)
  return (b, mod = Decimal.ROUND_DOWN) => {
    if (b == null) {
      return a.toFixed()
    }
    return a.toFixed(b, mod)
  }
}
