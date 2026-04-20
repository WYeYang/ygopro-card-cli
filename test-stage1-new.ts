import { AppConfigManager } from './label-sql-mapping-sdk/dist/config/app-config.js';
import { LLMManager, Stage1Result, Stage2Result } from './label-sql-mapping-sdk/dist/ai/llm-manager.js';
import { LLM, Message } from './label-sql-mapping-sdk/dist/ai/types.js';

AppConfigManager.new();
const config = AppConfigManager.get();

let callCount = 0;
class MockLLM implements LLM {
  async chat(messages: Message[]): Promise<string> {
    callCount++;
    console.log(`\n--- LLM 调用 #${callCount} ---`);
    console.log('消息数:', messages.length);
    const totalChars = messages.reduce((sum, m) => sum + m.content.length, 0);
    console.log('总字符数:', totalChars);
    
    if (callCount === 1) {
      // Stage1
      return JSON.stringify({
        where: "d.atk > 600",
        keywords: ["入魔", "效果"]
      });
    } else {
      // Stage2
      return JSON.stringify({
        where: "d.atk > 600 AND d.type & 32 > 0 AND d.setcode & 0xFFF = 10",
        limit: 10,
        explanation: "查询攻击力大于600的入魔效果怪兽",
        extensions: [
          { id: "card_type", values: ["效果"] },
          { id: "series", values: ["入魔"] }
        ]
      });
    }
  }
  
  async chatWithTools(messages: Message[], tools: any): Promise<any> {
    return { content: '', toolCalls: [] };
  }
}

const llmManager = new LLMManager(new MockLLM());

async function test() {
  console.log('=== 测试: 找攻击力大于600的入魔效果怪兽 ===\n');
  
  // Stage1 输入
  const mainMappings = config.getMainMappingsSimplifiedText();
  console.log('Stage1 输入字符数:', mainMappings.length);
  
  // Stage1 调用
  const stage1Result: Stage1Result = await llmManager['stage1']('找攻击力大于600的入魔效果怪兽', mainMappings);
  console.log('\nStage1 输出:', JSON.stringify(stage1Result));
  
  // Stage2 输入
  const matchedItems = config.searchByKeywords(stage1Result.keywords);
  console.log('\nStage2 输入字符数:', matchedItems.length);
  
  // Stage2 调用
  const stage2Result: Stage2Result = await llmManager['stage2'](
    '找攻击力大于600的入魔效果怪兽',
    matchedItems,
    stage1Result.keywords,
    stage1Result.where
  );
  console.log('\nStage2 输出:', JSON.stringify(stage2Result));
}

test().catch(console.error);
