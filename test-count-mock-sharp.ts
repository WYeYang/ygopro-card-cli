import 'dotenv/config';

// Mock sharp 模块
import Module from 'module';
const originalRequire = Module.prototype.require;
Module.prototype.require = function (path: string) {
  if (path === 'sharp') {
    return {};
  }
  return originalRequire.call(this, path);
};

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