# Aladdin Frontend

一个基于 React + TypeScript + Webpack 构建的现代化前端应用，提供 AI 代理平台的用户界面。

## 🚀 特性

- ⚡️ **现代化技术栈**: React 19 + TypeScript + Webpack 5
- 🎨 **美观界面**: TailwindCSS + Lucide React 图标
- 🔥 **高性能**: SWC 编译器，构建速度更快
- 📱 **响应式设计**: 移动端友好的用户界面
- 🛣️ **客户端路由**: React Router Dom 支持
- 🎯 **状态管理**: Immer 不可变状态管理
- 🔧 **开发体验**: 热重载 + 现代开发工具链

## 📋 系统要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0

## 🛠️ 安装

```bash
# 克隆项目
git clone https://github.com/Aladdin-5/aladdin-frontend.git
cd aladdin-frontend

# 安装依赖
pnpm install
```

## 🏃‍♂️ 开发

```bash
# 启动开发服务器 (推荐)
pnpm run start:serve

# 构建开发版本
pnpm run start:dev

# 构建生产版本
pnpm run start:prod

# 运行测试
pnpm run test
```

开发服务器启动后，打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
aladdin-frontend/
├── public/                 # 静态资源
│   └── index.html         # HTML 模板
├── src/                   # 源代码
│   ├── components/        # 可复用组件
│   ├── layouts/          # 布局组件
│   ├── pages/            # 页面组件
│   ├── hooks/            # 自定义 Hooks
│   ├── utils/            # 工具函数
│   ├── types/            # TypeScript 类型定义
│   ├── assets/           # 静态资源
│   ├── constants/        # 常量定义
│   ├── service/          # API 服务
│   ├── states/           # 状态管理
│   ├── connections/      # 区块链连接
│   ├── abis/             # 智能合约 ABI
│   ├── lib/              # 第三方库配置
│   ├── App.tsx           # 根组件
│   ├── index.tsx         # 应用入口
│   └── index.css         # 全局样式
├── config/               # Webpack 配置
│   ├── webpack.development.js
│   └── webpack.production.js
├── webpack.config.js     # Webpack 主配置
├── tailwind.config.js    # TailwindCSS 配置
├── postcss.config.js     # PostCSS 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目配置
```

## 🎨 技术栈

### 核心框架
- **React 19** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **React Router Dom** - 客户端路由

### 构建工具
- **Webpack 5** - 模块打包器
- **SWC** - 高性能编译器（替代 Babel）
- **PostCSS** - CSS 后处理器

### 样式和 UI
- **TailwindCSS** - 实用优先的 CSS 框架
- **Lucide React** - 现代化图标库

### 状态管理
- **Immer** - 不可变状态更新库

### 开发工具
- **Webpack Dev Server** - 开发服务器
- **Hot Module Replacement** - 热模块替换
- **CSS Loader** - CSS 模块处理
- **Mini CSS Extract Plugin** - CSS 提取插件

## 🔧 配置

### 路径别名

项目配置了以下路径别名，方便模块导入：

```typescript
// 使用示例
import Header from '@/components/Header';
import { userApi } from '@/service/userApi';
import { UserType } from '@/types/user';
```

可用别名：
- `@/` → `src/`
- `@components/` → `src/components/`
- `@hooks/` → `src/hooks/`
- `@pages/` → `src/pages/`
- `@layouts/` → `src/layouts/`
- `@assets/` → `src/assets/`
- `@states/` → `src/states/`
- `@service/` → `src/service/`
- `@utils/` → `src/utils/`
- `@lib/` → `src/lib/`
- `@constants/` → `src/constants/`
- `@connections/` → `src/connections/`
- `@abis/` → `src/abis/`
- `@types/` → `src/types/`

### 环境配置

创建 `.env` 文件来配置环境变量：

```env
# API 配置
REACT_APP_API_URL=https://api.example.com
REACT_APP_WS_URL=wss://ws.example.com

# 区块链配置
REACT_APP_CHAIN_ID=1
REACT_APP_RPC_URL=https://mainnet.infura.io/v3/your-key

# 其他配置
REACT_APP_ENV=development
```

## 📦 构建部署

```bash
# 构建生产版本
pnpm run start:prod

# 构建文件将输出到 dist/ 目录
```

构建后的文件可以部署到任何静态文件服务器，如：
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Nginx

## 🧪 测试

```bash
# 运行测试
pnpm run test

# 运行测试覆盖率
pnpm run test:coverage
```

## 📄 脚本说明

- `start:serve` - 启动开发服务器（带热重载）
- `start:dev` - 构建开发版本
- `start:prod` - 构建生产版本
- `test` - 运行测试套件

## 🤝 贡献指南

1. Fork 这个仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📝 开发规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 和 Prettier 代码规范
- 组件使用函数式组件 + Hooks
- 样式优先使用 TailwindCSS
- 提交信息遵循 [Conventional Commits](https://conventionalcommits.org/)

## 🔍 故障排除

### 常见问题

**1. 依赖安装失败**
```bash
# 清理缓存重新安装
pnpm store prune
rm -rf node_modules
pnpm install
```

**2. 构建失败**
```bash
# 检查 Node.js 版本
node --version  # 需要 >= 16.0.0

# 检查 TypeScript 配置
npx tsc --noEmit
```

**3. 热重载不工作**
```bash
# 重启开发服务器
pnpm run start:serve
```

## 📜 许可证

ISC

## 👥 维护者

- [@yourusername](https://github.com/yourusername)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

---

如果你觉得这个项目有帮助，请给它一个 ⭐️！