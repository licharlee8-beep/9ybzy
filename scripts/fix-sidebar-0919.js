const fs = require('fs');
const P = 'E:/claude/gaokao-site/index.html';
const lines = fs.readFileSync(P, 'utf8').split('\n');

const si = lines.findIndex(l => l.includes('<div class="articles-sidebar">'));
if (si === -1) throw new Error('sidebar not found');

const ITEM = '<div style="margin-bottom: 10px;';
let end = si + 1;
while (lines[end] && lines[end].includes(ITEM)) end++;

const oldItems = lines.slice(si + 1, end);
console.log('原有侧栏条目数: ' + oldItems.length);
if (oldItems.length !== 5) throw new Error('预期 5 条，实际 ' + oldItems.length + '，中止');

const mk = (slug, title, date) =>
  `\t\t\t<div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;"><a href="/articles/${slug}.html" style="color: #D97706; text-decoration: none; font-size: 14px; line-height: 1.4; display: block;">${title}</a><span style="font-size: 11px; color: #999;">${date}</span></div>`;

const newItems = [
  mk('2026-09-19-baoyanlv-chaju', '保研率相差20倍：2026年推免数据告诉你，大学的分岔从开学第一天就开始了', '2026-09-19'),
  mk('2026-09-19-danzhao-zhuanke-lujing', '本科线附近的2027届：高职单招是一条路，但有一个不可逆的代价', '2026-09-19')
];

const merged = [...newItems, ...oldItems].slice(0, 5);
const out = [...lines.slice(0, si + 1), ...merged, ...lines.slice(end)].join('\n');
fs.writeFileSync(P, out);

// 验证
const v = fs.readFileSync(P, 'utf8');
const vLines = v.split('\n');
const vi = vLines.findIndex(l => l.includes('<div class="articles-sidebar">'));
let ve = vi + 1;
while (vLines[ve] && vLines[ve].includes(ITEM)) ve++;
console.log('更新后侧栏条目数: ' + (ve - vi - 1));
const ok = v.startsWith('<!DOCTYPE html>') && v.includes('<html') && v.includes('<head>') && v.includes('<body>') && v.includes('</html>');
console.log('首页完整性: ' + (ok ? '通过' : '失败'));
console.log('两条新文章是否都在侧栏: ' + (v.includes('2026-09-19-baoyanlv-chaju') && v.includes('2026-09-19-danzhao-zhuanke-lujing')));
console.log('最新一条是否为保研: ' + vLines[vi + 1].includes('baoyanlv-chaju'));
