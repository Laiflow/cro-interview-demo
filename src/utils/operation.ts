// 封装Decimal的计算公式，并处理返回结果
import Decimal from 'decimal.js'
import { isNaN, toNumber } from 'lodash-es'

export function transformParam(a) {
  // 输入值为undefined或者null处理为0
  if (a == null) {
    a = new Decimal(0)
  }
  if (!Decimal.isDecimal(a)) {
    const isNaNVal = isNaN(toNumber(a))
    a = new Decimal(isNaNVal ? NaN : a)
  }

  return a
}

export const negated = (a) => {
  a = transformParam(a)
  return a.negated()
}

export const plus = (a) => {
  a = transformParam(a)
  return (b) => {
    b = transformParam(b)
    return a.plus(b)
  }
}

export const minus = (a) => {
  a = transformParam(a)
  return (b) => {
    b = transformParam(b)
    return a.minus(b)
  }
}

export const multiply = (a) => {
  a = transformParam(a)
  return (b) => {
    b = transformParam(b)
    return a.times(b)
  }
}

export const min = (...rest) => {
  const params = rest.map((r) => transformParam(r))
  return Decimal.min(...params)
}

export const max = (...rest) => {
  const params = rest.map((r) => transformParam(r))
  return Decimal.max(...params)
}

export const equals = (a) => {
  a = transformParam(a)
  return (b) => {
    b = transformParam(b)
    return a.equals(b)
  }
}

export const dividedBy = (a) => {
  a = transformParam(a)
  return (b) => {
    b = transformParam(b)
    if (equals(b)(0)) {
      // 如果分母为0按0返回
      return new Decimal(0)
    }
    return a.dividedBy(b)
  }
}

export const percentage = (a) => {
  a = transformParam(a)
  return multiply(a)(100)
}

export const round = (a) => {
  a = transformParam(a)
  return a.round()
}

export const abs = (a) => {
  a = transformParam(a)
  return a.absoluteValue()
}

export const toFixed = (a) => {
  a = transformParam(a)
  return (b, mod = Decimal.ROUND_DOWN) => {
    if (b == null) {
      return a.toFixed()
    }
    return a.toFixed(b, mod)
  }
}
