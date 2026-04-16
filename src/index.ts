#!/usr/bin/env node

import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { LSMSDK, NLPQuery, LLMManager } from 'label-sql-mapping-sdk';
import { DBConfig } from 'label-sql-mapping-sdk/dist/db';
import { DatabaseType } from 'label-sql-mapping-sdk/dist/config';
import { LLMConfig } from 'label-sql-mapping-sdk/dist/ai';

dotenv.config();

// 简单的配置管理类
class AppConfigManager {
  private config: any;
  private configPath: string;

  constructor(configPath: string) {
    this.configPath = configPath;
    this.config = {};
  }

  load() {
    if (fs.existsSync(this.configPath)) {
      const content = fs.readFileSync(this.configPath, 'utf8');
      this.config = JSON.parse(content);
    }
  }

  getDatabasePath(): string | null {
    return this.config.database?.path || null;
  }

  getLLMConfig(): LLMConfig {
    const llmConfig = this.config.llm || {};
    return {
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY || llmConfig.apiKey || '',
      baseUrl: process.env.OPENAI_API_URL || llmConfig.apiUrl || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      model: process.env.OPENAI_MODEL || llmConfig.model || 'qwen3.5-flash',
      temperature: llmConfig.temperature || 0.7,
      maxTokens: llmConfig.maxTokens || 500
    };
  }
}

const configPath = path.join(__dirname, '..', 'lsm-ygopro-database', 'main.yaml');
const appConfigPath = path.join(__dirname, '..', 'config.json');

const appConfigManager = new AppConfigManager(appConfigPath);
appConfigManager.load();

const dbPath = appConfigManager.getDatabasePath();
const llmConfig = appConfigManager.getLLMConfig();

if (!dbPath) {
  console.error('错误: 请在 config.json 中配置数据库文件路径');
  process.exit(1);
}

const dbConfig: DBConfig = { type: 'sqlite' as DatabaseType, path: dbPath };
const sdk = new LSMSDK(configPath, dbConfig);
const llmManager = new LLMManager(llmConfig);
const nlpQuery = new NLPQuery(sdk.getDatabase(), llmManager, configPath);

const query = process.argv.slice(2).join(' ');

if (!query) {
  console.error('错误: 请输入查询内容');
  process.exit(1);
}

(async () => {
  try {
    const result = await nlpQuery.execute({ query });
    
    console.log('\n========================================');
    console.log('查询结果');
    console.log('========================================');
    
    if (result.sql) {
      console.log('\n生成的SQL:');
      console.log('------------------------------------------------');
      console.log(result.sql);
      console.log('------------------------------------------------');
    }
    
    if (result.results && result.results.length > 0) {
      console.log('\n卡片列表:');
      console.log('------------------------------------------------');
      result.results.forEach((card: any, index: number) => {
        console.log(`\n${index + 1}. ${card.name}`);
        console.log(`   ID: ${card.id}`);
        if (card.atk) console.log(`   攻击力: ${card.atk}`);
        if (card.def) console.log(`   防御力: ${card.def}`);
        if (card.level) console.log(`   等级: ${card.level}`);
        if (card.desc) {
          console.log('   效果:');
          console.log(`   ${card.desc.replace(/\r\n/g, '\n   ')}`);
        }
      });
      console.log('------------------------------------------------');
    } else {
      console.log('\n没有找到相关卡片');
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
      await sdk.close();
    } catch (closeError) {
      console.warn('关闭数据库连接时出错:', (closeError as Error).message);
    }
  }
})();
