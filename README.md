# 游戏王卡片查询 CLI 工具

## 简介

ygopro-card-cli 是一个基于 Label-SQL Mapping (LSM) 规范的游戏王卡片查询命令行工具。它允许用户通过标签、SQL 条件或自然语言查询游戏王卡片数据库。

## 功能特性

- **卡片查询**：通过 SQL 条件查询卡片
- **标签管理**：查看和管理卡片标签
- **主标签查询**：查询指定卡片的主标签
- **Git 集成**：从 Git 仓库更新数据库
- **自然语言查询**：使用大模型进行自然语言查询

## 安装

```bash
# 克隆仓库
git clone https://github.com/user/ygopro-card-cli.git
cd ygopro-card-cli

# 初始化子模块
git submodule init
git submodule update

# 安装依赖
npm install
```

## 配置

### 大模型配置

创建 `llm-config.json` 文件并配置 OpenAI API 密钥：

```json
{
  "provider": "openai",
  "apiKey": "YOUR_OPENAI_API_KEY",
  "apiUrl": "https://api.openai.com/v1",
  "model": "gpt-3.5-turbo",
  "temperature": 0.7,
  "maxTokens": 1000,
  "timeout": 30000
}
```

## 使用示例

### 1. 执行卡片查询

```bash
# 基本查询
ygopro --database /path/to/card.db query "name LIKE '%青眼%'"

# 带限制和排序
ygopro --database /path/to/card.db query "type = '怪兽'" --limit 10 --sort atk --direction DESC
```

### 2. 查看标签

```bash
# 查看所有标签
ygopro --database /path/to/card.db labels

# 按名称过滤标签
ygopro --database /path/to/card.db labels --filter "属性"

# 按 ID 排序
ygopro --database /path/to/card.db labels --sort id --direction ASC
```

### 3. 查询卡片主标签

```bash
# 查询指定卡片的主标签
ygopro --database /path/to/card.db main-label 89631139
```

### 4. 从 Git 仓库更新数据库

```bash
# 从 Git 仓库更新数据库
ygopro git-update --url https://github.com/user/card-database.git --path ./db --file card.db --branch main
```

### 5. 自然语言查询

```bash
# 使用自然语言查询
ygopro --database /path/to/card.db nlp "查找所有青眼白龙相关的卡片"

# 覆盖模型和 API 密钥
ygopro --database /path/to/card.db nlp "查找所有青眼白龙相关的卡片" --model gpt-4 --api-key YOUR_API_KEY
```

## 命令帮助

使用 `--help` 选项查看命令帮助：

```bash
# 查看所有命令
ygopro --help

# 查看特定命令的帮助
ygopro query --help
ygopro nlp --help
```

## 相关项目

- [label-sql-mapping-spec](https://github.com/user/label-sql-mapping-spec) - LSM 1.0 规范文档
- [label-sql-mapping-sdk](https://github.com/user/label-sql-mapping-sdk) - LSM SDK 和 CLI 工具
- [lsm-ygopro-database](https://github.com/user/lsm-ygopro-database) - 游戏王数据库配置