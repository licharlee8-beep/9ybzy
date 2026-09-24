// 2026-09-24 两篇文章发布同步：首页侧栏 / 全部文章 / sitemap / llms.txt
const fs = require('fs');
const SITE = 'E:/claude/gaokao-site';

const NEW = [
  {
    slug: '2026-09-24-shuangyiliu-kuorong-7-6wan',
    url: '/articles/2026-09-24-shuangyiliu-kuorong-7-6wan.html',
    title: '"双一流"四年扩容7.6万人：2027届先别急着上调目标，这笔账得拆开算',
    summary: '2026年9月23日国新办"开局起步十五五"发布会上，教育部发展规划司司长郭鹏明确2027至2030年"双一流"高校本科招生数将扩容7.6万人，重点支持人工智能、集成电路、生物医药、新能源等前沿技术和新兴交叉学科，并强调"并非简单数量增加"。本文把这个总量拆到年（每年约1.9万人）、拆到校（147所平均每校每年约130人）、拆到省（平均每省每年约600人），说明相对全国数百万量级的本科招生规模，这一增量不足以改变整体竞争格局，因此不应据新闻上调目标。文章进一步解释"计划增加不等于位次下降"的供需机制，用四种供需组合说明扩容方向恰是最吸引报考的方向，可能落入"计划增、位次反升"的情形。真正值得关注的是三件结构性的事：扩容集中在哪些学科、新建校区可能形成位次洼地也可能被集中填报炒高、真实受益者只是位次卡在往年录取线边缘的考生。随后给出2026年9月到2027年6月的四步动作表，核心是在明年6月招生计划公布时逐个核对目标专业的计划数，再用位次而不是分数做修正。文末说明具体分省分专业计划须以各省教育考试院与高校当年公布为准，并提示可用久元查询专业录取位次、跨省位次换算与冲稳保梯度。'
  },
  {
    slug: '2026-09-24-junxiao-junshi-sanmenkan',
    url: '/articles/2026-09-24-junxiao-junshi-sanmenkan.html',
    title: '想考军校、定向培养军士：三条硬门槛，其中一条年底前不动手就来不及了',
    summary: '军校与定向培养军士的报名和测试都在高考之后，但身体条件、政治考核、选科要求这三道门槛必须在高三上学期就对表，其中视力矫正手术要求"术后半年以上"，到明年六月才想起已无补救空间。本文先对照两类招生的差异（军队院校为本科提前批、入学即入伍、毕业后任命为军官；定向培养军士为专科提前批、学制三年前2.5年在校加0.5年入伍实习、合格后任命为军士），再列年龄（均截至当年8月31日不超过20周岁、未婚）、身高、BMI、裸眼视力、矫正度数、手术要求等体格检查参考标准。文章把时间倒推：2027年面试体检若仍在7月上旬，则手术最晚须在2027年1月上旬完成，留出复查与视力稳定期后实际操作窗口是2026年12月之前。此外说明政治考核的核查范围不只限于考生本人、选科要求以物理为主且高三已无法更改，并给出2027届从9月到次年7月的六步时间表、三个常见误区，以及"先用资格筛排掉不可能、再用位次在剩余范围里排梯度"的正确顺序，指出选科要求不符与单科成绩不达专业要求是军队类招生常见的隐形退档风险。文末说明所有具体标准均来自2024—2026年各省报考须知、不是2027年政策，须以当年官方公告为准。'
  }
];
const DATE = '2026-09-24';

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
fs.writeFileSync(IDX, idx);
console.log('全部文章列表已更新');

// ---------- 3. sitemap.xml ----------
const SM = SITE + '/sitemap.xml';
let sm = fs.readFileSync(SM, 'utf8');
const anchor = '  <url>\n    <loc>https://9ybzy.com/articles/2026-09-23-gongfei-shifansheng-youshi.html</loc>';
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
