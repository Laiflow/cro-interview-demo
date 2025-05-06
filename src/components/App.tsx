import React from "react";

import Layout from "@/components/Layout";
import routes from "@/routes";
import QueryProvider from "./QueryProvider";

// 导入 TailwindCSS
import "../styles/tailwind.css";

const App = (): React.ReactElement => {
  return (
    <QueryProvider>
      <Layout>{routes}</Layout>
    </QueryProvider>
  );
};

export default App;
