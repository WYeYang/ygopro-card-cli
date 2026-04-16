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

  // 测试 runQuery 函数的实际功能
  describe('runQuery 函数', () => {
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

    test('应该能够执行攻击600的龙族怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('攻击600的龙族怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中是否包含攻击力为600的龙族怪兽
      const dragonCards = result.data.filter((card: any) => card.race === 8192 && card.atk === 600);
      expect(dragonCards.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行光属性怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('光属性怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中是否包含光属性怪兽
      const lightAttributeCards = result.data.filter((card: any) => card.attribute === 16);
      expect(lightAttributeCards.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行等级4的战士族怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('等级4的战士族怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中是否包含等级4的战士族怪兽
      const warriorCards = result.data.filter((card: any) => card.race === 1 && card.level === 4);
      expect(warriorCards.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行攻击力2000以上的怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('攻击力2000以上的怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中是否包含攻击力2000以上的怪兽
      const strongCards = result.data.filter((card: any) => card.atk >= 2000);
      expect(strongCards.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行地属性魔法师查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('地属性魔法师');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中是否包含地属性魔法师
      const earthMageCards = result.data.filter((card: any) => card.attribute === 1 && card.race === 2);
      expect(earthMageCards.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行风属性鸟兽族查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('风属性鸟兽族');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中是否包含风属性鸟兽族
      const windBirdCards = result.data.filter((card: any) => card.attribute === 8 && card.race === 512);
      expect(windBirdCards.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行水属性鱼族查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('水属性鱼族');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中是否包含水属性鱼族
      const waterFishCards = result.data.filter((card: any) => card.attribute === 2 && card.race === 131072);
      expect(waterFishCards.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行通常怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('通常怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中是否包含通常怪兽
      const normalMonsters = result.data.filter((card: any) => (card.type & 1) && ((card.type & 32) === 0) && ((card.type & 64) === 0));
      expect(normalMonsters.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行效果怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('效果怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中是否包含效果怪兽
      const effectMonsters = result.data.filter((card: any) => (card.type & 1) && (card.type & 32));
      expect(effectMonsters.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行融合怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('融合怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中是否包含融合怪兽
      const fusionMonsters = result.data.filter((card: any) => (card.type & 1) && (card.type & 64));
      expect(fusionMonsters.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行同调怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('同调怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中是否包含同调怪兽
      const synchroMonsters = result.data.filter((card: any) => (card.type & 1) && (card.type & 8192));
      expect(synchroMonsters.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行XYZ怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('XYZ怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中是否包含XYZ怪兽
      const xyzMonsters = result.data.filter((card: any) => (card.type & 1) && (card.type & 8388608));
      expect(xyzMonsters.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行连接怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('连接怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中是否包含连接怪兽
      const linkMonsters = result.data.filter((card: any) => (card.type & 1) && (card.type & 67108864));
      expect(linkMonsters.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行OCG卡片查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('OCG卡片');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中是否包含OCG卡片
      const ocgCards = result.data.filter((card: any) => card.ocg_tcg === 1 || card.ocg_tcg === 3 || card.ocg_tcg === 9 || card.ocg_tcg === 11);
      expect(ocgCards.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行TCG卡片查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('TCG卡片');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中是否包含TCG卡片
      const tcgCards = result.data.filter((card: any) => card.ocg_tcg === 2 || card.ocg_tcg === 3 || card.ocg_tcg === 9 || card.ocg_tcg === 11);
      expect(tcgCards.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行等级5的怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('等级5的怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中是否包含等级5的怪兽
      const level5Monsters = result.data.filter((card: any) => (card.type & 1) && card.level === 5);
      expect(level5Monsters.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行防御力1000以下的怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('防御力1000以下的怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中是否包含防御力1000以下的怪兽
      const lowDefMonsters = result.data.filter((card: any) => (card.type & 1) && ((card.type & 67108864) === 0) && card.def <= 1000);
      expect(lowDefMonsters.length).toBeGreaterThan(0);
    }, 30000);
  });
});
