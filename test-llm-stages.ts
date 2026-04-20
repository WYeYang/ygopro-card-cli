import 'dotenv/config';
import { AppConfigManager } from './label-sql-mapping-sdk/dist/config/app-config.js';
import { LLMManager } from './label-sql-mapping-sdk/dist/ai/llm-manager.js';

AppConfigManager.new();
const config = AppConfigManager.get();
const llmManager = new LLMManager(config);

async function testStages() {
  const query = '找入魔效果怪兽，光属性的';
  
  console.log('=== 测试查询:', query, '===\n');
  
  // 获取主配置（带 values）
  const mainMappingsText = config.getMainMappingsSimplifiedText();
  console.log('Stage1 输入字符数:', mainMappingsText.length);
  
  // Stage 1
  console.log('\n--- Stage 1: 提取关键词 ---');
  const stage1Start = Date.now();
  const stage1Result = await llmManager['stage1'](query, mainMappingsText);
  console.log('结果:', JSON.stringify(stage1Result));
  console.log('耗时:', Date.now() - stage1Start, 'ms');
  
  if (stage1Result?.keywords?.length) {
    // 模拟搜索结果
    const matchedItems = config.searchByKeywords(stage1Result.keywords);
    console.log('\nStage2 输入字符数:', matchedItems.length);
    
    // Stage 2
    console.log('\n--- Stage 2: 解析查询 ---');
    const stage2Start = Date.now();
    const stage2Result = await llmManager['stage2'](query, matchedItems, stage1Result.keywords);
    console.log('结果:', JSON.stringify(stage2Result));
    console.log('耗时:', Date.now() - stage2Start, 'ms');
  }
}

testStages().catch(console.error);
