#!/usr/bin/env node

// 游戏王卡片查询CLI工具

const { Command } = require('commander');
const { LSMSDK } = require('label-sql-mapping-sdk');
const { DBConfig } = require('label-sql-mapping-sdk/dist/db');
const { LabelQuery } = require('label-sql-mapping-sdk/dist/label');
const { GitManager, GitConfig } = require('label-sql-mapping-sdk/dist/git');
const { LLMManager, NLPQuery } = require('label-sql-mapping-sdk/dist/ai');
const path = require('path');

// 配置文件路径
const configPath = path.join(__dirname, 'lsm-ygopro-database', 'main.yaml');
const llmConfigPath = path.join(__dirname, 'llm-config.json');
let dbPath = '';
let llmConfig = null;

// 读取大模型配置
try {
  const fs = require('fs');
  if (fs.existsSync(llmConfigPath)) {
    llmConfig = JSON.parse(fs.readFileSync(llmConfigPath, 'utf8'));
  }
} catch (error) {
  console.warn('警告: 无法读取大模型配置文件:', error.message);
}

// 创建命令行解析器
const program = new Command();

// 版本信息
program
  .version('1.0.0')
  .description('游戏王卡片查询CLI工具');

// 全局选项
program
  .option('-d, --database <path>', '数据库文件路径');

// 查询命令
program
  .command('query')
  .description('执行卡片查询')
  .argument('<condition>', 'SQL条件')
  .option('-l, --limit <number>', '限制返回数量')
  .option('-o, --offset <number>', '偏移量')
  .option('-s, --sort <field>', '排序字段')
  .option('-d, --direction <direction>', '排序方向 (ASC/DESC)')
  .action(async (condition, options) => {
    try {
      // 验证参数
      if (!dbPath) {
        console.error('错误: 请指定数据库文件路径');
        process.exit(1);
      }
      
      // 初始化SDK
      const dbConfig = {
        type: 'sqlite',
        path: dbPath
      };
      
      const sdk = new LSMSDK(configPath, dbConfig);
      
      // 执行查询
      const result = await sdk.query(condition, {
        limit: options.limit ? parseInt(options.limit) : undefined,
        offset: options.offset ? parseInt(options.offset) : undefined,
        orderBy: options.sort,
        orderDirection: options.direction
      });
      
      // 显示结果
      console.log('查询结果:');
      result.rows.forEach(card => {
        console.log(`ID: ${card.id}`);
        console.log(`名称: ${card.name}`);
        console.log(`类型: ${card.type}`);
        console.log(`属性: ${card.attribute}`);
        console.log(`种族: ${card.race}`);
        console.log(`攻击力: ${card.atk}`);
        console.log(`防御力: ${card.def}`);
        console.log('---');
      });
      
      // 关闭SDK
      await sdk.close();
    } catch (error) {
      console.error(`错误: ${error.message}`);
      process.exit(1);
    }
  });

// 标签命令
program
  .command('labels')
  .description('管理标签')
  .option('-f, --filter <filter>', '标签过滤条件')
  .option('-s, --sort <field>', '排序字段 (id/name)')
  .option('-d, --direction <direction>', '排序方向 (ASC/DESC)')
  .action(async (options) => {
    try {
      // 验证参数
      if (!dbPath) {
        console.error('错误: 请指定数据库文件路径');
        process.exit(1);
      }
      
      // 初始化SDK
      const dbConfig = {
        type: 'sqlite',
        path: dbPath
      };
      
      const sdk = new LSMSDK(configPath, dbConfig);
      
      // 创建标签查询实例
      const labelQuery = new LabelQuery(sdk.getConfig(), sdk.getDatabase());
      
      // 查询标签
      const labels = await labelQuery.getLabels({
        filter: options.filter,
        sortBy: options.sort,
        sortDirection: options.direction
      });
      
      // 显示结果
      console.log('标签列表:');
      labels.forEach(label => {
        console.log(`- ${label.id}: ${label.name} (${label.items.length}个项)`);
      });
      
      // 关闭SDK
      await sdk.close();
    } catch (error) {
      console.error(`错误: ${error.message}`);
      process.exit(1);
    }
  });

// 主标签查询命令
program
  .command('main-label')
  .description('查询指定卡片的主标签')
  .argument('<id>', '卡片ID')
  .action(async (id) => {
    try {
      // 验证参数
      if (!dbPath) {
        console.error('错误: 请指定数据库文件路径');
        process.exit(1);
      }
      
      // 初始化SDK
      const dbConfig = {
        type: 'sqlite',
        path: dbPath
      };
      
      const sdk = new LSMSDK(configPath, dbConfig);
      
      // 创建标签查询实例
      const labelQuery = new LabelQuery(sdk.getConfig(), sdk.getDatabase());
      
      // 查询主标签
      const mainLabels = await labelQuery.getMainLabel(id);
      
      // 显示结果
      console.log('卡片主标签:');
      mainLabels.forEach(label => {
        console.log(`- ${label.labelName}: ${label.itemName}`);
      });
      
      // 关闭SDK
      await sdk.close();
    } catch (error) {
      console.error(`错误: ${error.message}`);
      process.exit(1);
    }
  });

// Git更新命令
program
  .command('git-update')
  .description('从Git仓库更新数据库')
  .option('-u, --url <url>', 'Git仓库URL')
  .option('-b, --branch <branch>', 'Git分支')
  .option('-p, --path <path>', '本地存储路径')
  .option('-f, --file <file>', '数据库文件路径（相对于仓库根目录）')
  .action(async (options) => {
    try {
      // 验证参数
      if (!options.url) {
        console.error('错误: 请指定Git仓库URL');
        process.exit(1);
      }
      
      if (!options.path) {
        console.error('错误: 请指定本地存储路径');
        process.exit(1);
      }
      
      if (!options.file) {
        console.error('错误: 请指定数据库文件路径');
        process.exit(1);
      }
      
      // 创建Git配置
      const gitConfig = {
        repoUrl: options.url,
        branch: options.branch,
        localPath: options.path,
        databaseFile: options.file
      };
      
      // 初始化Git管理器
      const gitManager = new GitManager(gitConfig);
      
      // 初始化仓库
      await gitManager.initialize();
      
      // 更新仓库
      const result = await gitManager.update();
      
      // 显示结果
      console.log(`Git更新结果: ${result.message}`);
      if (result.updated) {
        console.log(`新提交: ${result.newCommit}`);
        console.log(`旧提交: ${result.oldCommit}`);
      }
      
      // 检查数据库文件
      if (gitManager.databaseExists()) {
        console.log(`数据库文件位置: ${gitManager.getDatabasePath()}`);
      } else {
        console.error('错误: 数据库文件不存在');
        process.exit(1);
      }
    } catch (error) {
      console.error(`错误: ${error.message}`);
      process.exit(1);
    }
  });

// 自然语言查询命令
program
  .command('nlp')
  .description('自然语言查询卡片')
  .argument('<query>', '自然语言查询语句')
  .option('-m, --model <model>', '大模型名称')
  .option('-k, --api-key <key>', 'API密钥')
  .action(async (query, options) => {
    try {
      // 验证参数
      if (!dbPath) {
        console.error('错误: 请指定数据库文件路径');
        process.exit(1);
      }
      
      // 初始化SDK
      const dbConfig = {
        type: 'sqlite',
        path: dbPath
      };
      
      const sdk = new LSMSDK(configPath, dbConfig);
      
      // 初始化大模型管理器
      const finalLlmConfig = {
        provider: llmConfig?.provider || 'openai',
        apiKey: options.apiKey || llmConfig?.apiKey,
        apiUrl: llmConfig?.apiUrl || 'https://api.openai.com/v1',
        model: options.model || llmConfig?.model || 'gpt-3.5-turbo',
        temperature: llmConfig?.temperature || 0.7,
        maxTokens: llmConfig?.maxTokens || 1000,
        timeout: llmConfig?.timeout || 30000
      };
      
      if (!finalLlmConfig.apiKey) {
        console.error('错误: 请指定API密钥');
        process.exit(1);
      }
      
      const llmManager = new LLMManager(finalLlmConfig);
      
      // 初始化自然语言查询
      const nlpQuery = new NLPQuery(sdk.getDatabase(), llmManager);
      
      // 执行查询
      const result = await nlpQuery.execute({ query });
      
      // 显示结果
      console.log('自然语言查询结果:');
      console.log(`生成的SQL: ${result.sql}`);
      console.log('查询结果:');
      result.results.forEach(card => {
        console.log(`ID: ${card.id}`);
        console.log(`名称: ${card.name}`);
        console.log(`类型: ${card.type}`);
        console.log('---');
      });
      if (result.explanation) {
        console.log(`解释: ${result.explanation}`);
      }
      
      // 关闭SDK
      await sdk.close();
    } catch (error) {
      console.error(`错误: ${error.message}`);
      process.exit(1);
    }
  });

// 解析命令行参数
program.parse(process.argv);

// 获取全局选项
const globalOptions = program.opts();
dbPath = globalOptions.database || '';

// 验证必要参数
if (!dbPath && program.args.length > 0 && program.args[0] !== 'git-update') {
  console.error('错误: 请指定数据库文件路径');
  process.exit(1);
}
