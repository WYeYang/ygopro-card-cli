import 'dotenv/config';
import { LSMSDK } from './label-sql-mapping-sdk/dist/sdk.js';

const sdk = new LSMSDK();

async function test() {
  console.log('=== 测试自然语言查询 ===\n');
  
  const result = await sdk.query({
    query: '找入魔效果怪兽，光属性的'
  });
  
  console.log('结果:', JSON.stringify(result, null, 2));
}

test().catch(console.error);
