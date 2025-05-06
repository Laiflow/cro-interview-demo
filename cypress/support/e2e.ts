// 导入命令和全局配置
import "./commands";

// 隐藏XHR请求的日志
const app = window.top;
if (
  app &&
  !app.document.head.querySelector("[data-hide-command-log-request]")
) {
  const style = app.document.createElement("style");
  style.setAttribute("data-hide-command-log-request", "");
  style.innerHTML =
    ".command-name-request, .command-name-xhr { display: none }";
  app.document.head.appendChild(style);
}

// 为问题添加更好的错误消息
Cypress.on("uncaught:exception", (err) => {
  // 返回false防止Cypress因未捕获的异常而失败
  return false;
});
