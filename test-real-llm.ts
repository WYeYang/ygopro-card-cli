import 'dotenv/config';
import { AppConfigManager } from './label-sql-mapping-sdk/dist/config/app-config.js';
import { LLMManager, Stage1Result, Stage2Result } from './label-sql-mapping-sdk/dist/ai/llm-manager.js';
import { OpenAILLM } from './label-sql-mapping-sdk/dist/ai/openai-llm.js';

AppConfigManager.new();
const config = AppConfigManager.get();
const llmManager = new LLMManager(new OpenAILLM(config.getLLMConfig()));

async function test() {
  const query = '找攻击力大于600的入魔效果怪兽';
  console.log('=== 测试:', query, '===\n');
  
  // Stage1 输入
  const mainMappings = config.getMainMappingsSimplifiedText();
  console.log('Stage1 输入字符数:', mainMappings.length);
  
  // Stage1 调用
  console.log('\n--- Stage1 调用 ---');
  const t1 = Date.now();
  const stage1Result: Stage1Result = await llmManager['stage1'](query, mainMappings);
  console.log('耗时:', Date.now() - t1, 'ms');
  console.log('输出:', JSON.stringify(stage1Result));
  
  // Stage2 输入
  const matchedItems = config.searchByKeywords(stage1Result.keywords);
  console.log('\nStage2 输入字符数:', matchedItems.length);
  
  // Stage2 调用
  console.log('\n--- Stage2 调用 ---');
  const t2 = Date.now();
  const stage2Result: Stage2Result = await llmManager['stage2'](
    query,
    matchedItems,
    stage1Result.keywords,
    stage1Result.where
  );
  console.log('耗时:', Date.now() - t2, 'ms');
  console.log('输出:', JSON.stringify(stage2Result, null, 2));
}

test().catch(console.error);
