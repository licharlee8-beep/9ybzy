// 2026-10-04 两篇文章发布同步：首页侧栏 / 全部文章 / sitemap / llms.txt
const fs = require('fs');
const SITE = 'E:/claude/gaokao-site';

const NEW = [
  {
    slug: '2026-10-04-mianfei-yixue-dingxiang',
    url: '/articles/2026-10-04-mianfei-yixue-dingxiang.html',
    title: '免学费、有编制，但要下基层 6 年——"免费医学定向生"到底适合谁？',
    summary: '"免费医学定向生"的正式名称是农村订单定向免费本科医学生，免学费、免住宿费、发放生活补助，毕业后安排到定向县（区）的基层医疗卫生机构工作并落实编制与岗位，但录取前须签订培养协议、毕业后须到基层服务 6 年（参加住院医师规范化培训的年限通常计入其中）。本文第一部分说明它是一个"订单式定向培养协议"而非普通奖学金，权利与义务对等。第二部分用表格列出能拿到的实惠：免学费、免住宿费、生活补助、编制与岗位、规培机会，并指出"毕业即有编有岗"是它最实在的一项保障，因为医学类本科进县级及以上公立医院普遍需要考试且编制紧张。第三部分讲清三项义务：毕业后到乡镇卫生院（或约定基层机构）服务 6 年、报名本身带有实施区域与农村户籍等生源限制、违约须退还已享受的全部减免费用并缴纳违约金且违约记录记入个人诚信档案（可能影响后续考研考编考公），并强调不要把它当成"先读上、以后再说"的选项。第四部分用表格把它与公费师范生对比（培养目标、服务年限、服务地点、是否免试获编、违约后果），指出两者是同一思路在两个行业的落地——用"免费+编制"换取"回基层服务若干年"。第五部分给出适合谁/不适合谁的判断框架表：家在定向区域、认可基层医疗、看重稳定就业或经济减压者较适合，目标是城市三甲或明确想考研读博留在大城市者不建议，只是"分数够不着别的先报上再说"者不建议。文末提醒报考前把协议条款逐条读完，并问自己"6 年后愿不愿意回到那个定向县"，同时声明各省在报名条件、补助标准、服务年限计算口径、违约金方式与诚信处理上存在差异、以本省当年招生文件与培养协议为准。'
  },
  {
    slug: '2026-10-04-tiqianpi-suanzhang',
    url: '/articles/2026-10-04-tiqianpi-suanzhang.html',
    title: '提前批：多一次机会，也可能提前"锁死"——要不要报，先算清这三笔账',
    summary: '"报了也不亏，反正多一次机会"是家长群里流传最广的一句关于提前批的话，但它只对了一半——提前批真正被忽略的规则是：一旦被提前批录取，档案即被提走，后面的普通批次与征集志愿全都不再参加。本文先说明提前批不是一个专业类别而是录取顺序上的批次，用表格列出它包含的类型（军事国防、公安司法、公费师范生/优师专项、免费医学定向生、航海类与飞行技术、部分综合评价与专项计划、艺术体育类部分批次），指出其中多数不是"多给的一次机会"而是"带条件的录取通道"，用较低门槛换取在身体条件、服务年限、就业方向上的承诺。第一笔账"机会账"：用表格区分三种情形——没被录取不影响后续批次（确实不亏）、被录取但放弃入学很可能失去当年该批次录取资格且部分省份记入诚信档案、被录取正常入学则后续批次全部作废，强调"报了不亏"只在"被录取的院校专业是你愿意去的"前提下成立，填一个不想去的提前批志愿不是"多一次机会"而是"多一次风险"。第二笔账"锁档账"：用表格排出录取顺序（本科提前批→本科普通批→征集志愿），指出提前批越靠前锁掉的后续机会越多，判断方法是问"如果放弃这个提前批结果去普通批次竞争，我大概能上什么"，若普通批能上更好更想读的，这个提前批志愿就是在提前锁死一个更差的选项。第三笔账"适配账"：用表格列出硬门槛（身体条件、政治审查、服务协议、专业成绩、资格申报）及其涉及类型与要点，指出这些门槛多在填报前就须满足、出问题无法补救。第五部分强调判断核心问题"我普通批次大概能上什么"必须用位次而非分数——每年试卷难度不同、批次线浮动，同分在不同年份可差上万名，位次才是跨年跨校可比的口径。文末结合久元：位次查询输入位次即可看到对应院校专业范围、冲稳保推荐把提前批与普通批分开比对避免口径混用、跨省位次换算可先把位次对齐到可比基准，微信小程序搜索「久元报志愿选专业」输入位次查看冲稳保推荐，并声明各省在提前批包含类型、志愿设置、是否允许多次投档、放弃录取处理方式上存在差异、以本省当年录取工作文件与院校招生章程为准。'
  }
];
const DATE = '2026-10-04';

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
const anchor = '  <url>\n    <loc>https://9ybzy.com/articles/2026-10-02-zhuanxiang-jihua-weici-dingwei.html</loc>';
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
