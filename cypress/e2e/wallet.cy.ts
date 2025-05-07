describe("Wallet Page Tests", () => {
  beforeEach(() => {
    // 直接访问DeFi页面
    cy.visit("/");
  });

  it("should display total balance", () => {
    // 检查总余额是否显示
    cy.get(".text-4xl.font-bold").should("be.visible");
  });

  it("should display token list", () => {
    // 确保代币列表存在
    cy.get(".divide-y.divide-gray-200").should("exist");

    cy.get(".divide-y.divide-gray-200 > div").should("have.length.at.least", 1);
  });

  it("should display send and receive buttons", () => {
    // 检查发送按钮
    cy.contains("Send").should("be.visible");
    // 检查接收按钮
    cy.contains("Receive").should("be.visible");
  });

  it("should navigate to DeFi page when clicking DeFi tab", () => {
    // 点击DeFi标签
    cy.contains("DeFi").click();

    // 验证URL已更改
    cy.url().should("include", "/defi");
    cy.get("h1.text-2xl").should("contain.text", "DeFi Page");
  });
});
