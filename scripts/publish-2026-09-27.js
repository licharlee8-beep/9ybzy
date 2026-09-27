// 2026-09-27 两篇文章发布同步：首页侧栏 / 全部文章 / sitemap / llms.txt
const fs = require('fs');
const SITE = 'E:/claude/gaokao-site';

const NEW = [
  {
    slug: '2026-09-27-gaokao-jiafen-shengyu',
    url: '/articles/2026-09-27-gaokao-jiafen-shengyu.html',
    title: '高考加分还剩哪些？2026年起多地取消少数民族加分——一张表看清哪些还能用',
    summary: '2026年多个省份明确取消或大幅下调少数民族考生加分，同时"三统一"（户籍、学籍、实际就读年限）资格审核被普遍强化，不少家庭到审核环节才发现以为能加的分数已经加不了。本文先把加分拆成两套并行体系：全国性加分（面向所有高校投档时使用，多项只取最高一项且不超过20分）与地方性加分（原则上只面向本省所属高校，报考外省时不计入投档成绩，这是预期偏差最常见的来源），所有加分都不适用于高校不安排分省招生计划的招生项目。全国性加分部分列出目前主要保留的项目与分值：烈士子女20分、服役期间荣立二等功以上或被战区以上单位授予荣誉称号的退役军人20分、自主就业退役士兵10分、归侨华侨子女及归侨子女5分、台湾省籍考生5分，并说明2014年起已分批取消体育特长生、学科奥林匹克竞赛、科技类竞赛、省级优秀学生、思想政治品德突出事迹等一批加分项。少数民族加分部分用表格梳理辽宁取消喀左等10县、福建明确取消、贵州按一二三类区域分批推进（三类区域符合三统一者2026年起保留5分）、湖南自20分降至10分并取消地方性加分、内蒙古仅A类地区且满足三统一保留5分、甘肃非聚居区10分降至5分而两州五县可加20分、四川三州十七县两区统一调整为20分（汉族考生10分）、海南15分降至10分且2027年起降至5分、江西河南等取消散居地区加分的各省调整情况，并强调这只是举例而非完整清单。随后详解三统一要求（同一县市区高中阶段3年完整户籍、学籍且连续3年实际就读，三者缺一不可）与本人申报—部门审核—三级公示流程，指出未经公示不得计入投档成绩、虚假申报将取消加分资格及高考成绩，并说明该要求杀伤力最大之处在于把责任前移到日常，跨县就读或中途转学的考生往往在高三才发现不符条件。最后给出9月底该核对的三件事（逐条对照本省加分项目清单并区分全国性与地方性、核对三统一三个信息、确认申报与公示的时间节点与材料），并强调加分改变的是投档口径而非实际分数，加分后应重新换算位次而不是重新对标分数，因为分数到分位的换算关系是非线性的。文末说明各省加分项目、分值、适用范围与生效年份差异较大且逐年调整，须以本省教育考试院当年招生工作规定为唯一依据。'
  },
  {
    slug: '2026-09-27-zhuanye-luqu-guize',
    url: '/articles/2026-09-27-zhuanye-luqu-guize.html',
    title: '多数高校已经不设"专业级差"了：还在用老经验排专业志愿，可能白紧张一场',
    summary: '网上流传很广的"第一专业志愿别冲太高，否则第二志愿要扣级差再比"这条建议曾经是对的，但从各高校近年招生章程看已大面积失效——2026年多数高校明确写明"分数优先（分数清）"且不设专业级差（有的表述为专业志愿之间不设级差分、专业之间无分数线差），很多家庭正在为一个已经不存在的问题做防守。本文先说明分数清的具体机制：把已投档到本校的考生按投档成绩（含政策加分）从高到低排队，从最高分开始依次看其专业志愿顺序，有计划的专业即录、否则顺延至下一志愿。由此得出关键性质——分数高的人先挑且不必为志愿顺序付出分数代价，所以专业志愿顺序应当纯粹按真实偏好排，最想去的放第一，不需要为规避级差把次优专业前置，这与老经验的"第一志愿保守一点"直接冲突，在新规则下那种保守只是白白损失冲刺机会。文章随后拆解真正会栽跟头的三条：一是调剂只在院校专业组内进行，很多家庭误以为服从调剂等于全校范围调剂，实际上"组"是边界，真正该决策的不是要不要服从调剂而是这个专业组值不值得填；二是在"专业（类）+院校"志愿模式的省份部分高校明确规定不满足专业志愿条件时不进行调剂、直接退档，因为这些省份专业本身就是志愿单位；三是不服从调剂的后果是退档，平行志愿下退档通常导致本批次其余志愿同时失效，且部分省级考试院明确考生不得以自愿放弃为由申请退档，并要求在每个院校专业组志愿中都必须逐条选择愿否服从调剂。之后用对照表给出四组策略调整（第一志愿就填最想去的、调剂须填报时逐条勾选、选组比选调剂更重要、用近三年专业录取位次代替往年最低分），并补充同分排序规则（多数按各省规则，无明确规定时依次比较语文数学外语单科成绩）与部分高校调剂时优先考虑与原填报专业相近或相关专业并参考优势科目的偏好。最后说明分数清的本质是分数高的人先挑专业，因此决定能否读某专业的是在所有投档考生中的相对位置即录取位次，而分数因试题难度、考生人数与招生计划每年变化不可比，位次才跨年份相对可比，需要查的是院校投档位次与专业录取位次两项分省近三年数据。文末提示可用久元输入位次查询院校与专业录取位次、使用跨省位次换算并进入冲稳保推荐，并声明各高校专业录取规则、是否设置级差与调剂范围均以该校当年招生章程为唯一依据。'
  }
];
const DATE = '2026-09-27';

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
const anchor = '  <url>\n    <loc>https://9ybzy.com/articles/2026-09-26-tiyulei-santiaolu-qubie.html</loc>';
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
