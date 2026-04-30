import 'dotenv/config';
// 禁用 sharp
process.env.USE_TFJS = 'true';

import { LSMSDK } from './label-sql-mapping-sdk/dist/sdk.js';

const sdk = new LSMSDK();

async function test() {
  console.log('=== 测试抽一张卡 ===\n');
  
  const result = await sdk.query({
    query: '随便抽一张卡'
  });
  
  console.log('结果 total:', result.total);
  console.log('结果 data.length:', result.data.length);
  console.log('结果 sql:', result.sql);
}

test().catch(console.error);