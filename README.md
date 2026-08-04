# Ticking iCal Service

一个将专注时间数据导出为 iCal 格式的 Cloudflare Worker 服务。

## 🚀 功能特性

- 📊 从 todo.i99yun.com API (v3) 获取专注时间数据
- 📅 转换为标准 iCal (RFC 5545) 格式
- 🌍 支持时区处理和转换
- 📱 返回可导入任何日历应用的 .ics 文件
- ⚡ 基于 Cloudflare Workers，全球边缘计算
- 🔒 安全的 token 验证机制

## 📋 系统要求

- Node.js 16+ 
- npm 或 yarn
- Cloudflare 账户

## 🛠️ 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd ticking-ical-service
```

### 2. 安装依赖

```bash
npm install
```

### 3. 登录 Cloudflare

```bash
npx wrangler login
```

### 4. 部署到生产环境

```bash
npm run deploy
```

### 5. 本地开发

```bash
npm run dev
```

## 📖 使用方法

### API 端点

```
GET https://your-worker.your-subdomain.workers.dev/
```

### 必需参数

| 参数 | 类型 | 描述 |
|------|------|------|
| `token` | string | API 访问令牌 |
| `userId` | string/number | 用户 ID |

### 示例请求

```bash
curl "https://ticking-ical-service.your-subdomain.workers.dev/?token=YOUR_TOKEN&userId=12345"
```

### 示例响应

```
Content-Type: text/calendar; charset=utf-8
Content-Disposition: attachment; filename="focus.ics"

BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//i99yun//FocusTime Export//CN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:uuid-example@i99yun
DTSTAMP:20240123T120000Z
DTSTART:20240123T090000Z
DTEND:20240123T100000Z
SUMMARY:专注学习
END:VEVENT
END:VCALENDAR
```

## 📱 支持的日历应用

- 🍎 Apple Calendar (macOS/iOS)
- 📧 Google Calendar
- 📮 Microsoft Outlook
- 🗓️ Mozilla Thunderbird
- 📅 其他支持 iCal 标准的应用

## 🔧 开发命令

```bash
# 本地开发服务器
npm run dev

# 部署到生产环境
npm run deploy
```

## 📁 项目结构

```
ticking-ical-service/
├── main.js           # 主要的 Worker 代码
├── wrangler.toml     # Cloudflare Worker 配置
├── package.json      # 项目依赖和脚本
├── .gitignore        # Git 忽略文件
└── README.md         # 项目文档
```

## ⚠️ 错误处理

| 状态码 | 描述 | 解决方案 |
|--------|------|----------|
| 400 | 缺少必需参数 | 检查 token 和 userId 参数 |
| 502 | 上游 API 请求失败 | 检查 token 有效性和网络连接 |
| 500 | 数据格式错误 | 联系 API 提供方 |

## 🔐 安全注意事项

- ⚠️ 不要在 URL 中暴露敏感的 token
- 🔒 建议使用 HTTPS 访问
- 🚫 不要在客户端代码中硬编码 token
- 📝 定期轮换 API token

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🐛 问题反馈

如果遇到问题，请在 [Issues](../../issues) 页面提交。

## 📚 相关文档

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [iCal 规范 (RFC 5545)](https://tools.ietf.org/html/rfc5545)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)