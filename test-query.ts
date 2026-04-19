import 'dotenv/config';
import { LSMSDK } from './label-sql-mapping-sdk/dist/sdk.js';

async function main() {
  const sdk = new LSMSDK();

  console.log('\n=== 测试1: 查询攻击力大于3000的怪兽 ===');
  const result1 = await sdk.query({
    query: '攻击力大于3000的怪兽'
  });
  console.log('SQL:', result1.sql);
  console.log('总数:', result1.total);
  console.log('前3条:', result1.data.slice(0, 3).map((d: any) => ({ name: d.name, atk: d.atk })));

  console.log('\n=== 测试2: 查询名称包含"青眼"的卡 ===');
  const result2 = await sdk.query({
    query: '名称包含青眼的卡'
  });
  console.log('SQL:', result2.sql);
  console.log('总数:', result2.total);
  console.log('前3条:', result2.data.slice(0, 3).map((d: any) => ({ name: d.name })));

  console.log('\n=== 测试3: 查询光属性的效果怪兽 ===');
  const result3 = await sdk.query({
    query: '光属性的效果怪兽'
  });
  console.log('SQL:', result3.sql);
  console.log('总数:', result3.total);
  console.log('前3条:', result3.data.slice(0, 3).map((d: any) => ({ name: d.name, attribute: d.attribute })));
}

main().catch(console.error);
