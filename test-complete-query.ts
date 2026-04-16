
import { runQuery, closeNLQuery } from './index';

(async () => {
  try {
    console.log('=== 测试多个查询 ===\n');
    
    // 测试1: 龙族怪兽
    console.log('1. 查询: 龙族怪兽');
    const dragonResult = await runQuery('龙族怪兽');
    console.log('   SQL:', dragonResult.sql);
    console.log('   返回结果数:', dragonResult.data.length);
    if (dragonResult.data.length > 0) {
      console.log('   第一个结果:', JSON.stringify(dragonResult.data[0], null, 4));
    }
    console.log('');
    
    // 测试2: 光属性怪兽
    console.log('2. 查询: 光属性怪兽');
    const lightResult = await runQuery('光属性怪兽');
    console.log('   SQL:', lightResult.sql);
    console.log('   返回结果数:', lightResult.data.length);
    if (lightResult.data.length > 0) {
      console.log('   第一个结果:', JSON.stringify(lightResult.data[0], null, 4));
    }
    console.log('');
    
    // 测试3: 通常怪兽
    console.log('3. 查询: 通常怪兽');
    const normalResult = await runQuery('通常怪兽');
    console.log('   SQL:', normalResult.sql);
    console.log('   返回结果数:', normalResult.data.length);
    if (normalResult.data.length > 0) {
      console.log('   第一个结果:', JSON.stringify(normalResult.data[0], null, 4));
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await closeNLQuery();
  }
})();
