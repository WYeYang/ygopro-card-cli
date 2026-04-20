import 'dotenv/config';
import { AppConfigManager } from './label-sql-mapping-sdk/dist/config/app-config.js';

AppConfigManager.new();
const config = AppConfigManager.get();

// 测试 stage1 输入
const mainMappingsText = config.getMainMappingsSimplifiedText();
console.log('=== Stage1 Input ===');
console.log('主配置字符数:', mainMappingsText.length);
console.log('主配置内容:\n', mainMappingsText);
console.log('\n');

// 测试 stage2 输入（模拟关键词搜索结果）
const keywords = ['入魔', '光', '效果'];
const matchedItemsText = config.searchByKeywords(keywords);
console.log('=== Stage2 Input ===');
console.log('匹配的 items 字符数:', matchedItemsText.length);
console.log('匹配的内容:\n', matchedItemsText);
