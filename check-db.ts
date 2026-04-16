
import * as sqlite3 from 'sqlite3';
import * as path from 'path';

const dbPath = path.join(__dirname, 'lsm-ygopro-database', 'database', 'locales', 'zh-CN', 'cards.cdb');
const db = new sqlite3.Database(dbPath);

console.log('Checking database schema...');

db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables: any[]) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  console.log('\nTables found:');
  tables.forEach(table => console.log('-', table.name));
  
  console.log('\n--- datas table schema ---');
  db.all("PRAGMA table_info(datas)", (err, columns: any[]) => {
    if (err) {
      console.error('Error:', err);
    } else {
      columns.forEach(col => console.log(`${col.name} (${col.type})`));
    }
    
    console.log('\n--- texts table schema ---');
    db.all("PRAGMA table_info(texts)", (err, columns: any[]) => {
      if (err) {
        console.error('Error:', err);
      } else {
        columns.forEach(col => console.log(`${col.name} (${col.type})`));
      }
      
      console.log('\n--- Sample data from datas table ---');
      db.all("SELECT * FROM datas LIMIT 3", (err, rows: any[]) => {
        if (err) {
          console.error('Error:', err);
        } else {
          console.log(JSON.stringify(rows, null, 2));
        }
        
        console.log('\n--- Sample data from texts table ---');
        db.all("SELECT * FROM texts LIMIT 3", (err, rows: any[]) => {
          if (err) {
            console.error('Error:', err);
          } else {
            console.log(JSON.stringify(rows, null, 2));
          }
          
          db.close();
        });
      });
    });
  });
});
