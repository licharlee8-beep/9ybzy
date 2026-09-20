// 从 articles/ 目录重建 sitemap.xml —— 保证 XML 结构合法（老脚本会吃掉 <url>/<loc> 开标签，导致 Google 整份拒收）
// 用法: node scripts/sync-sitemap.js
const fs = require('fs');
const path = require('path');

const SITE_DIR = 'E:/claude/gaokao-site';
const ARTICLES_DIR = path.join(SITE_DIR, 'articles');
const SITEMAP_PATH = path.join(SITE_DIR, 'sitemap.xml');
const HOME = 'https://9ybzy.com/';
const EXTRA_TAIL = [{ loc: 'https://9ybzy.com/career.html', lastmod: '2026-06-10', changefreq: 'monthly', priority: '0.5' }];

function fail(msg) { console.error('校验失败: ' + msg); process.exit(1); }

const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.html') && f !== 'index.html');
if (files.length === 0) fail('articles/ 下没有文章文件');

const articles = [];
for (const f of files) {
  const m = f.match(/^(\d{4}-\d{2}-\d{2})-/);
  if (!m) fail('文件名缺少日期前缀: ' + f);
  if (m[1] > new Date().toISOString().slice(0, 10)) fail('文件名日期晚于今天: ' + f);
  articles.push({ loc: `https://9ybzy.com/articles/${f}`, lastmod: m[1], changefreq: 'weekly', priority: '0.8' });
}
articles.sort((a, b) => (a.lastmod === b.lastmod ? (a.loc < b.loc ? 1 : -1) : (a.lastmod < b.lastmod ? 1 : -1)));

const seen = new Set();
for (const a of articles) { if (seen.has(a.loc)) fail('重复条目: ' + a.loc); seen.add(a.loc); }

const entry = (e, ind = '  ') => [
  `${ind}<url>`,
  `${ind}  <loc>${e.loc}</loc>`,
  `${ind}  <lastmod>${e.lastmod}</lastmod>`,
  `${ind}  <changefreq>${e.changefreq}</changefreq>`,
  `${ind}  <priority>${e.priority}</priority>`,
  `${ind}</url>`,
].join('\n');

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  entry({ loc: HOME, lastmod: '2026-06-26', changefreq: 'daily', priority: '1.0' }),
  ...articles.map(a => entry(a)),
  ...EXTRA_TAIL.map(e => entry(e)),
  '</urlset>',
  '',
].join('\n');

// 断言：结构合法
const open = (xml.match(/<url>/g) || []).length;
const close = (xml.match(/<\/url>/g) || []).length;
const locOpen = (xml.match(/<loc>/g) || []).length;
const locClose = (xml.match(/<\/loc>/g) || []).length;
if (open !== close) fail(`<url> 不配对 ${open}/${close}`);
if (locOpen !== locClose) fail(`<loc> 不配对 ${locOpen}/${locClose}`);
if (open !== locOpen) fail(`<url> 与 <loc> 数量不等 ${open}/${locOpen}`);
if (/^https?:\/\/[^\s<]*<\/loc>$/m.test(xml)) fail('存在缺开标签的悬空 URL 行');
if (/<loc>\s*<url>/.test(xml)) fail('存在未闭合的 <loc>');
if (open !== articles.length + 1 + EXTRA_TAIL.length) fail(`条目数不符 ${open}`);

fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');
console.log(`sitemap.xml 已重建: ${open} 个 URL (首页 1 + 文章 ${articles.length} + 其他 ${EXTRA_TAIL.length})`);
console.log(`最新 3 条: ${articles.slice(0, 3).map(a => a.loc.split('/').pop()).join(', ')}`);
