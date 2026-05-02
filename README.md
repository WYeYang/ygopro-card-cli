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

## 查询参数说明

### extensions 参数

通过 `extensions` 参数进行精确筛选，支持多种配置类型。

```typescript
interface ExtensionInfo {
  id: string;      // 映射配置的 id
  values: string[]; // 要搜索的值
}
```

### 搜索逻辑

| 配置类型 | 判断依据 | 多 values 连接 | 多 id 连接 |
|---------|---------|--------------|-----------|
| **枚举型** | `mapping.items` 存在 | OR | AND |
| **文本型** | `mapping.items` 为空 | OR | OR |

### 使用示例

**1. 单 id 单值**
```typescript
extensions: [{ id: "attr", values: ["光"] }]
// → d.type & 31 = 1
```

**2. 单 id 多值（OR）**
```typescript
extensions: [{ id: "attr", values: ["光", "暗"] }]
// → (d.type & 31 = 1 OR d.type & 31 = 2)
```

**3. 多 id 单值**
```typescript
// 枚举型 → AND
extensions: [{ id: "attr", values: ["光"] }, { id: "race", values: ["战士族"] }]
// → (d.type & 31 = 1) AND (d.type & 16777216 = 16777216)

// 文本型 → OR
extensions: [{ id: "name", values: ["黑魔导"] }, { id: "desc", values: ["破坏"] }]
// → (t.name LIKE '%黑魔导%') OR (t.desc LIKE '%破坏%')
```

### 数值型查询

**枚举型（items）**
```typescript
// 查询等级为 6、7、8 的怪兽
extensions: [{ id: "level", values: ["6", "7", "8"] }]
// → (d.level = 6 OR d.level = 7 OR d.level = 8)
```

**支持的操作符**

| 操作符 | 示例 | 说明 |
|-------|------|-----|
| `=` | `"8"` | 精确匹配 |
| `>=` | `">=2000"` | 大于等于 |
| `<=` | `"<=1000"` | 小于等于 |
| `>` | `">3000"` | 大于 |
| `<` | `"<100"` | 小于 |
| `~` | `"~2000"` | 模糊范围 ±500 |
| `A-B` | `"1500-2000"` | 范围区间 |

```typescript
// 攻击力大于等于 2000
extensions: [{ id: "attack", values: [">=2000"] }]

// 守备力在 1500-2000 之间
extensions: [{ id: "defense", values: ["1500-2000"] }]
```

### 完整调用示例

```typescript
const result = await parseQuery({
  extensions: [
    { id: "attr", values: ["光"] },           // 枚举型 AND
    { id: "name", values: ["黑魔导", "青眼"] }, // 同 id 多值 OR
    { id: "desc", values: ["破坏"] }           // 文本型 OR
  ]
});
// → 光属性 AND (名称含黑魔导 OR 名称含青眼) AND (效果含破坏)
```

## 开发

```bash
pnpm build
pnpm ts-check
```
