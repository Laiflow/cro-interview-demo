import React from "react";
import { render, screen } from "@testing-library/react";
import TokenList from "../TokenList";
import { WalletBalance } from "../../store/walletStore";
import { vi, describe, it, expect } from "vitest";

// 模拟TokenItem组件
vi.mock("../TokenItem", () => ({
  default: ({ token }: { token: WalletBalance }) => (
    <div data-testid={`token-item-${token.currency}`}>{token.currency}</div>
  ),
}));

describe("TokenList", () => {
  it("renders the token list with items", () => {
    const mockTokens: WalletBalance[] = [
      { currency: "BTC", amount: 1.4 },
      { currency: "ETH", amount: 20.3 },
    ];

    render(<TokenList tokens={mockTokens} />);

    expect(screen.getByTestId("token-item-BTC")).toBeTruthy();
    expect(screen.getByTestId("token-item-ETH")).toBeTruthy();
  });

  it("shows empty message when no tokens are provided", () => {
    render(<TokenList tokens={[]} />);

    expect(screen.getByText("No tokens found in your wallet.")).toBeTruthy();
  });
});
