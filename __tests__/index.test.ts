import { formatOutput } from '../index';

describe('主程序测试', () => {
  describe('formatOutput 函数', () => {
    test('应该正确格式化查询结果', () => {
      const result = {
        sql: 'SELECT * FROM cards WHERE name LIKE \'%闪刀%\'',
        data: [
          {
            id: 1,
            name: '闪刀姬-零衣',
            atk: 1500,
            def: 1500,
            level: 4,
            desc: '这是一张闪刀姬卡片'
          }
        ],
        explanation: '根据用户查询生成的SQL查询'
      };

      const output = formatOutput(result);
      expect(output).toContain('查询结果');
      expect(output).toContain('生成的SQL:');
      expect(output).toContain('SELECT * FROM cards WHERE name LIKE \'%闪刀%\'');
      expect(output).toContain('查询结果列表:');
      expect(output).toContain('1. 闪刀姬-零衣');
      expect(output).toContain('ID: 1');
      expect(output).toContain('攻击力: 1500');
      expect(output).toContain('防御力: 1500');
      expect(output).toContain('等级: 4');
      expect(output).toContain('描述:');
      expect(output).toContain('这是一张闪刀姬卡片');
      expect(output).toContain('说明:');
      expect(output).toContain('根据用户查询生成的SQL查询');
    });

    test('应该正确处理空数据的情况', () => {
      const result = {
        sql: 'SELECT * FROM cards WHERE name LIKE \'%不存在的卡片%\'',
        data: [],
        explanation: '根据用户查询生成的SQL查询'
      };

      const output = formatOutput(result);
      expect(output).toContain('没有找到相关数据');
    });

    test('应该正确处理缺少字段的情况', () => {
      const result = {
        sql: 'SELECT * FROM cards WHERE name LIKE \'%闪刀%\'',
        data: [
          {
            id: 1,
            name: '闪刀姬-零衣'
          }
        ]
      };

      const output = formatOutput(result);
      expect(output).toContain('1. 闪刀姬-零衣');
      expect(output).toContain('ID: 1');
      expect(output).not.toContain('攻击力:');
      expect(output).not.toContain('防御力:');
      expect(output).not.toContain('等级:');
      expect(output).not.toContain('描述:');
    });
  });

  // 暂时跳过 runQuery 测试，因为它需要实际连接数据库和调用 LLM API
  // 这些测试更适合作为集成测试，而不是单元测试
  describe.skip('runQuery 函数', () => {
    test('应该能够执行查询并返回结果', async () => {
      // 这个测试会实际执行查询，可能需要较长时间
      // 我们只测试基本功能，不测试具体结果
      const { runQuery } = await import('../index');
      const result = await runQuery('闪刀');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
    }, 30000); // 设置较长的超时时间，因为需要调用LLM API
  });
});
