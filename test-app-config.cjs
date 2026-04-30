const { AppConfigManager } = require('./label-sql-mapping-sdk/dist/config/app-config');
const path = require('path');

async function test() {
  console.log('正在加载 AppConfig...');

  const appConfig = AppConfigManager.new(
    path.join(__dirname, 'lsm-ygopro-database', 'labels.yaml')
  );

  const keywords = `根据以下项目特征，推导可能关联的数据：
id: 8491308, name: 闪刀姬-飒天, desc: 风属性以外的「闪刀姬」怪兽1只
自己对「闪刀姬-飒天」1回合只能有1次特殊召唤。
①：这张卡可以直接攻击。
②：这张卡进行战斗的伤害计算后才能发动。从卡组把1张「闪刀」卡送去墓地。, card_type: 效果, monster_type: 连接, attribute: 风, race: 机械, ocg_tcg: OCG|TCG, link: 1, atk: 1500, effect_type: 送去墓地, series: 闪刀`;

  console.log(`搜索关键词: ${keywords.substring(0, 100)}...`);
  const start = Date.now();
  let result;
  try {
    result = await appConfig.searchByKeywords(keywords);
  } catch (e) {
    console.log('搜索失败:', e);
    return;
  }
  const end = Date.now();
  console.log(`搜索耗时: ${end - start}ms`);

  console.log('\n========== SDK 返回结果（纯文本）==========');
  console.log(result);
}

test().catch(e => {
  console.error('测试失败:', e);
  process.exit(1);
});
