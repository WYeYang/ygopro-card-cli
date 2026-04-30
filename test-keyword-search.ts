// 测试关键词匹配效率
import { AppConfigManager } from './label-sql-mapping-sdk/src/config/app-config.js';

console.log('开始测试关键词匹配...');

try {
  const config = AppConfigManager.new('./lsm-ygopro-database');
  console.log('配置加载成功');
  
  const testInput = `根据以下项目特征，推导可能关联的数据：
id: 8491308, name: 闪刀姬-飒天, desc: 风属性以外的「闪刀姬」怪兽1只
自己对「闪刀姬-飒天」1回合只能有1次特殊召唤。
①：这张卡可以直接攻击。
②：这张卡进行战斗的伤害计算后才能发动。从卡组把1张「闪刀」卡送去墓地。, card_type: 效果, monster_type: 连接, attribute: 风, race: 机械, ocg_tcg: OCG|TCG, link: 1, atk: 1500, effect_type: 送去墓地, series: 闪刀`;
  
  console.log('\n测试输入:', testInput.substring(0, 100) + '...');
  
  // 测试多次取平均值
  const iterations = 10;
  let totalTime = 0;
  let lastResult = '';
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    const result = await config.searchByKeywords(testInput);
    const end = Date.now();
    const time = end - start;
    totalTime += time;
    
    if (i === 0) {
      lastResult = result;
      console.log(`\n第1次执行时间: ${time}ms`);
      console.log('匹配结果:');
      console.log(result);
    } else {
      console.log(`第${i + 1}次执行时间: ${time}ms`);
    }
  }
  
  const avgTime = totalTime / iterations;
  console.log(`\n平均执行时间: ${avgTime.toFixed(2)}ms (${iterations}次)`);
  
  // 分析结果
  const resultObj = JSON.parse(lastResult);
  console.log(`\n匹配到 ${resultObj.length} 个结果`);
  
} catch (error) {
  console.error('错误:', error);
  console.error('错误堆栈:', error.stack);
}
