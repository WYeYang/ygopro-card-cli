import 'dotenv/config';
import { AppConfigManager } from './label-sql-mapping-sdk/dist/config/app-config.js';

AppConfigManager.new();
const config = AppConfigManager.get();

// 测试 stage1 输入
const mainMappingsText = config.getMainMappingsSimplifiedText();
console.log('=== Stage1 输入 ===');
console.log('字符数:', mainMappingsText.length);
console.log('估算 tokens: ~' + Math.round(mainMappingsText.length / 2) + '-' + Math.round(mainMappingsText.length / 1.5));

// 模拟 stage1 返回的 keywords
const keywords = ['入魔', '光', '效果'];

// 测试 stage2 输入
const matchedItems = config.searchByKeywords(keywords);
console.log('\n=== Stage2 输入 ===');
console.log('字符数:', matchedItems.length);
console.log('估算 tokens: ~' + Math.round(matchedItems.length / 2) + '-' + Math.round(matchedItems.length / 1.5));

// 总计
console.log('\n=== Token 消耗总结 ===');
console.log('总计字符:', mainMappingsText.length + matchedItems.length);
console.log('总计估算 tokens: ~' + Math.round((mainMappingsText.length + matchedItems.length) / 2) + '-' + Math.round((mainMappingsText.length + matchedItems.length) / 1.5));
