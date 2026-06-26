/**
 * Merge parsed 浙江2025 data into major_score_data.json
 * - New data overwrites old for matching schools
 * - Old entries not in new data are preserved
 */

const fs = require('fs');

const newData = JSON.parse(fs.readFileSync('E:/claude/gaokao-site/zhejiang_2025_parsed.json', 'utf8'));
const oldData = JSON.parse(fs.readFileSync('E:/claude/gaokao-miniapp/server/data/json/major_score_data.json', 'utf8'));

console.log('=== MERGE STATS ===');
console.log('Old data:');
let oldSchools = 0, oldProgs = 0;
for (const prov of Object.keys(oldData)) {
  for (const sch of Object.keys(oldData[prov])) {
    oldSchools++;
    oldProgs += Object.keys(oldData[prov][sch]).length;
  }
}
console.log('  Provinces:', Object.keys(oldData).length);
console.log('  Schools:', oldSchools);
console.log('  Programs:', oldProgs);

console.log('New data:');
let newSchools = 0, newProgs = 0;
for (const prov of Object.keys(newData)) {
  for (const sch of Object.keys(newData[prov])) {
    newSchools++;
    newProgs += Object.keys(newData[prov][sch]).length;
  }
}
console.log('  Provinces:', Object.keys(newData).length);
console.log('  Schools:', newSchools);
console.log('  Programs:', newProgs);

// Merge
let merged = 0, added = 0;
for (const prov of Object.keys(newData)) {
  if (!oldData[prov]) oldData[prov] = {};
  for (const sch of Object.keys(newData[prov])) {
    const oldHas = oldData[prov][sch] !== undefined;
    if (oldHas) merged++;
    else added++;
    oldData[prov][sch] = newData[prov][sch]; // full replace/add
  }
}

// Stats after merge
let finalSchools = 0, finalProgs = 0;
for (const prov of Object.keys(oldData)) {
  for (const sch of Object.keys(oldData[prov])) {
    finalSchools++;
    finalProgs += Object.keys(oldData[prov][sch]).length;
  }
}

console.log('\n=== RESULTS ===');
console.log('Schools merged (old replaced):', merged);
console.log('Schools added (new):', added);
console.log('Schools preserved (old only):', oldSchools - merged);
console.log('Final schools:', finalSchools);
console.log('Final programs:', finalProgs);

// Write backup of old data first
const backupPath = 'E:/claude/gaokao-miniapp/server/data/json/major_score_data_backup_2025_zj.json';
fs.writeFileSync(backupPath, JSON.stringify(JSON.parse(fs.readFileSync('E:/claude/gaokao-miniapp/server/data/json/major_score_data.json', 'utf8')), null, 2), 'utf8');
console.log('\nBackup saved to:', backupPath);

// Write merged data
const outputPath = 'E:/claude/gaokao-miniapp/server/data/json/major_score_data.json';
fs.writeFileSync(outputPath, JSON.stringify(oldData, null, 2), 'utf8');
console.log('Merged data written to:', outputPath);
console.log('File size:', (fs.statSync(outputPath).size / 1024 / 1024).toFixed(1), 'MB');
