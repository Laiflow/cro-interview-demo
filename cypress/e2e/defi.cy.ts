describe("DeFi Page Tests", () => {
  beforeEach(() => {
    // 直接访问DeFi页面
    cy.visit("/defi");
  });

  it("should display DeFi page content", () => {
    // 验证URL正确
    cy.url().should("include", "/defi");

    // 检查DeFi页面的标题
    cy.get("h1.text-2xl").should("be.visible");
    cy.get("h1.text-2xl").should("contain.text", "DeFi Page");
  });

  it("should display common layout elements", () => {
    // 检查钱包页面的标题
    cy.get(".text-xl.font-bold").should("contain.text", "DEFI WALLET");

    // 检查是否有logo图片
    cy.get('img[alt="Crypto.com"]').should("be.visible");

    // 检查底部导航栏
    cy.get(".fixed.bottom-0").should("be.visible");
  });

  it("should have DeFi tab active", () => {
    // 验证DeFi标签处于激活状态
    cy.contains("DeFi").closest("a").should("have.class", "text-blue-500");

    // 验证Wallet标签未激活
    cy.contains("Wallet").closest("a").should("have.class", "text-gray-500");
  });

  it("should navigate to Wallet page when clicking Wallet tab", () => {
    // 点击Wallet标签
    cy.contains("Wallet").click();

    // 验证URL已更改
    cy.url().should("include", "/wallet");

    // 验证Wallet页面已加载
    cy.get(".text-4xl.font-bold").should("be.visible");
    cy.get(".divide-y.divide-gray-200").should("exist");
  });
});
