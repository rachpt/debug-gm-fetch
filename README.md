# Debug GM-Fetch

这是一个用于调试 `@sec-ant/gm-fetch` 的项目，包含一个简单的 Node.js 服务器和一个使用 Vite + vite-plugin-monkey 构建的油猴脚本。

## 项目结构

- `server.js` - 简单的 Express 服务器，提供 `/api/echo` API
- `public/` - 静态文件目录，包含 HTML 页面
- `userscript/` - 油猴脚本项目目录
  - `src/main.ts` - 油猴脚本源代码
  - `vite.config.ts` - Vite 配置文件

## 安装依赖

```bash
# 安装主项目和油猴脚本项目的依赖
npm run setup
```

## 开发

```bash
# 同时启动服务器和油猴脚本开发服务器
npm run dev

# 或者分别启动
npm run dev:server    # 启动 Express 服务器
npm run dev:userscript  # 启动油猴脚本开发服务器
```

## 使用方法

1. 启动开发服务器后，访问 http://localhost:8080
2. 在油猴扩展中安装开发服务器提供的脚本（通常是 http://localhost:5173/gm-fetch-debug-userscript.user.js）
3. 刷新页面，页面上会出现一个输入框、一个按钮和一个结果显示区域
4. 在输入框中输入要发送的内容（JSON 格式），点击按钮发送请求
5. 结果会显示在结果显示区域

## 构建油猴脚本

```bash
npm run build:userscript
```

构建后的脚本位于 `userscript/dist` 目录下。
