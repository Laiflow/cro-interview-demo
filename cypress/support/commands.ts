/// <reference types="cypress" />

// 此文件允许向Cypress添加新的自定义命令

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * 自定义命令：确保特定路由已经加载
       * @example cy.ensureRouteLoaded('/wallet')
       */
      ensureRouteLoaded(route: string): Chainable<Element>;

      /**
       * 自定义命令：验证钱包页面已正确加载
       * @example cy.checkWalletPageLoaded()
       */
      checkWalletPageLoaded(): Chainable<Element>;

      /**
       * 自定义命令：验证DeFi页面已正确加载
       * @example cy.checkDeFiPageLoaded()
       */
      checkDeFiPageLoaded(): Chainable<Element>;
    }
  }
}

// 确保特定路由已加载
Cypress.Commands.add("ensureRouteLoaded", (route: string) => {
  cy.url().should("include", route);
  cy.get("body").should("be.visible");
});

// 检查钱包页面加载
Cypress.Commands.add("checkWalletPageLoaded", () => {
  cy.get(".text-4xl.font-bold").should("be.visible"); // 检查总资产显示
  cy.get(".divide-y.divide-gray-200").should("be.visible"); // 检查代币列表容器
});

// 检查DeFi页面加载
Cypress.Commands.add("checkDeFiPageLoaded", () => {
  cy.get("h1.text-2xl").should("be.visible").contains("DeFi Page");
});

export {};
