import { AppConfigManager } from './label-sql-mapping-sdk/dist/config/app-config.js';

AppConfigManager.new();

// 测试关键词搜索
const keywords = ['入魔', '光', '效果'];
console.log('关键词:', keywords);
console.log('\n=== 匹配结果（只返回有 items 的 mapping）===\n');

const result = AppConfigManager.get().searchByKeywords(keywords);
console.log(result);
console.log('\n--- 不再有 desc ---');
