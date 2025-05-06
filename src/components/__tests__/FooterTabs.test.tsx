import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { FooterTabs } from "../../pages/Layout";

// 测试工具组件
const TestWrapper: React.FC<{ initialRoute: string }> = ({ initialRoute }) => {
  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="*" element={<FooterTabs />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("FooterTabs", () => {
  it("renders wallet and defi tabs", () => {
    render(<TestWrapper initialRoute="/wallet" />);

    expect(screen.getByText("Wallet")).toBeTruthy();
    expect(screen.getByText("DeFi")).toBeTruthy();
  });

  it("highlights the wallet tab when on wallet route", () => {
    render(<TestWrapper initialRoute="/wallet" />);

    const walletLink = screen.getByText("Wallet").closest("a");
    const defiLink = screen.getByText("DeFi").closest("a");

    expect(walletLink?.className.includes("text-blue-500")).toBeTruthy();
    expect(defiLink?.className.includes("text-gray-500")).toBeTruthy();
  });

  it("highlights the defi tab when on defi route", () => {
    render(<TestWrapper initialRoute="/defi" />);

    const walletLink = screen.getByText("Wallet").closest("a");
    const defiLink = screen.getByText("DeFi").closest("a");

    expect(walletLink?.className.includes("text-gray-500")).toBeTruthy();
    expect(defiLink?.className.includes("text-blue-500")).toBeTruthy();
  });
});
