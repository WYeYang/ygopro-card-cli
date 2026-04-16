#!/usr/bin/env node

import * as path from 'path';
import * as fs from 'fs';
import { LSMSDK } from 'label-sql-mapping-sdk';

// 查找配置文件路径
let rootDir = process.cwd();
while (!fs.existsSync(path.join(rootDir, 'config.yaml')) && rootDir !== '/') {
  rootDir = path.dirname(rootDir);
}
if (rootDir === '/') {
  rootDir = path.resolve(__dirname, '..');
}

const configPath = path.join(rootDir, 'lsm-ygopro-database', 'main.yaml');
const appConfigPath = path.join(rootDir, 'config.yaml');

// 命令行入口
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'query') {
    const query = args.find(a => a.startsWith('--query='))?.replace('--query=', '');
    const sql = args.find(a => a.startsWith('--sql='))?.replace('--sql=', '');
    const page = parseInt(args.find(a => a.startsWith('--page='))?.replace('--page=', '') || '1');
    const pageSize = parseInt(args.find(a => a.startsWith('--page-size='))?.replace('--page-size=', '') || '20');

    if (!query && !sql) {
      console.error('错误: 请提供 --query 或 --sql 参数');
      process.exit(1);
    }

    (async () => {
      try {
        const sdk = await LSMSDK.fromAppConfig(appConfigPath, configPath);
        const result = await sdk.query({ query, sql, page, pageSize });
        console.log(JSON.stringify(result, null, 2));
      } catch (error) {
        console.error('错误:', (error as Error).message);
        process.exit(1);
      }
    })();

  } else if (command === '--help' || command === '-h') {
    console.log('用法:');
    console.log('  query --query="黑魔导" --page=1 --page-size=20  - 自然语言查询');
    console.log('  query --sql="SELECT ..." --page=1 --page-size=20  - SQL查询');

  } else if (args.length > 0) {
    const query = args.join(' ');

    (async () => {
      try {
        const sdk = await LSMSDK.fromAppConfig(appConfigPath, configPath);
        const result = await sdk.query({ query, page: 1, pageSize: 20 });
        console.log(JSON.stringify(result, null, 2));
      } catch (error) {
        console.error('错误:', (error as Error).message);
        process.exit(1);
      }
    })();

  } else {
    console.log('用法:');
    console.log('  query --query="黑魔导" --page=1 --page-size=20  - 自然语言查询');
    console.log('  query --sql="SELECT ..." --page=1 --page-size=20  - SQL查询');
  }
}
