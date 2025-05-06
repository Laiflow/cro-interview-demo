import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import routes from "@/routes";

import "@/styles/tailwind.css";
import QueryProvider from "./components/QueryProvider";

const container = document.getElementById("app");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <QueryProvider>{routes}</QueryProvider>
  </BrowserRouter>,
);
