// 2026-10-06 两篇文章发布同步：首页侧栏 / 全部文章 / sitemap / llms.txt
const fs = require('fs');
const SITE = 'E:/claude/gaokao-site';

const NEW = [
  {
    slug: '2026-10-06-gaokao-baoming',
    url: '/articles/2026-10-06-gaokao-baoming.html',
    title: '2027年高考报名陆续启动：分省、别错过，报名前这几件事现在就要核对',
    summary: '对2027届考生来说，高三第一件"和考试同等重要"的事是高考报名——它不评分、不排名，却决定你有没有资格走进明年考场，且多数省份系统关闭后不再补报。本文指出报名分省组织、没有全国统一日期（各省前后能差出一两周甚至一个月，如江西10月21日截止、广东要到11月上旬），并列出吉林/重庆/湖南/江西/福建/安徽/内蒙古等省已公布或预计的时间表说明"分省错峰"规律，强调不能参照邻省规划、网上"全国汇总"多为往年安排，须以本省教育考试院当年通知为准。第二部分用表格讲清五步流程：资格预审备材料 → 网上填报信息 → 现场确认（本人到场，家长不能代办）→ 网上缴费 → 留存考生号与密码，并强调"只填报不缴费=报名无效"。第三部分列出三个最容易翻车的地方：关键信息（姓名/身份证号/民族/户籍/选科）确认后难改、官方报名入口唯一无第三方代报名、专项计划须在报名阶段勾选资格（志愿阶段不能追加）。第四部分用表格讲四类考生（往届生/随迁子女/艺体类/专项计划考生）要额外准备的材料，并提醒随迁子女若不符合居住证社保年限应尽早回户籍地报名。文末强调把报名当成一次正式考试对待，具体以本省教育考试院当年发布的报名通知为准。'
  },
  {
    slug: '2026-10-06-baomingji-jiazhang',
    url: '/articles/2026-10-06-baomingji-jiazhang.html',
    title: '高考报名季，家长要提前想清楚的三件"报名之外"的事',
    summary: '高考报名季，多数家庭把注意力放在"材料别漏、时间别错"上，却忽略了报名时定下的三个选择项会在往后大半年里决定孩子"能报什么、和谁竞争、拿什么做判断"。本文讲清这三件事：第一，报考地其实是在选"竞争池"——同一分数在不同省对应位次完全不同，报考地不同等于换了赛道，随迁子女尤其要提前核对户籍地/学籍地报考与居住证社保年限，报考地通常一经确认即锁定。第二，选科与科类锁定未来能报的"专业范围"——报名时确认的选科组合/报考科类/外语语种，会决定将来哪些专业能报、哪些报了也不算，坑在于后果要到填志愿时才暴露，建议现在至少圈定2-3个专业方向回头核对选科要求（能在以后调整的不必现在定，不能在以后调整的现在必须核对）。第三，从现在起家长最该建立的坐标是"位次"而非"分数"——分数受试卷难度影响、跨次考试不可比，位次基本可比且填志愿时直接对上目标院校录取位次，并用表格对比两种看法的差别。文末结合久元：微信小程序搜索「久元报志愿选专业」，输入分数或位次看对应院校专业范围与冲稳保梯度，跨省报考家庭可用跨省位次换算把外省录取分换算成本省可比基准，并声明具体规则以本省教育考试院当年发布的报名通知、招生计划及各校招生章程为准。'
  }
];
const DATE = '2026-10-06';

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
const anchor = '  <url>\n    <loc>https://9ybzy.com/articles/2026-10-05-zhijiao-gaokao.html</loc>';
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
