import { useCurrencyStore } from "@/stores/atom/currency";
import { multiply } from "@/utils/operation";
import React, { memo, useMemo } from "react";
import PrettyAmountCoin from "./PrettyAmountCoin";
import { isValidNumber } from "@/utils/helper";

type Target = string | number;

const PrettyPrice = ({
  currency = "USDT",
  amount,
  children,
  precision = 2,
}: {
  currency?: string;
  amount?: Target;
  precision?: number;
  children?: Target;
}) => {
  const { getRate } = useCurrencyStore();
  const targetRate = getRate(currency);

  const targetAmount = useMemo(() => {
    if (isValidNumber(children) || isValidNumber(amount)) {
      return multiply(targetRate)(children || amount);
    }
    return "-";
  }, [targetRate]);

  return (
    <>
      <PrettyAmountCoin
        precision={precision}
        code={currency}
        amount={targetAmount}
        showSymbol={false}
      />
    </>
  );
};

export default memo(PrettyPrice);
