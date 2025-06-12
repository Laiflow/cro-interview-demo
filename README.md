# Crypto.com DeFi Wallet Demo

## 项目简介

React+Vite 加密货币钱包Demo，提供了以下功能：

- 查看总资产价值（USD）
- 显示BTC、ETH、CRO等币种的余额和法币价值

## 技术栈

- React 19.0
- React Router v7
- TypeScript 5
- Zustand（状态管理）
- React Query（数据获取管理）
- TailwindCSS（样式）
- Vite（构建工具）
- Vitest（单元测试）
- Cypress（E2E测试）
- decimal.js（精确数值计算）
- Socket.io（实时数据推送）

## 测试

### 单元测试

应用包含以下单元测试：components,hooks,utils,store
运行 `yarn test` 执行所有单元测试。

### E2E测试

应用包含以下E2E测试：

- 钱包页面功能测试
- DeFi页面功能测试
- 导航功能测试
  主要测试以下功能：
- 页面正确渲染和加载
- 钱包余额和币种列表显示
- 页面间导航
- 底部标签栏高亮显示

运行 `yarn test:e2e` 执行E2E测试，或者运行 `yarn cy:open` 打开Cypress UI手动运行测试。

## 项目结构

```
src/
├── components/        # 可复用组件
│   ├── atom/         # 原子组件
│   │   ├── Button/   # 按钮组件
│   │   ├── Input/    # 输入框组件
│   │   └── ...       # 其他基础UI组件
│   ├── organism/     # 有机体组件
│   │   ├── PrettyAmountCoin.tsx  # 金额展示组件
│   │   ├── PrettyPrice.tsx       # 价格展示组件
│   │   └── ...       # 其他复杂组件
│   └── __tests__/    # 组件测试文件
├── hooks/            # 自定义React钩子
│   └── useWalletData.ts # 获取钱包数据钩子
├── pages/            # 页面组件
│   ├── DeFi/         # DeFi页面
│   │   └── index.tsx # DeFi页面组件
│   ├── Layout/       # 页面布局
│   │   ├── FooterTabs.tsx # 底部导航
│   │   ├── MainLayout.tsx # 主布局
│   │   └── index.ts  # 布局组件导出
│   ├── Wallet/       # 钱包页面
│   │   └── index.tsx # 钱包页面组件
│   └── NotFound.tsx  # 404页面
├── routes/           # 路由配置
│   └── index.tsx     # 路由定义
├── store/            # 状态管理
│   └── walletStore.ts # 钱包状态
├── styles/           # 样式文件
│   └── tailwind.css  # TailwindCSS入口
└── utils/            # 工具函数
    └── mockApi.ts    # 模拟API数据
```

## 编码规范

### 组件组织原则

1. **原子设计原则**：组件按照原子设计方法论进行组织：

   - `atom/`: 基础UI组件，如按钮、输入框等
   - `organism/`: 由多个原子组件组合而成的复杂组件

2. **就近原则**：组件及其相关资源（如样式、测试、辅助函数）应放置在同一目录下，或尽可能接近使用它们的地方。

3. **公共组件收口**：所有可重用的公共组件统一放在 `components` 目录下进行管理和维护。

### 组件命名规范

1. **原子组件（Atom）**：

   - 位于 `components/atom/` 目录下
   - 基础UI组件，如按钮、输入框、图标等
   - 命名示例：`Button`、`Input`、`Icon`

2. **有机体组件（Organism）**：

   - 位于 `components/organism/` 目录下
   - 由多个原子组件组合而成的复杂组件
   - 命名示例：`PrettyAmountCoin`、`PrettyPrice`

3. **页面组件**：
   - 位于 `pages/` 目录下
   - 包含完整页面的组件
   - 命名示例：`WalletPage`、`HomePage`

### 文件命名与组织

- 组件文件使用 PascalCase 命名（如 `PrettyAmountCoin.tsx`）
- 非组件文件使用 camelCase 命名（如 `walletStore.ts`）
- 测试文件与被测试的文件名对应，并添加 `.test` 或 `.spec` 后缀

## 特性

### 状态管理

使用Zustand管理钱包相关状态：

- 钱包余额数据
- 币种信息
- 汇率数据
- 计算总余额和USD价值

### 接口模拟

使用内置的模拟数据实现API：

- 获取钱包余额
- 获取币种信息
- 获取实时汇率

## 快速开始

```bash
# 安装依赖
yarn

# 启动开发服务器
yarn dev

# 运行单元测试
yarn test

# 运行E2E测试（启动开发服务器并运行Cypress测试）
yarn test:e2e

# 打开Cypress UI
yarn cy:open

# 构建生产版本
yarn dist
```
