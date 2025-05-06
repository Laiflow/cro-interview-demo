import { create } from "zustand";
import {
  fetchCurrencies,
  fetchLiveRates,
  fetchWalletBalance,
} from "../utils/mockApi";

export interface Currency {
  coin_id: string;
  name: string;
  symbol: string;
  colorful_image_url: string;
}

export interface WalletBalance {
  currency: string;
  amount: number;
}

export interface ExchangeRate {
  from_currency: string;
  to_currency: string;
  rates: Array<{
    amount: string;
    rate: string;
  }>;
}

export interface WalletState {
  // 数据
  currencies: Currency[];
  walletBalances: WalletBalance[];
  exchangeRates: ExchangeRate[];

  // 状态
  isLoading: boolean;
  error: string | null;

  // 计算属性
  getSupportedWalletBalances: () => WalletBalance[];
  getTotalUsdBalance: () => number;
  getUsdBalance: (currency: string) => number;
  getCurrencyDetails: (currency: string) => Currency | undefined;
  getExchangeRate: (currency: string) => number;

  // 操作
  fetchWalletData: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  // 初始状态
  currencies: [],
  walletBalances: [],
  exchangeRates: [],
  isLoading: false,
  error: null,

  // 计算方法
  getSupportedWalletBalances: () => {
    const { walletBalances } = get();
    // 只返回BTC, ETH, CRO这三种支持的币种
    return walletBalances.filter((balance) =>
      ["BTC", "ETH", "CRO"].includes(balance.currency),
    );
  },

  getTotalUsdBalance: () => {
    const { getSupportedWalletBalances, getUsdBalance } = get();

    return getSupportedWalletBalances().reduce((total, balance) => {
      return total + getUsdBalance(balance.currency);
    }, 0);
  },

  getUsdBalance: (currency: string) => {
    const { walletBalances, getExchangeRate } = get();
    const balance = walletBalances.find((b) => b.currency === currency);

    if (!balance) return 0;

    const rate = getExchangeRate(currency);
    return balance.amount * rate;
  },

  getCurrencyDetails: (currency: string) => {
    const { currencies } = get();
    return currencies.find((c) => c.coin_id === currency);
  },

  getExchangeRate: (currency: string) => {
    const { exchangeRates } = get();
    const rateInfo = exchangeRates.find((r) => r.from_currency === currency);

    if (!rateInfo || !rateInfo.rates || !rateInfo.rates.length) {
      return 0;
    }

    return parseFloat(rateInfo.rates[0].rate);
  },

  // 操作
  fetchWalletData: async () => {
    set({ isLoading: true, error: null });

    try {
      const [currencies, walletBalance, liveRates] = await Promise.all([
        fetchCurrencies(),
        fetchWalletBalance(),
        fetchLiveRates(),
      ]);

      set({
        currencies: currencies.currencies,
        walletBalances: walletBalance.wallet,
        exchangeRates: liveRates.tiers,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        isLoading: false,
      });
    }
  },
}));
