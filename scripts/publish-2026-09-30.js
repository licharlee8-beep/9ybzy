// 2026-09-30 两篇文章发布同步：首页侧栏 / 全部文章 / sitemap / llms.txt
const fs = require('fs');
const SITE = 'E:/claude/gaokao-site';

const NEW = [
  {
    slug: '2026-09-30-guangqing-qitian',
    url: '/articles/2026-09-30-guangqing-qitian.html',
    title: '高三的国庆七天：位次的分化，是从"自主时间"开始的',
    summary: '国庆七天是高三全年最长的一段可以完全自己支配的时间，但围绕它流传的两句话"假期是超车的最好机会"和"该休息就休息"都没有回答"这七天到底该拿来做什么"。本文先把高三的时间结构讲清楚：一轮复习一般从高三开学（9月）持续到次年1至2月，占全年一半以上时间，它的任务不是提分而是补全，二轮三轮做的是用好已经掌握的东西、一轮做的是决定你手里有什么可用的东西，一轮漏掉的知识点后面基本没有时间回来补。第二部分解释为什么位次分化发生在自主时间：校内时间的分配对同班学生几乎完全相同（同一张课表、同一套作业、同样的自习节数），真正产生差异的是没有被学校统一安排的连续时间，因为零碎时间只能做眼前这件事、连续时间才能处理一直没解决的那件事；由此推出一个反直觉的结论——假期的价值不在于多做，在于能停下来处理积压，如果假期只是把在校节奏延长到家里那它的效果接近于零。第三部分给出假期该做的三件事：一是集中处理一到两个最薄弱且可修复的模块（判断标准是失分是否稳定、是否是高频考点，两项缺一不可），二是把错题从收集变成归因（把"不会"拆成知识性、方法性、熟练度、非智力四类，四类应对方式完全不同——回教材、总结题型路径、限时重复、固定检查流程，不归因就会用错方法，把熟练度问题当成知识问题重学是高三最常见的时间浪费），三是把作息固定下来而不是先玩两天再说（作息紊乱的代价不由假期承担，由返校后第一周承担，而那一周通常是新内容最密集的时候）。第四部分讲返校后如何验证假期效果：用位次口径而不是分数口径，因为假期后第一次考试的卷子难度未必与上次月考相同，只看分数涨跌无法区分"假期有成效"和"这次卷子简单"，正确做法是看位次是否比上次月考前进、以及那类一直在错的题是否不再错了。第五部分列出假期不该做的三件事（把计划排满、只看不练、作息彻底颠倒），并解释"只看不练"产生的熟悉感不是能力、在考场上会直接变成"这题我见过但做不出来"。第六部分把国庆七天定位为"止损窗口"：七天不足以让中等生变尖子生，但可以把那个从高一开始就一直扣分的模块处理掉；止损类事情的特点是做的时候看不见效果、不做的时候也看不见代价，但到高考出分时会完整体现。文末提醒这七天还值得完成一件事——把"我大致想去哪、想学什么方向"想清楚，因为一轮复习期间做目标定位和出分后做志愿决定是两件事，前者是目标可以指导接下来半年的行动、后者是决定必须在一周内定稿且不可逆。'
  },
  {
    slug: '2026-09-30-zhuanye-fangxiang',
    url: '/articles/2026-09-30-zhuanye-fangxiang.html',
    title: '"不知道想学什么专业"不是等出来的：国庆七天做一次方向初筛',
    summary: '高三学生被问到"想学什么专业"时最常见的回答是"还没想好，等考完再说"，但这里有一个很硬的约束被忽略了：从出分到志愿填报截止通常只有几天到十几天，在这么短时间里要完成"了解上百个专业、筛掉不合适的、对照位次排梯度、决定顺序"这一整套动作，绝大多数家庭做不到，所以等出分再想的实际结果不是"想清楚了再做决定"而是"来不及想就做了决定"。本文第一部分说明推迟定专业的三个具体代价：决定不可逆（志愿提交后不能改，与可以不断修正的"目标"不同）、信息量在几天内无法消化、出分后的时间被查位次看计划比对数据等更紧急的事占满；此外专业方向的准备程度会影响一轮复习的目标感，有方向的学生知道自己的方向大概需要什么位次、这个位次会变成半年里的具体目标，没方向的学生只能对着"努力考高分"使劲、这句话无法指导任何具体行动。第二部分指出专业方向不是"兴趣测试"测出来的：多数兴趣测评测的是偏好而填志愿需要的是约束，偏好不稳定且与录取几乎没有关系，而选科要求、院校层次、位次门槛都是硬约束；更可靠的做法是排除法——不追问"我最喜欢什么"，而是先把"读不了、录不上、绝对不能接受"的划掉，因为判断"不接受什么"比判断"热爱什么"容易得多也可靠得多。第三部分给出三步初筛：第一步从学科优势倒推专业大类，看的不该是哪科分数最高而是哪几科的相对位置最好（分数高低受卷子难易影响、相对位置才反映真实结构），并提醒分数高的科目不一定该选、判断依据是相对位置不是绝对分数；第二步用选科限制做硬过滤，很多专业对选考科目有明确要求且这是硬门槛、不满足就是无法报考，这一步的价值不在于筛出什么、在于让你提前知道哪些路已经关了；第三步用"绝对不接受"做软过滤，针对剩下方向问三个问题（这个方向典型的工作状态能否接受、如果需要读到硕士才有出路能否接受、如果被调剂到这个大类里的冷门专业能否接受）。第四部分说明筛完的清单必须落到"位次"上才有用，因为同一个专业在不同层次院校都有开设，需要查院校投档位次（门槛）与专业录取位次（专业线）两项，这两个数据通常差得很远，只查院校线不查专业线是"进了门读不到想读的专业"最常见的原因。第五部分解释为什么是国庆而不是寒假：寒假离高考更近、心理空间更小，且国庆是全家里最有可能同时在场的一段时间，因为"能不能接受"这个判断里有一部分是家庭层面的。文末提示可用久元做位次查询（输入省份选考科目和分数自动换算全省位次）、查专业录取位次（具体专业录到第几名而不只是院校门槛）、冲稳保梯度推荐、跨省位次换算，不用注册不用登录、基础功能免费。'
  }
];
const DATE = '2026-09-30';

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
const anchor = '  <url>\n    <loc>https://9ybzy.com/articles/2026-09-29-weici-dingwei.html</loc>';
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
