import Decimal from "decimal.js";

// 允许使用 any 的注释

interface FormatNumberOptions {
  style?: "decimal" | "currency" | "percent" | "unit";
  currency?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

const DEFAULT_OPTIONS = {
  style: "decimal" as const,
  maximumFractionDigits: 18,
  minimumFractionDigits: 0,
};

/**
 * 使用 Intl.NumberFormat 格式化数字
 * @param {Object} params - 格式化参数对象
 * @param {number} params.value - 需要格式化的数字
 * @param {string} [params.lang="en_US"] - 语言/地区代码（例如："en_US"、"zh_CN"）
 * @param {FormatNumberOptions} [params.options] - 格式化选项
 * @param {("decimal"|"currency"|"percent"|"unit")} [params.options.style="decimal"] - 格式化样式
 * @param {string} [params.options.currency] - 货币代码（当style为"currency"时必需，例如："USD"、"EUR"、"CNY"）
 * @param {number} [params.options.maximumFractionDigits] - 最大小数位数
 * @param {number} [params.options.minimumFractionDigits] - 最小小数位数
 * @returns {string} 格式化后的数字字符串
 */
export const formatNumber = (
  params: {
    value: number;
    lang?: string;
    options?: FormatNumberOptions;
    round?: Decimal.Rounding;
  } = { value: 0 },
): string => {
  const { options, lang, value } = params;

  const formatter = new Intl.NumberFormat(lang, {
    ...DEFAULT_OPTIONS,
    ...(options || {}),
  });

  return formatter.format(value);
};
