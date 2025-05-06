import { useCurrencyStore } from "@/stores/atom/currency";
import React, { memo } from "react";

const CoinCodeToName = ({ coin }: { coin: string }) => {
  const { getCurrency } = useCurrencyStore();
  const currencyInfo = getCurrency(coin);
  return <>{currencyInfo?.name || coin}</>;
};

export default memo(CoinCodeToName);
