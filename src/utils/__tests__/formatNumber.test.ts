import { describe, it, expect } from 'vitest'
import { formatNumber } from '../formatNumber'

describe('formatNumber', () => {
  it('should format numbers with default options', () => {
    expect(formatNumber({ value: 1000 })).toBe('1,000')
    expect(formatNumber({ value: 1000.5 })).toBe('1,000.5')
    expect(formatNumber({ value: 0 })).toBe('0')
  })

  it('should format numbers with decimal style', () => {
    expect(
      formatNumber({
        value: 1000.1234,
        options: {
          style: 'decimal',
          maximumFractionDigits: 2,
        },
      })
    ).toBe('1,000.12')
  })

  it('should format numbers with percent style', () => {
    expect(
      formatNumber({
        value: 0.1234,
        options: {
          style: 'percent',
          maximumFractionDigits: 2,
        },
      })
    ).toBe('12.34%')
  })

  it('should format numbers with currency style', () => {
    expect(
      formatNumber({
        value: 1000.1234,
        options: {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
        lang: 'en-US',
      })
    ).toBe('$1,000.12')
  })

  it('should respect minimumFractionDigits', () => {
    expect(
      formatNumber({
        value: 1000,
        options: {
          style: 'decimal',
          minimumFractionDigits: 2,
        },
      })
    ).toBe('1,000.00')
  })

  it('should format using different locales', () => {
    // German uses . as thousand separator and , as decimal separator
    expect(
      formatNumber({
        value: 1000.5,
        lang: 'de-DE',
      })
    ).toBe('1.000,5')
  })

  it('should handle zero value', () => {
    expect(formatNumber()).toBe('0')
  })

  it('should format numbers with different currencies', () => {
    // Euro format
    expect(
      formatNumber({
        value: 1000.5,
        options: {
          style: 'currency',
          currency: 'EUR',
        },
        lang: 'en-US',
      })
    ).toBe('€1,000.5')

    // Yen format (no decimal)
    expect(
      formatNumber({
        value: 1000,
        options: {
          style: 'currency',
          currency: 'JPY',
        },
        lang: 'en-US',
      })
    ).toBe('¥1,000')

    // RMB format
    expect(
      formatNumber({
        value: 1000.5,
        options: {
          style: 'currency',
          currency: 'CNY',
        },
        lang: 'zh-CN',
      })
    ).toBe('¥1,000.5')
  })
})
