import 'dotenv/config';
import { AppConfigManager } from './label-sql-mapping-sdk/dist/config/app-config.js';
import { LLMManager, Stage1Result, Stage2Result } from './label-sql-mapping-sdk/dist/ai/llm-manager.js';
import { LLM, Message } from './label-sql-mapping-sdk/dist/ai/types.js';

// Mock LLM，用于测量 token 消耗
let callCount = 0;
class MockLLM implements LLM {
  async chat(messages: Message[]): Promise<string> {
    callCount++;
    console.log(`--- LLM 调用 #${callCount} ---`);
    console.log('消息数:', messages.length);
    const totalChars = messages.reduce((sum, m) => sum + m.content.length, 0);
    console.log('总字符数:', totalChars);
    console.log('(估算 tokens: ~' + Math.round(totalChars / 2) + '-' + Math.round(totalChars / 1.5) + ')\n');
    
    // 第一个调用是 stage1，期望返回 keywords
    if (callCount === 1) {
      return JSON.stringify({ keywords: ['入魔', '光', '效果'] });
    }
    // 第二个调用是 stage2，期望返回 idValues
    return JSON.stringify({ idValues: { card_type: ['效果'], attribute: ['光'], series: ['入魔'] } });
  }
  
  async chatWithTools(messages: Message[], tools: any): Promise<any> {
    return { content: '', toolCalls: [] };
  }
}

AppConfigManager.new();
const config = AppConfigManager.get();
const llmManager = new LLMManager(new MockLLM());

async function test() {
  const query = '找入魔效果怪兽，光属性的';
  console.log('=== 测试查询:', query, '===\n');
  
  // Stage1 输入
  const mainMappings = config.getMainMappingsSimplifiedText();
  console.log('=== Stage1 ===');
  console.log('输入字符数:', mainMappings.length);
  
  // Stage1 调用
  const stage1Result: Stage1Result = await llmManager['stage1'](query, mainMappings);
  console.log('输出:', JSON.stringify(stage1Result));
  
  // Stage2 输入
  const matchedItems = config.searchByKeywords(stage1Result.keywords);
  console.log('\n=== Stage2 ===');
  console.log('输入字符数:', matchedItems.length);
  console.log('输入内容预览 (前500字):\n', matchedItems.slice(0, 500));
  
  // Stage2 调用
  const stage2Result: Stage2Result = await llmManager['stage2'](query, matchedItems, stage1Result.keywords);
  console.log('\n输出:', JSON.stringify(stage2Result));
  
  // 总计
  console.log('\n=== Token 消耗总结 ===');
  console.log('Stage1: ~426-568 tokens');
  console.log('Stage2: ~' + Math.round(matchedItems.length / 2) + '-' + Math.round(matchedItems.length / 1.5) + ' tokens');
}

test().catch(console.error);
