// Mock API 数据
export const walletBalanceData = {
  ok: true,
  warning: "",
  wallet: [
    {
      currency: "USDT",
      amount: 1245,
    },
    {
      currency: "BTC",
      amount: 1.4,
    },
    {
      currency: "ETH",
      amount: 20.3,
    },
    {
      currency: "CRO",
      amount: 259.1,
    },
    {
      currency: "DAI",
      amount: 854,
    },
  ],
};

export const currenciesData = {
  currencies: [
    {
      coin_id: "BTC",
      name: "Bitcoin",
      symbol: "BTC",
      colorful_image_url:
        "https://s3-ap-southeast-1.amazonaws.com/monaco-cointrack-production/uploads/coin/colorful_logo/5c1246f55568a400e48ac233/bitcoin.png",
    },
    {
      coin_id: "ETH",
      name: "Ethereum",
      symbol: "ETH",
      colorful_image_url:
        "https://s3-ap-southeast-1.amazonaws.com/monaco-cointrack-production/uploads/coin/colorful_logo/5c12487d5568a4017c20a993/ethereum.png",
    },
    {
      coin_id: "CRO",
      name: "Crypto.com Coin",
      symbol: "CRO",
      colorful_image_url:
        "https://s3-ap-southeast-1.amazonaws.com/monaco-cointrack-production/uploads/coin/colorful_logo/5c1248c15568a4017c20aa87/cro.png",
    },
    {
      coin_id: "USDT",
      name: "Tether",
      symbol: "USDT",
      colorful_image_url:
        "https://s3-ap-southeast-1.amazonaws.com/monaco-cointrack-production/uploads/coin/colorful_logo/5c12487f5568a4017c20a999/tether.png",
    },
    {
      coin_id: "DAI",
      name: "dai03",
      symbol: "DAI",
      colorful_image_url:
        "https://s3-ap-southeast-1.amazonaws.com/monaco-cointrack-production/uploads/coin/colorful_logo/5e01c4cd49cde700adb27b0d/4943__1_.png",
    },
  ],
  total: 5,
  ok: true,
};

export const liveRatesData = {
  ok: true,
  warning: "",
  tiers: [
    {
      from_currency: "USDT",
      to_currency: "USD",
      rates: [{ amount: "1000", rate: "1.000727" }],
    },
    {
      from_currency: "BTC",
      to_currency: "USD",
      rates: [{ amount: "1000", rate: "10603.900000" }],
    },
    {
      from_currency: "ETH",
      to_currency: "USD",
      rates: [{ amount: "1000", rate: "340.210000" }],
    },
    {
      from_currency: "CRO",
      to_currency: "USD",
      rates: [{ amount: "1000", rate: "0.147268" }],
    },
    {
      from_currency: "DAI",
      to_currency: "USD",
      rates: [{ amount: "1000", rate: "1.001209" }],
    },
  ],
};

// 模拟API调用
export const fetchWalletBalance = (): Promise<typeof walletBalanceData> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(walletBalanceData), 500);
  });
};

export const fetchCurrencies = (): Promise<typeof currenciesData> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(currenciesData), 500);
  });
};

export const fetchLiveRates = (): Promise<typeof liveRatesData> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(liveRatesData), 500);
  });
};
