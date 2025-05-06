# Crypto.com DeFi Wallet Demo

## 项目简介

这是一个基于React的加密货币钱包仪表盘Demo，提供了以下功能：
- 查看总资产价值（USD）
- 显示BTC、ETH、CRO等币种的余额和美元价值
- 通过底部标签导航切换钱包和DeFi功能

## 技术栈

- React 19.0
- React Router v7
- Zustand（状态管理）
- React Query（数据获取）
- TailwindCSS（样式）
- Vitest（单元测试）
- Cypress（E2E测试）

## 项目结构

```
src/
├── components/         # 可复用组件
│   ├── TokenItem.tsx   # 单个币种组件
│   ├── TokenList.tsx   # 币种列表组件
│   ├── WalletDashboard.tsx # 钱包仪表盘组件
│   └── __tests__/      # 组件测试文件
├── hooks/              # 自定义React钩子
│   └── useWalletData.ts # 获取钱包数据钩子
├── pages/              # 页面组件
│   ├── DeFi/           # DeFi页面
│   │   └── index.tsx   # DeFi页面组件
│   ├── Layout/         # 页面布局
│   │   ├── FooterTabs.tsx # 底部导航
│   │   ├── MainLayout.tsx # 主布局
│   │   └── index.ts    # 布局组件导出
│   ├── Wallet/         # 钱包页面
│   │   └── index.tsx   # 钱包页面组件
│   └── NotFound.tsx    # 404页面
├── routes/             # 路由配置
│   └── index.tsx       # 路由定义
├── store/              # 状态管理
│   └── walletStore.ts  # 钱包状态
├── styles/             # 样式文件
│   └── tailwind.css    # TailwindCSS入口
└── utils/              # 工具函数
    └── mockApi.ts      # 模拟API数据
```

## 编码规范

### 组件组织原则

1. **就近原则**：组件及其相关资源（如样式、测试、辅助函数）应放置在同一目录下，或尽可能接近使用它们的地方。

2. **公共组件收口**：所有可重用的公共组件统一放在 `components` 目录下进行管理和维护。

3. **最近交集父目录**：多个模块共享的组件应放置在它们最近的共同父目录下。例如，如果组件在模块A和模块B中都使用，则应放在包含这两个模块的父目录下。

### 组件命名规范

1. **原子组件**：基础UI组件使用 `Atom` 前缀或`Atom`文件夹下，例如 `AtomButton`、`AtomInput`。

2. **有机体组件**：特定功能的独立部分使用 `Organism` 前缀或`Organism`文件夹下，例如 `OrganismNavigation`。

3. **页面组件**：包含完整页面的组件直接使用描述性名称，如 `WalletPage`、`HomePage`。

### 文件命名与组织

- 组件文件使用 PascalCase 命名（如 `TokenItem.tsx`）
- 非组件文件使用 camelCase 命名（如 `walletStore.ts`）
- 测试文件与被测试的文件名对应，并添加 `.test` 或 `.spec` 后缀

## 特性

### 路由结构

应用使用嵌套路由结构：
- `/` - 应用根目录，使用主布局
  - `/wallet` - 钱包页面（默认）
  - `/defi` - DeFi页面

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

## 测试

### 单元测试

应用包含以下单元测试：
- TokenItem组件测试
- TokenList组件测试
- FooterTabs组件测试

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

运行 `yarn test:e2e` 执行所有E2E测试，或者运行 `yarn cy:open` 打开Cypress UI手动运行测试。
