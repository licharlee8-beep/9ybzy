// 2026-10-05 两篇文章发布同步：首页侧栏 / 全部文章 / sitemap / llms.txt
const fs = require('fs');
const SITE = 'E:/claude/gaokao-site';

const NEW = [
  {
    slug: '2026-10-05-zhijiao-gaokao',
    url: '/articles/2026-10-05-zhijiao-gaokao.html',
    title: '6月高考不是唯一的路：职教高考和普通高考差在哪，什么样的学生该认真考虑它',
    summary: '提到高考多数人只想到6月那一次，但对一部分学生来说，职教高考（春季高考/对口升学/"三校生"高考）才是更合适的升学通道——2022年新修订的《职业教育法》明确"职业教育与普通教育具有同等重要地位"，职教高考正是其制度化产物。本文先厘清职教高考、高职单招、普通高考三者的区别：高职单招由高职院校自主组织（多在3-4月），职教高考由省级统一组织（多在3-5月），普通高考为全国统考（6月）。第二部分说明职教高考的考试结构是"文化素质+职业技能"（语文数学英语+专业课笔试/实操/职业适应性测试，职业技能权重往往不低），报名多在每年10-12月、考试在次年3-5月、录取通常在普通高考之前，并特别提醒职教高考与普通高考、以及部分省份的高职单招在报名上常为"二选一"或有先后顺序，报名前务必查清本省规定。第三部分用表格对比它与普通高考在考试内容、竞争对手、可报考院校、录取后待遇上的差别，强调录取后在校学习、毕业证、学位、就业待遇与普通高考录取的学生相同，纠正"职教高考=只能上专科、学历低人一等"的误解，并说明随着职业本科扩容升本科通道正在变宽。第四部分说明三类值得认真考虑的学生（动手能力强于应试、已在中职且专业方向明确、普高赛道上位次偏后但某类专业扎实），并诚实指出若目标是外省名校或较高院校层次、普通高考覆盖面仍大得多。第五部分用表格澄清三个常见误区。文末声明各省在名称、报名时间、是否允许普高生报考、可报考院校层次、与普通高考互斥规则上差异较大，以本省教育考试院当年发布的招生考试文件为准。'
  },
  {
    slug: '2026-10-05-weici-sannian-qushi',
    url: '/articles/2026-10-05-weici-sannian-qushi.html',
    title: '只看"去年录取线"最容易踩空：用"近三年位次"给目标院校做一次体检',
    summary: '填报志愿时多数家长直接拿"去年录取最低分"当标准，而这是最容易踩空的填法——因为录取分跨年几乎不可比：试卷难度、批次线、招生计划都是会浮动的变量，同一所学校去年的录取分和今年看着差不多、对应位次却可能差出几千甚至上万名。本文指出位次才是可以跨年对齐的口径（今年排第2万名与去年排第2万名在报考竞争力上基本是同一位置），正确做法是看录取位次而非录取分。第二部分给出一张"近三年位次体检"自查表样式，用录取位次走出21,000→18,500→16,200、同时缩招（12→10人）的示例说明"连续走高+缩招"叠加指向今年大概率不会更好考、甚至可能更难。第三部分用表格讲三种典型趋势的含义：连续走高（位次数字逐年变小）意味着越来越难考、应按"更难"估算、别拿三年前数据自我安慰；连续走低是门槛在降、对中等考生是机会但要先排除专业是否走弱；反复振荡是典型"大小年"，性价比可能高但最不可预测、要重点看招生计划是否稳定，并反直觉提醒"大小年"恰恰最容易翻车，因为大量考生都有"去年分低、今年我要冲"的想法会反而把位次抬高。第四部分列出还需同时看的三件事：招生计划增减、专业组/专业调整、以及投档线与专业线的差（够到投档线不等于够到你要填的专业）。文末结合久元：位次查询输入位次即可看到对应院校与专业范围、冲稳保推荐基于位次把目标分成冲稳保三档避免只看一个"去年最低分"、跨省位次换算可先把位次对齐到可比基准、四大防护对梯度断档与专业组错配等结构性问题给出提醒，微信小程序搜索「久元报志愿选专业」输入位次查看冲稳保推荐，并声明具体院校专业在本省的历年录取位次、招生计划、投档与专业录取规则以本省教育考试院公布的历年一分一段表、招生计划及各校当年招生章程为准、所举数据为方法示例、不构成对任何院校或专业的推荐。'
  }
];
const DATE = '2026-10-05';

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
const anchor = '  <url>\n    <loc>https://9ybzy.com/articles/2026-10-04-mianfei-yixue-dingxiang.html</loc>';
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
