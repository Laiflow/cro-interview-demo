describe("Navigation Tests", () => {
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

    cy.contains("Wallet").should("be.visible");
    cy.contains("DeFi").should("be.visible");
  });

  it("should highlight active tab correctly", () => {
    cy.visit("/wallet");
    cy.contains("Wallet").closest("a").should("have.class", "text-blue-500");
    cy.contains("DeFi").closest("a").should("have.class", "text-gray-500");

    cy.visit("/defi");
    cy.wait(100);
    cy.get('a[href="/defi"]').should("have.class", "text-blue-500");
    cy.get('a[href="/wallet"]').should("have.class", "text-gray-500");
  });
});
