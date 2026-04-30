// 直接测试 query-executor 的逻辑，不加载完整 SDK

import { QueryExecutor } from './label-sql-mapping-sdk/dist/db/query-executor.js';
import { SqlHelper, extractWhereAndAfter, hasLimit } from './label-sql-mapping-sdk/dist/db/sql-helper.js';
import { LSMConfig } from './label-sql-mapping-sdk/dist/config/types.js';

// 模拟 config
const mockConfig: LSMConfig = {
  version: "1.0",
  name: "Test",
  id: "test",
  database: {
    type: "sqlite",
    path: ":memory:",
    tables: [
      { name: "datas", alias: "d" },
      { name: "texts", alias: "t", join: "left", on: "d.id = t.id" }
    ]
  },
  mappings: [
    { id: "name", name: "名称", value: "t.name" },
    { id: "desc", name: "效果", value: "t.desc" }
  ]
};

// 模拟 database
const mockDatabase = {
  query: (sql: string) => {
    console.log('[Database] 执行 SQL:', sql);
    if (sql.includes('COUNT(*)')) {
      // 模拟 count 查询
      if (sql.includes('LIMIT 1')) {
        return { rows: [{ total: 1 }] };
      }
      return { rows: [{ total: 14670 }] };
    }
    return { rows: [{ id: 1, name: '测试卡' }] };
  }
};

// 测试
const sqlHelper = SqlHelper.create(mockConfig);
const queryExecutor = new QueryExecutor(mockDatabase as any, sqlHelper, []);

console.log('=== 测试 1: 带 LIMIT 的 SQL ===');
const sql1 = 'SELECT d.* FROM datas AS d LEFT JOIN texts AS t ON d.id = t.id ORDER BY RANDOM() LIMIT 1';
console.log('输入 SQL:', sql1);
const whereAndAfter1 = extractWhereAndAfter(sql1);
console.log('whereAndAfter:', whereAndAfter1);
const countSql1 = sqlHelper.buildCountSql(whereAndAfter1);
console.log('countSql:', countSql1);
const result1 = queryExecutor.execute(sql1, 1, 20, 'list');
console.log('结果 total:', result1.total);
console.log();

console.log('=== 测试 2: 带 WHERE 和 LIMIT 的 SQL ===');
const sql2 = 'SELECT d.* FROM datas AS d LEFT JOIN texts AS t ON d.id = t.id WHERE d.attribute = 16 LIMIT 5';
console.log('输入 SQL:', sql2);
const whereAndAfter2 = extractWhereAndAfter(sql2);
console.log('whereAndAfter:', whereAndAfter2);
const countSql2 = sqlHelper.buildCountSql(whereAndAfter2);
console.log('countSql:', countSql2);
const result2 = queryExecutor.execute(sql2, 1, 20, 'list');
console.log('结果 total:', result2.total);