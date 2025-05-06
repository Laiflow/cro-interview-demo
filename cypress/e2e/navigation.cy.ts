describe("Navigation Tests", () => {
  it("should redirect to wallet page by default", () => {
    // 访问根路径
    cy.visit("/");

    // 应该自动导航到钱包页面
    cy.url().should("include", "/wallet");
  });

  it("should navigate between wallet and defi pages", () => {
    // 访问钱包页面
    cy.visit("/wallet");

    // 点击DeFi标签
    cy.contains("DeFi").click();

    // 验证URL已更改为DeFi
    cy.url().should("include", "/defi");

    // 点击Wallet标签
    cy.contains("Wallet").click();

    // 验证URL已更改回钱包
    cy.url().should("include", "/wallet");
  });

  it("should show 404 page for invalid routes", () => {
    // 访问无效路径
    cy.visit("/invalid-path", { failOnStatusCode: false });

    // 应该显示NotFound页面
    cy.get("body").should("contain.text", "Not Found");
  });

  it("should have working footer navigation", () => {
    // 访问钱包页面
    cy.visit("/wallet");

    // 检查底部导航
    cy.get(".fixed.bottom-0").should("be.visible");

    // 检查导航按钮
    cy.contains("Wallet").should("be.visible");
    cy.contains("DeFi").should("be.visible");
  });

  it("should highlight active tab correctly", () => {
    // 访问钱包页面并验证激活状态
    cy.visit("/wallet");
    cy.contains("Wallet").closest("a").should("have.class", "text-blue-500");
    cy.contains("DeFi").closest("a").should("have.class", "text-gray-500");

    // 访问DeFi页面并验证激活状态
    cy.visit("/defi");
    cy.contains("Wallet").closest("a").should("have.class", "text-gray-500");
    cy.contains("DeFi").closest("a").should("have.class", "text-blue-500");
  });
});
