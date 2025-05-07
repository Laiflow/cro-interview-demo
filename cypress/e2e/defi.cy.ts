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

  it("should have DeFi tab active", () => {
    cy.wait(100);
    cy.get('a[href="/defi"]').should("have.class", "text-blue-500");
    cy.get('a[href="/wallet"]').should("have.class", "text-gray-500");
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
