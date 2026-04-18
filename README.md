# YGOPRO Card Query CLI

基于 LSM SDK 的卡片查询工具，支持自然语言查询、SQL 查询和分页。

## 安装

```bash
npm install
```

## 配置

### 1. 安装数据库配置包

```bash
npm install lsm-ygopro-database
```

### 2. 下载数据库文件

从 [YGOPRO 数据库](https://github.com/Fluorohydride/ygopro-dm) 下载 `cards.cdb` 文件，放到项目根目录。

### 3. 配置 LLM

创建 `.env` 文件：

```env
OPENAI_API_KEY=your_api_key
OPENAI_API_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo
```

## 使用

```bash
# 自然语言查询
npx lsm-cli -q "攻击力大于3000的怪兽"

# SQL 查询
npx lsm-cli -s "SELECT * FROM texts WHERE name LIKE '%青眼%'"

# 分页
npx lsm-cli -q "效果怪兽" -p 2 -ps 10

# JSON 输出
npx lsm-cli -q "攻击力3000以上" --json
```

详细配置说明见 [label-sql-mapping-sdk](https://github.com/user/label-sql-mapping-sdk)。

## 开发

```bash
pnpm build
pnpm ts-check
```
