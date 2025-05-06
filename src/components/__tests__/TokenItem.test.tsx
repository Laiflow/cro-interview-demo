import React from "react";
import { render, screen } from "@testing-library/react";
import TokenItem from "../TokenItem";
import { WalletBalance, useWalletStore } from "../../store/walletStore";
import { vi, describe, it, expect, beforeEach } from "vitest";

// 模拟 zustand store
vi.mock("../../store/walletStore", () => ({
  useWalletStore: vi.fn(),
}));

describe("TokenItem", () => {
  const mockToken: WalletBalance = {
    currency: "BTC",
    amount: 1.4,
  };

  const mockCurrencyDetails = {
    coin_id: "BTC",
    name: "Bitcoin",
    symbol: "BTC",
    colorful_image_url: "bitcoin.png",
  };

  beforeEach(() => {
    (useWalletStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      getCurrencyDetails: vi.fn().mockReturnValue(mockCurrencyDetails),
      getUsdBalance: vi.fn().mockReturnValue(14000),
    });
  });

  it("renders currency information correctly", () => {
    render(<TokenItem token={mockToken} />);

    expect(screen.getByText("Bitcoin")).toBeTruthy();
    expect(screen.getByText("BTC")).toBeTruthy();
    expect(screen.getByText("1.4 BTC")).toBeTruthy();
    expect(screen.getByText("$ 14000.00")).toBeTruthy();
    expect(screen.getByAltText("Bitcoin").getAttribute("src")).toBe(
      "bitcoin.png",
    );
  });

  it("returns null when currency details are not found", () => {
    (useWalletStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      getCurrencyDetails: vi.fn().mockReturnValue(null),
      getUsdBalance: vi.fn().mockReturnValue(0),
    });

    const { container } = render(<TokenItem token={mockToken} />);
    expect(container.firstChild).toBeNull();
  });
});
