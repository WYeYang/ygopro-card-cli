import { AppConfigManager } from './label-sql-mapping-sdk/dist/config/app-config.js';

AppConfigManager.new();
const config = AppConfigManager.get();

// 1. 查看所有 mappings
console.log('=== 所有 mappings ===');
const allMappings = config.getExtensions();
console.log('数量:', allMappings.length);
allMappings.forEach(m => console.log('-', m.id, ':', m.items?.length || 0, 'items'));

// 2. 主配置中有没有 atk
console.log('\n=== 主配置（Stage1 输入）===');
const mainMappings = config.getMainMappingsSimplifiedText();
console.log(mainMappings);

// 3. 测试 searchByKeywords
console.log('\n=== searchByKeywords(["攻击", "600"]) ===');
const result = config.searchByKeywords(['攻击', '600']);
console.log(result || '(无匹配)');
