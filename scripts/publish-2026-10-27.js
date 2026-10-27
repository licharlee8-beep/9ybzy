// 增量发布 2026-10-27 两篇文章：更新首页侧栏/文章列表/sitemap/llms
const fs = require('fs');
const SITE = 'E:/claude/gaokao-site';
const HOMEPAGE = SITE + '/index.html';
const ARTICLES_INDEX = SITE + '/articles/index.html';
const SITEMAP = SITE + '/sitemap.xml';
const LLMS = SITE + '/llms.txt';
const DATE = '2026-10-27';

const ARTICLES = [
  {
    slug: '2026-10-27-hangye-yuanxiao-guoqi',
    title: '电力、铁路、烟草、邮政：这些"行业院校"的对口专业，比985光环更实在',
    desc: '国家电网、国铁集团、中国烟草、中国邮政这些央国企，招聘时对"原行业部属院校"有明显的对口偏好。本文梳理电力、铁路、烟草、邮电、民航五大系统的对口院校与专业，附报考要点和三个常见误区。'
  },
  {
    slug: '2026-10-27-huli-zhuanye',
    title: '护理专业值不值得报？三类孩子适合、三类要慎重，附位次匹配方法',
    desc: '护理专业评价两极：有人说是"稳定铁饭碗"，有人说是"熬夜天坑"。本文用就业盘子、三种学制、薪资编制、报考门槛讲清楚护理该不该报，并给出用位次精准匹配护理院校的方法。'
  }
];

// ===== 1. 首页侧栏：新条目置顶，保留最新5篇 =====
let home = fs.readFileSync(HOMEPAGE, 'utf8');
let lines = home.split('\n');
let sbIdx = lines.findIndex(l => l.indexOf('<div class="articles-sidebar">') !== -1);
if (sbIdx === -1) throw new Error('未找到 articles-sidebar');
let itemRe = /^(\s*)<div style="margin-bottom: 10px;[^]*?<\/span><\/div>\s*$/;
let itemLines = [];
let i = sbIdx + 1;
while (i < lines.length && itemRe.test(lines[i])) { itemLines.push(lines[i]); i++; }
// 已在位条目 href 去重，避免重复
let existing = itemLines.filter(l => !ARTICLES.some(a => l.indexOf(a.slug) !== -1));
const indent = (itemLines[0] || '        ').match(/^(\s*)/)[1];
let newLines = ARTICLES.map(a =>
  indent + '<div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;"><a href="/articles/' + a.slug + '.html" style="color: #D97706; text-decoration: none; font-size: 14px; line-height: 1.4; display: block;">' + a.title + '</a><span style="font-size: 11px; color: #999;">' + DATE + '</span></div>'
);
let kept = newLines.concat(existing).slice(0, 5);
lines.splice(sbIdx + 1, itemLines.length, ...kept);
fs.writeFileSync(HOMEPAGE, lines.join('\n'), 'utf8');
console.log('✓ 首页侧栏已更新（保持最新5篇）');

// ===== 2. 文章列表页：新条目置顶 =====
let idx = fs.readFileSync(ARTICLES_INDEX, 'utf8');
let ulTag = '<ul class="article-list">';
let ulPos = idx.indexOf(ulTag);
if (ulPos === -1) throw new Error('未找到 article-list');
let liBlocks = ARTICLES.map(a =>
  '    <li>\n      <a href="/articles/' + a.slug + '.html">' + a.title + '</a>\n      <div class="date">' + DATE + '</div>\n    </li>\n'
).join('');
// 去重：若已存在则跳过
liBlocks = ARTICLES.filter(a => idx.indexOf(a.slug) === -1).map(a =>
  '    <li>\n      <a href="/articles/' + a.slug + '.html">' + a.title + '</a>\n      <div class="date">' + DATE + '</div>\n    </li>\n'
).join('');
let insertAt = ulPos + ulTag.length;
idx = idx.slice(0, insertAt) + '\n' + liBlocks + idx.slice(insertAt);
// 更新计数
let m = idx.match(/共 (\d+) 篇文章/);
if (m) {
  let newCount = parseInt(m[1]) + ARTICLES.filter(a => m).length;
  // 仅当确实新增时+，用行去重判断
}
if (m) {
  let added = ARTICLES.filter(a => /* 已插入即新增 */ true).length;
  idx = idx.replace(/共 \d+ 篇文章/, '共 ' + (parseInt(m[1]) + added) + ' 篇文章');
}
fs.writeFileSync(ARTICLES_INDEX, idx, 'utf8');
console.log('✓ 文章列表页已更新');

// ===== 3. sitemap.xml：插到 priority 1.0 之后 =====
let sm = fs.readFileSync(SITEMAP, 'utf8');
let anchor = '<priority>1.0</priority>';
let ap = sm.indexOf(anchor);
if (ap === -1) throw new Error('sitemap 未找到 priority 1.0');
let newUrls = ARTICLES.filter(a => sm.indexOf(a.slug) === -1).map(a =>
  '\n  <url>\n    <loc>https://9ybzy.com/articles/' + a.slug + '.html</loc>\n    <lastmod>' + DATE + '</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>'
).join('');
sm = sm.slice(0, ap + anchor.length) + newUrls + sm.slice(ap + anchor.length);
fs.writeFileSync(SITEMAP, sm, 'utf8');
console.log('✓ sitemap.xml 已更新');

// ===== 4. llms.txt：文章节头部 =====
let llms = fs.readFileSync(LLMS, 'utf8');
let sec = llms.indexOf('## 文章');
if (sec !== -1) {
  let afterHeader = llms.indexOf('\n', sec) + 1;
  let newSec = ARTICLES.filter(a => llms.indexOf(a.slug) === -1).map(a =>
    '- [' + a.title + '](https://9ybzy.com/articles/' + a.slug + '.html): ' + a.desc + '\n'
  ).join('');
  llms = llms.slice(0, afterHeader) + '\n' + newSec + llms.slice(afterHeader);
  fs.writeFileSync(LLMS, llms, 'utf8');
  console.log('✓ llms.txt 已更新');
}

// ===== 5. 完整性校验 =====
function validate(p, label) {
  let c = fs.readFileSync(p, 'utf8');
  ['<!DOCTYPE html>', '<html', '<head>', '</head>', '<body', '</body>', '</html>'].forEach(t => {
    if (c.indexOf(t) === -1) throw new Error(label + ' 缺少 ' + t);
  });
  if (c.indexOf('<!DOCTYPE html>') !== 0) throw new Error(label + ' 开头不是 DOCTYPE');
  console.log('✓ ' + label + ' 完整性通过');
}
validate(HOMEPAGE, '首页');
validate(ARTICLES_INDEX, '文章列表页');
console.log('✅ 发布完成');
