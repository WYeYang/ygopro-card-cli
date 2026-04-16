
import { runQuery, closeNLQuery } from './index';

(async () => {
  try {
    console.log('Testing query: 通常怪兽');
    const result = await runQuery('通常怪兽');
    console.log('\nGenerated SQL:', result.sql);
    console.log('\nData:', JSON.stringify(result.data.slice(0, 3), null, 2));
    console.log('\nExplanation:', result.explanation);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await closeNLQuery();
  }
})();
