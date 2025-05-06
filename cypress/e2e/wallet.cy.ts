describe("Wallet Page Tests", () => {
  beforeEach(() => {
    // 访问主页，应该重定向或默认路由到钱包页面
    cy.visit("/");
    // 确保钱包页面已加载
    cy.url().should("include", "/wallet");
  });

  it("should display wallet header with logo", () => {
    // 检查钱包页面的标题
    cy.get(".text-xl.font-bold").should("contain.text", "DEFI WALLET");
    // 检查是否有logo图片
    cy.get('img[alt="Crypto.com"]').should("be.visible");
  });

  it("should display total balance", () => {
    // 检查总余额是否显示
    cy.get(".text-4xl.font-bold").should("be.visible");
    cy.get(".text-4xl.font-bold").should("contain.text", "USD");
  });

  it("should display token list", () => {
    // 确保代币列表存在
    cy.get(".divide-y.divide-gray-200").should("exist");

    // 检查是否至少有一个代币显示
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

    // 验证DeFi页面内容已加载
    cy.get("h1.text-2xl").should("contain.text", "DeFi Page");
  });
});
