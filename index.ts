#!/usr/bin/env node

import * as path from 'path';
import { NaturalLanguageQuery } from 'label-sql-mapping-sdk';

// 使用绝对路径，确保无论从哪里调用都能正确找到配置文件
const rootDir = path.resolve(__dirname, '..');
const configPath = path.join(rootDir, 'lsm-ygopro-database', 'main.yaml');
const appConfigPath = path.join(rootDir, 'config.yaml');

// 单例模式，确保只创建一个 NaturalLanguageQuery 实例
let nlQueryInstance: NaturalLanguageQuery | null = null;

/**
 * 获取 NaturalLanguageQuery 实例
 * @returns NaturalLanguageQuery 实例
 */
function getNLQueryInstance() {
  if (!nlQueryInstance) {
    nlQueryInstance = new NaturalLanguageQuery(appConfigPath, configPath);
  }
  return nlQueryInstance;
}

/**
 * 执行自然语言查询并格式化输出结果
 * @param query 自然语言查询
 * @returns 查询结果
 */
export async function runQuery(query: string) {
  const nlQuery = getNLQueryInstance();
  
  try {
    const result = await nlQuery.query(query);
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * 关闭 NaturalLanguageQuery 实例
 */
export async function closeNLQuery() {
  if (nlQueryInstance) {
    try {
      await nlQueryInstance.close();
      nlQueryInstance = null;
    } catch (closeError) {
      console.warn('关闭数据库连接时出错:', (closeError as Error).message);
    }
  }
}

/**
 * 格式化并输出查询结果
 * @param result 查询结果
 */
export function formatOutput(result: any) {
  let output = '\n========================================\n';
  output += '查询结果\n';
  output += '========================================\n';
  
  if (result.sql) {
    output += '\n生成的SQL:\n';
    output += '------------------------------------------------\n';
    output += result.sql + '\n';
    output += '------------------------------------------------\n';
  }
  
  if (result.data && result.data.length > 0) {
    output += '\n查询结果列表:\n';
    output += '------------------------------------------------\n';
    result.data.forEach((item: any, index: number) => {
      output += `\n${index + 1}. ${item.name}\n`;
      output += `   ID: ${item.id}\n`;
      if (item.atk !== undefined) output += `   攻击力: ${item.atk}\n`;
      if (item.def !== undefined) output += `   防御力: ${item.def}\n`;
      if (item.level !== undefined) output += `   等级: ${item.level}\n`;
      if (item.desc) {
        output += '   描述:\n';
        output += `   ${item.desc.replace(/\r\n/g, '\n   ')}\n`;
      }
    });
    output += '------------------------------------------------\n';
  } else {
    output += '\n没有找到相关数据\n';
  }
  
  if (result.explanation) {
    output += '\n说明:\n';
    output += '------------------------------------------------\n';
    output += result.explanation + '\n';
    output += '------------------------------------------------\n';
  }
  
  output += '========================================\n';
  return output;
}

// 如果直接运行此文件，则执行查询
if (require.main === module) {
  const query = process.argv.slice(2).join(' ');
  
  if (!query) {
    console.error('错误: 请输入查询内容');
    process.exit(1);
  }
  
  (async () => {
    try {
      const result = await runQuery(query);
      console.log(formatOutput(result));
    } catch (error) {
      console.error('错误:', (error as Error).message);
    } finally {
      // 程序结束时关闭 NaturalLanguageQuery 实例
      await closeNLQuery();
    }
  })();
}
