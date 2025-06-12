import { describe, it, expect } from 'vitest'
import { isUndef, isValidNumber } from '../helper'

describe('isUndef', () => {
  it('should return true for undefined values', () => {
    expect(isUndef(undefined)).toBe(true)
  })

  it('should return true for null values', () => {
    expect(isUndef(null)).toBe(true)
  })

  it('should return true for empty string', () => {
    expect(isUndef('')).toBe(true)
  })

  it('should return true for NaN', () => {
    expect(isUndef(NaN)).toBe(true)
  })

  it('should return false for zero', () => {
    expect(isUndef(0)).toBe(false)
  })

  it('should return false for false', () => {
    expect(isUndef(false)).toBe(false)
  })

  it('should return false for objects', () => {
    expect(isUndef({})).toBe(false)
  })
})

describe('isValidNumber', () => {
  it('should return true for numeric strings', () => {
    expect(isValidNumber('123')).toBe(true)
    expect(isValidNumber('123.45')).toBe(true)
    expect(isValidNumber('-123.45')).toBe(true)
  })

  it('should return true for numbers', () => {
    expect(isValidNumber(123)).toBe(true)
    expect(isValidNumber(123.45)).toBe(true)
    expect(isValidNumber(-123.45)).toBe(true)
    expect(isValidNumber(0)).toBe(true)
  })

  it('should return false for undefined values', () => {
    expect(isValidNumber(undefined)).toBe(false)
  })

  it('should return false for null values', () => {
    expect(isValidNumber(null)).toBe(false)
  })

  it('should return false for empty string', () => {
    expect(isValidNumber('')).toBe(false)
  })

  it('should return false for NaN', () => {
    expect(isValidNumber(NaN)).toBe(false)
  })

  it('should return false for non-numeric strings', () => {
    expect(isValidNumber('abc')).toBe(false)
    expect(isValidNumber('123abc')).toBe(false)
  })

  it('should return false for objects', () => {
    expect(isValidNumber({})).toBe(false)
  })
})
