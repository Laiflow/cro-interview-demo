import { useCurrencyStore } from "@/stores/atom/currency";
import { formatNumber } from "@/utils/formatNumber";
import { isUndef } from "@/utils/helper";
import { transformParam } from "@/utils/operation";
import React, { memo, useMemo } from "react";

const PrettyAmountCoin = ({
  code,
  amount,
  showSymbol = true,
  precision,
}: {
  code?: string;
  amount: string | number | undefined;
  showSymbol?: boolean;
  precision?: number;
}) => {
  const { getCurrency } = useCurrencyStore();

  const currencyInfo = code ? getCurrency(code) : ({} as unknown as any);
  const { display_decimal = 18, symbol } = currencyInfo;

  const showText = useMemo(() => {
    if (isUndef(amount)) {
      return "-";
    }
    const formatAmount = formatNumber({
      value: transformParam(amount),
      options: {
        maximumFractionDigits: precision || display_decimal,
      },
    });

    return `${formatAmount}${showSymbol ? ` ${symbol}` : ""}`;
  }, [amount, display_decimal]);

  return <>{showText}</>;
};

export default memo(PrettyAmountCoin);
