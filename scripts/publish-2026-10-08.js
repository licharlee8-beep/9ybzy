// 2026-10-08 两篇文章发布同步：首页侧栏 / 全部文章 / sitemap / llms.txt
const fs = require('fs');
const SITE = 'E:/claude/gaokao-site';

const NEW = [
  {
    slug: '2026-10-08-yingyu-tingshuo-jikao',
    url: '/articles/2026-10-08-yingyu-tingshuo-jikao.html',
    title: '高考英语"听说机考"：有的地方一年能考两次、取最高分——北京、广东、上海的做法差在哪',
    summary: '高考英语在多地早已不只"一张卷子"。本文用表格讲清三种典型做法：北京把听说做成机考、一年两考、取最高分（满分50分，第一次12月、第二次3月，首考满分免第二次）；广东单独组织人机对话（CELST），卷面60分按÷3折算为最多20分计入，英语总分=笔试×13÷12+听说成绩；上海的听说测试35分直接计入外语总分。文章说明为什么"听说"是被最多家庭低估的一块分数、时间点是"错峰"的（不在六月），并给2027届三个提醒：先回本省考试院确认形式与折算、把报名与考试日期抄进日历、把听说当成"练了就有"的高性价比分数。具体以本省教育考试院当年通知为准。'
  },
  {
    slug: '2026-10-08-dalei-zhaosheng-fenliu',
    url: '/articles/2026-10-08-dalei-zhaosheng-fenliu.html',
    title: '大类招生正在被"严控"：同一个专业组名字，进去可能是完全不同的专业——填报前要问清的四件事',
    summary: '2026年1月教育部明确"原则上按专业开展招生，严控大类招生的数量和规模"，并在院校专业组省份要求把关联度高、培养要求相近的专业编入同一组、控制组内专业数量。本文讲清大类招生的三个变量：一是专业构成（名字相同、清单可能不同），二是分流时间（大一内/大二/更晚，个别外语类设计类入校一个月内、部分工科试验班大三第一学期期末前），三是分流规则（竞争型按"分数优先、遵循志愿"或面试选拔，任选型不设名额上下限按意愿100%自由选，限定型只在类内分流）。给出填报前必问的四件事，并强调用"专业构成+位次"而非"专业名字+分数"做判断。结合久元：小程序搜「久元报志愿选专业」可对照专业构成与往年录取位次、用冲稳保梯度与跨省位次换算。'
  }
];
const DATE = '2026-10-08';

// ---------- 1. 首页侧栏（保留最近5篇） ----------
const HOME = SITE + '/index.html';
let homeLines = fs.readFileSync(HOME, 'utf8').split('\n');
const sideOpen = homeLines.findIndex(l => l.includes('<div class="articles-sidebar">'));
if (sideOpen < 0) throw new Error('未找到 articles-sidebar');

const entryIdx = [];
for (let i = sideOpen + 1; i < homeLines.length; i++) {
  if (homeLines[i].includes('</div>') && entryIdx.length && !homeLines[i].includes('<a href="/articles/')) break;
  if (homeLines[i].includes('<a href="/articles/')) entryIdx.push(i);
}
if (entryIdx.length < 3) throw new Error('侧栏条目数少于3，实际 ' + entryIdx.length);
if (entryIdx.length !== 5) console.log('提示：侧栏原有 ' + entryIdx.length + ' 条（应为5），本次会裁剪为5条');

const sidebarItem = a => `\t\t\t<div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;"><a href="${a.url}" style="color: #D97706; text-decoration: none; font-size: 14px; line-height: 1.4; display: block;">${a.title}</a><span style="font-size: 11px; color: #999;">${a.date}</span></div>`;

const kept = entryIdx.slice(0, 3).map(i => homeLines[i].replace(/^\s+/, '\t\t\t'));
const newSide = [
  sidebarItem({ ...NEW[0], date: DATE }),
  sidebarItem({ ...NEW[1], date: DATE }),
  ...kept
];
homeLines.splice(entryIdx[0], entryIdx.length, ...newSide);
fs.writeFileSync(HOME, homeLines.join('\n'));
console.log('首页侧栏已更新，现有条目：', newSide.length);

// ---------- 2. 全部文章列表 ----------
const IDX = SITE + '/articles/index.html';
let idx = fs.readFileSync(IDX, 'utf8');
const li = a => `    <li>\n      <a href="${a.url}">${a.title}</a>\n      <div class="date">${DATE}</div>\n    </li>\n`;
const listStart = idx.indexOf('<ul class="article-list">');
if (listStart < 0) throw new Error('未找到 article-list');
const insAt = idx.indexOf('\n', listStart) + 1;
idx = idx.slice(0, insAt) + li(NEW[0]) + li(NEW[1]) + idx.slice(insAt);
idx = idx.replace(/共 (\d+) 篇文章/, (m, n) => '共 ' + (parseInt(n) + 2) + ' 篇文章');
fs.writeFileSync(IDX, idx);
console.log('全部文章列表已更新');

// ---------- 3. sitemap.xml ----------
const SM = SITE + '/sitemap.xml';
let sm = fs.readFileSync(SM, 'utf8');
const anchor = '  <url>\n    <loc>https://9ybzy.com/articles/2026-10-07-dengji-fufen.html</loc>';
if (!sm.includes(anchor)) throw new Error('sitemap 未找到插入锚点');
const block = a => `  <url>\n    <loc>https://9ybzy.com${a.url}</loc>\n    <lastmod>${DATE}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
if (sm.includes(NEW[0].url)) throw new Error('sitemap 已存在该文章，勿重复插入');
sm = sm.replace(anchor, block(NEW[0]) + block(NEW[1]) + anchor);
fs.writeFileSync(SM, sm);
console.log('sitemap.xml 已更新');

// ---------- 4. llms.txt ----------
const LL = SITE + '/llms.txt';
let ll = fs.readFileSync(LL, 'utf8');
const llmsAnchor = '## 文章\n';
if (!ll.includes(llmsAnchor)) throw new Error('llms.txt 未找到「## 文章」');
if (ll.includes(NEW[0].url)) throw new Error('llms.txt 已存在该文章，勿重复插入');
const line = a => `- [${a.title}](https://9ybzy.com${a.url}): ${a.summary}\n`;
ll = ll.replace(llmsAnchor, llmsAnchor + line(NEW[0]) + line(NEW[1]));
fs.writeFileSync(LL, ll);
console.log('llms.txt 已更新');

// ---------- 5. 首页完整性验证 ----------
const h2 = fs.readFileSync(HOME, 'utf8');
const ok = h2.startsWith('<!DOCTYPE html>') && h2.includes('<html') && h2.includes('<head>') && h2.includes('<body>');
console.log('首页完整性：', ok ? '通过' : '失败');
if (!ok) process.exit(1);
