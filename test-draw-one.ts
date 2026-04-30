import 'dotenv/config';
import { LSMSDK } from './label-sql-mapping-sdk/dist/sdk.js';

const sdk = new LSMSDK();

async function test() {
  console.log('=== 测试抽一张卡 ===\n');
  
  const result = await sdk.query({
    query: '随便抽一张卡',
    mode: 'list'
  });
  
  console.log('结果:', JSON.stringify(result, null, 2));
}

test().catch(console.error);