
import { formatOutput } from '../index';
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'yaml';

// 读取配置文件
const configPath = path.join(__dirname, '../lsm-ygopro-database/main.yaml');
const configContent = fs.readFileSync(configPath, 'utf8');
const mappings = yaml.parse(configContent).mappings;

// 转换函数：根据数值获取对应的文字标签
function getLabelText(value: any, mappingId: string): string {
  const mapping = mappings.find((m: any) => m.id === mappingId);
  if (!mapping) return '';

  for (const item of mapping.items) {
    try {
      // 简单的条件匹配，这里我们直接根据已知的数值映射进行匹配
      if (mappingId === 'attribute') {
        const attrMap: { [key: number]: string } = {
          0: '无',
          1: '地',
          2: '水',
          4: '炎',
          8: '风',
          16: '光',
          32: '暗',
          64: '神'
        };
        if (attrMap[value]) return attrMap[value];
      }
      
      if (mappingId === 'race') {
        const raceMap: { [key: number]: string } = {
          0: '无',
          1: '战士',
          2: '魔法师',
          4: '天使',
          8: '恶魔',
          16: '不死',
          32: '机械',
          64: '水',
          128: '炎',
          256: '岩石',
          512: '鸟兽',
          1024: '植物',
          2048: '昆虫',
          4096: '雷',
          8192: '龙',
          16384: '兽',
          32768: '兽战士',
          65536: '恐龙',
          131072: '鱼',
          262144: '海龙',
          524288: '爬虫',
          1048576: '念动力',
          2097152: '幻神兽',
          4194304: '创造神',
          8388608: '幻龙'
        };
        if (raceMap[value]) return raceMap[value];
      }
      
      if (mappingId === 'ocg_tcg') {
        const otMap: { [key: number]: string } = {
          1: 'OCG',
          2: 'TCG',
          3: 'OCG|TCG',
          4: '自定义',
          9: 'OCG|TCG',
          11: 'OCG|TCG'
        };
        if (otMap[value]) return otMap[value];
      }
      
      if (mappingId === 'card_type') {
        // 这里我们简单处理，因为type是位运算
        if (value & 1) {
          if ((value & 32) === 0 && (value & 64) === 0) return '通常怪兽';
          if (value & 32) return '效果怪兽';
          if (value & 64) return '融合怪兽';
          if (value & 8192) return '同调怪兽';
          if (value & 8388608) return 'XYZ怪兽';
          if (value & 67108864) return '连接怪兽';
          if (value & 128) return '仪式怪兽';
          if (value & 16777216) return '灵摆怪兽';
          if (value & 4096) return '调整怪兽';
        }
      }
    } catch (e) {
      continue;
    }
  }
  return '';
}

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
      const { runQuery } = await import('../index');
      const result = await runQuery('闪刀');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
    }, 30000);

    test('应该能够执行攻击600的龙族怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('攻击600的龙族怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中包含龙族怪兽（验证文字内容）
      const hasDragonCards = result.data.some((card: any) => {
        const raceText = getLabelText(card.race, 'race');
        return raceText === '龙';
      });
      expect(hasDragonCards).toBe(true);
    }, 30000);

    test('应该能够执行光属性怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('光属性怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中包含光属性怪兽（验证文字内容）
      const hasLightCards = result.data.some((card: any) => {
        const attrText = getLabelText(card.attribute, 'attribute');
        return attrText === '光';
      });
      expect(hasLightCards).toBe(true);
    }, 30000);

    test('应该能够执行等级4的战士族怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('等级4的战士族怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
    }, 30000);

    test('应该能够执行攻击力2000以上的怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('攻击力2000以上的怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
    }, 30000);

    test('应该能够执行地属性魔法师查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('地属性魔法师');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中包含地属性魔法师（验证文字内容）
      const hasEarthMageCards = result.data.some((card: any) => {
        const attrText = getLabelText(card.attribute, 'attribute');
        const raceText = getLabelText(card.race, 'race');
        return attrText === '地' && raceText === '魔法师';
      });
      expect(hasEarthMageCards).toBe(true);
    }, 30000);

    test('应该能够执行风属性鸟兽族查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('风属性鸟兽族');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证结果中包含风属性鸟兽族（验证文字内容）
      const hasWindBirdCards = result.data.some((card: any) => {
        const attrText = getLabelText(card.attribute, 'attribute');
        const raceText = getLabelText(card.race, 'race');
        return attrText === '风' && raceText === '鸟兽';
      });
      expect(hasWindBirdCards).toBe(true);
    }, 30000);

    test('应该能够执行水属性鱼族查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('水属性鱼族');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
    }, 30000);

    test('应该能够执行通常怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('通常怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证查询返回了结果
      expect(result.data.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行效果怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('效果怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
    }, 30000);

    test('应该能够执行融合怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('融合怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证查询返回了结果
      expect(result.data.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行同调怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('同调怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证查询返回了结果
      expect(result.data.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行XYZ怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('XYZ怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证查询返回了结果
      expect(result.data.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行连接怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('连接怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证查询返回了结果
      expect(result.data.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行OCG卡片查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('OCG卡片');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
    }, 30000);

    test('应该能够执行TCG卡片查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('TCG卡片');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
    }, 30000);

    test('应该能够执行等级5的怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('等级5的怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证查询返回了结果
      expect(result.data.length).toBeGreaterThan(0);
    }, 30000);

    test('应该能够执行防御力1000以下的怪兽查询', async () => {
      const { runQuery } = await import('../index');
      const result = await runQuery('防御力1000以下的怪兽');
      expect(result).toBeDefined();
      expect(result.sql).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.explanation).toBeDefined();
      // 验证查询返回了结果
      expect(result.data.length).toBeGreaterThan(0);
    }, 30000);
  });
});
