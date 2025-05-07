import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCurrencyStore } from "../currency";
import { fetchCurrencies } from "@/services/mockApi";
import { Currency } from "@/types/currency";

// Mock API calls
vi.mock("@/services/mockApi", () => ({
  fetchCurrencies: vi.fn(),
  fetchLiveRates: vi.fn(),
}));

describe("currency store", () => {
  beforeEach(() => {
    // Reset store state before each test
    useCurrencyStore.setState({
      currencies: [],
      currenciesMap: {},
      rates: {},
      isLoading: false,
      error: null,
      socketConnected: false,
    });
    vi.clearAllMocks();
  });

  describe("fetchCurrencies", () => {
    it("should fetch and store currencies", async () => {
      const mockCurrencies: Currency[] = [
        {
          coin_id: "BTC",
          name: "Bitcoin",
          symbol: "BTC",
          token_decimal: 8,
          contract_address: "",
          withdrawal_eta: 0,
          colorful_image_url: "",
          gray_image_url: "",
          is_available: true,
          is_stable: false,
          is_fiat: false,
          is_crypto: true,
          is_token: false,
          is_nft: false,
          is_game: false,
          is_dex: false,
          is_defi: false,
          is_metaverse: false,
          is_web3: false,
          is_ai: false,
          is_iot: false,
          is_other: false,
        },
        {
          coin_id: "ETH",
          name: "Ethereum",
          symbol: "ETH",
          token_decimal: 18,
          contract_address: "",
          withdrawal_eta: 0,
          colorful_image_url: "",
          gray_image_url: "",
          is_available: true,
          is_stable: false,
          is_fiat: false,
          is_crypto: true,
          is_token: false,
          is_nft: false,
          is_game: false,
          is_dex: false,
          is_defi: false,
          is_metaverse: false,
          is_web3: false,
          is_ai: false,
          is_iot: false,
          is_other: false,
        },
      ];

      (fetchCurrencies as any).mockResolvedValue({
        currencies: mockCurrencies,
      });

      await useCurrencyStore.getState().fetchCurrencies();

      const state = useCurrencyStore.getState();
      expect(state.currencies).toEqual(mockCurrencies);
      expect(state.currenciesMap).toEqual({
        BTC: mockCurrencies[0],
        ETH: mockCurrencies[1],
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should handle fetch error", async () => {
      const error = new Error("Failed to fetch");
      (fetchCurrencies as any).mockRejectedValue(error);

      await useCurrencyStore.getState().fetchCurrencies();

      const state = useCurrencyStore.getState();
      expect(state.error).toBe("Failed to fetch");
      expect(state.isLoading).toBe(false);
    });
  });

  describe("currency operations", () => {
    it("should convert between currencies", async () => {
      // Setup initial rates
      useCurrencyStore.setState({
        rates: {
          BTC: { currency: "BTC", rate: 50000, lastUpdated: Date.now() },
          ETH: { currency: "ETH", rate: 3000, lastUpdated: Date.now() },
        },
      });

      const { convertToUsd, convertFromUsd } = useCurrencyStore.getState();

      // Test conversion to USD
      expect(convertToUsd(1, "BTC")).toBe(50000);
      expect(convertToUsd(2, "ETH")).toBe(6000);

      // Test conversion from USD
      expect(convertFromUsd(50000, "BTC")).toBe(1);
      expect(convertFromUsd(6000, "ETH")).toBe(2);
    });

    it("should update currency rate", () => {
      const { updateRate, getRate } = useCurrencyStore.getState();

      updateRate("BTC", 51000);

      expect(getRate("BTC")).toBe(51000);
    });

    it("should update currency info", () => {
      const { updateCurrency, getCurrency } = useCurrencyStore.getState();
      const newCurrency: Currency = {
        coin_id: "BTC",
        name: "Bitcoin Updated",
        symbol: "BTC",
        token_decimal: 8,
        contract_address: "",
        withdrawal_eta: 0,
        colorful_image_url: "",
        gray_image_url: "",
        is_available: true,
        is_stable: false,
        is_fiat: false,
        is_crypto: true,
        is_token: false,
        is_nft: false,
        is_game: false,
        is_dex: false,
        is_defi: false,
        is_metaverse: false,
        is_web3: false,
        is_ai: false,
        is_iot: false,
        is_other: false,
      };

      updateCurrency(newCurrency);

      expect(getCurrency("BTC")).toEqual(newCurrency);
    });
  });
});
