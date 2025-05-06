import { render } from "@/utils/rtl-wrapper";
import userEvent from "@testing-library/user-event";
import React from "react";
import { expect, it } from "vitest";

import App from "@/components/App";

it("can browse to the count page", () => {
  const { getByText, findByText } = render(<App />);
  expect(getByText("Wallet")).toBeTruthy();
  userEvent.click(getByText("Wallet"));
  expect(findByText("Defi")).toBeTruthy();
});
