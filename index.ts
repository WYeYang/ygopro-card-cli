#!/usr/bin/env node

import * as path from 'path';
import { NaturalLanguageQuery } from 'label-sql-mapping-sdk';

const configPath = path.join(__dirname, '..', 'lsm-ygopro-database', 'main.yaml');
const appConfigPath = path.join(__dirname, '..', 'config.json');

const query = process.argv.slice(2).join(' ');

if (!query) {
  console.error('错误: 请输入查询内容');
  process.exit(1);
}

(async () => {
  const nlQuery = new NaturalLanguageQuery(appConfigPath, configPath);
  
  try {
    const result = await nlQuery.query(query);
    
    console.log('\n========================================');
    console.log('查询结果');
    console.log('========================================');
    
    if (result.sql) {
      console.log('\n生成的SQL:');
      console.log('------------------------------------------------');
      console.log(result.sql);
      console.log('------------------------------------------------');
    }
    
    if (result.data && result.data.length > 0) {
      console.log('\n查询结果列表:');
      console.log('------------------------------------------------');
      result.data.forEach((item: any, index: number) => {
        console.log(`\n${index + 1}. ${item.name}`);
        console.log(`   ID: ${item.id}`);
        if (item.atk !== undefined) console.log(`   攻击力: ${item.atk}`);
        if (item.def !== undefined) console.log(`   防御力: ${item.def}`);
        if (item.level !== undefined) console.log(`   等级: ${item.level}`);
        if (item.desc) {
          console.log('   描述:');
          console.log(`   ${item.desc.replace(/\r\n/g, '\n   ')}`);
        }
      });
      console.log('------------------------------------------------');
    } else {
      console.log('\n没有找到相关数据');
    }
    
    if (result.explanation) {
      console.log('\n说明:');
      console.log('------------------------------------------------');
      console.log(result.explanation);
      console.log('------------------------------------------------');
    }
    
    console.log('========================================\n');
  } catch (error) {
    console.error('错误:', (error as Error).message);
  } finally {
    try {
      await nlQuery.close();
    } catch (closeError) {
      console.warn('关闭数据库连接时出错:', (closeError as Error).message);
    }
  }
})();
