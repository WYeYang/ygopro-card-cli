import { AppConfigManager } from './label-sql-mapping-sdk/dist/config/app-config.js';
import { LLMManager } from './label-sql-mapping-sdk/dist/ai/llm-manager.js';

AppConfigManager.new();
const config = AppConfigManager.get();
const llmManager = new LLMManager(config);

async function test() {
  const query = '找入魔效果怪兽，光属性的';
  
  // Stage1 输入
  const mainMappings = config.getMainMappingsSimplifiedText();
  console.log('=== Stage1 输入 ===');
  console.log('字符数:', mainMappings.length);
  console.log('(估算 tokens: ~' + Math.round(mainMappings.length / 2) + '-' + Math.round(mainMappings.length / 1.5) + ')');
  
  // Stage1 调用
  console.log('\n--- Stage1 调用中... ---');
  const stage1Start = Date.now();
  const stage1Result = await llmManager['stage1'](query, mainMappings);
  console.log('耗时:', Date.now() - stage1Start + 'ms');
  console.log('输出:', JSON.stringify(stage1Result));
  
  // Stage2 输入
  const matchedItems = config.searchByKeywords(stage1Result?.keywords || []);
  console.log('\n=== Stage2 输入 ===');
  console.log('字符数:', matchedItems.length);
  console.log('(估算 tokens: ~' + Math.round(matchedItems.length / 2) + '-' + Math.round(matchedItems.length / 1.5) + ')');
  
  // Stage2 调用
  console.log('\n--- Stage2 调用中... ---');
  const stage2Start = Date.now();
  const stage2Result = await llmManager['stage2'](query, matchedItems, stage1Result?.keywords || []);
  console.log('耗时:', Date.now() - stage2Start + 'ms');
  console.log('输出:', JSON.stringify(stage2Result));
}

test().catch(console.error);
