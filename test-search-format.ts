import 'dotenv/config';
import { AppConfigManager } from './label-sql-mapping-sdk/dist/config/app-config.js';

async function test() {
  const configManager = AppConfigManager.get();
  await configManager.init();
  
  console.log('=== 测试 searchByKeywords ===\n');
  
  const result = await configManager.searchByKeywords('DD');
  console.log('返回结果:', result);
}

test().catch(console.error);