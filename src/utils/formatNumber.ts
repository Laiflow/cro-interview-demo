import Decimal from 'decimal.js'

interface FormatNumberOptions {
  style?: 'decimal' | 'currency' | 'percent' | 'unit'
  currency?: string
  maximumFractionDigits?: number
  minimumFractionDigits?: number
}

const DEFAULT_OPTIONS = {
  style: 'decimal' as const,
  maximumFractionDigits: 18,
  minimumFractionDigits: 0,
}

/**
 * Format number using Intl.NumberFormat
 * @param {Object} params - Format parameters object
 * @param {number} params.value - Number to format
 * @param {string} [params.lang="en_US"] - Locale code (e.g., "en_US", "zh_CN")
 * @param {FormatNumberOptions} [params.options] - Format options
 * @param {("decimal"|"currency"|"percent"|"unit")} [params.options.style="decimal"] - Format style
 * @param {string} [params.options.currency] - Currency code (required if style is "currency", e.g., "USD", "EUR", "CNY")
 * @param {number} [params.options.maximumFractionDigits] - Max fraction digits
 * @param {number} [params.options.minimumFractionDigits] - Min fraction digits
 * @returns {string} Formatted number string
 */
export const formatNumber = (
  params: {
    value: number
    lang?: string
    options?: FormatNumberOptions
    round?: Decimal.Rounding
  } = { value: 0 }
): string => {
  const { options, lang, value } = params

  const formatter = new Intl.NumberFormat(lang, {
    ...DEFAULT_OPTIONS,
    ...(options || {}),
  })

  return formatter.format(value)
}
