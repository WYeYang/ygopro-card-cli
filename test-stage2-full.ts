import { LLMManager, Stage2Result } from './label-sql-mapping-sdk/dist/ai/llm-manager.js';
import { LLM, Message } from './label-sql-mapping-sdk/dist/ai/types.js';

// Mock LLM
class MockLLM implements LLM {
  async chat(messages: Message[]): Promise<string> {
    return JSON.stringify({
      where: "d.type & 32 > 0 AND d.attribute = 16 AND d.setcode & 0xFFF = 10",
      limit: 10,
      explanation: "查询入魔系列的光属性效果怪兽",
      extensions: [
        { id: "card_type", values: ["效果"] },
        { id: "attribute", values: ["光"] },
        { id: "series", values: ["入魔"] }
      ]
    });
  }
  
  async chatWithTools(messages: Message[], tools: any): Promise<any> {
    return { content: '', toolCalls: [] };
  }
}

const llmManager = new LLMManager(new MockLLM());

async function test() {
  console.log('=== 测试 stage2 输出完整格式 ===\n');
  
  const result: Stage2Result = await llmManager['stage2'](
    '找入魔效果怪兽',
    'series:\n  - value: 入魔\n    condition: d.setcode & 0xFFF = 10\ncard_type:\n  - value: 效果\n    condition: (d.type & 1) > 0 AND (d.type & 32) > 0',
    ['入魔', '效果']
  );
  
  console.log('stage2 输出:');
  console.log(JSON.stringify(result, null, 2));
}

test().catch(console.error);
