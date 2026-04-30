// 简单测试文件，验证基本功能
import { AppConfigManager } from './label-sql-mapping-sdk/src/config/app-config.js';

console.log('测试开始...');

try {
  const config = AppConfigManager.new('./lsm-ygopro-database');
  console.log('配置加载成功');
  
  // 测试搜索
  config.searchByKeywords('黑魔术师').then(result =&gt; {
    console.log('搜索结果:', result);
  });
} catch (error) {
  console.error('错误:', error);
}
