// 批量发布文章：MD草稿 → HTML → 更新首页侧栏 → 更新文章列表 → 更新sitemap → 更新llms.txt
const fs = require('fs');
const path = require('path');

// ===== 配置 =====
const DRAFTS_DIR = 'E:/claude/久元报志愿宣传项目/drafts';
const ARTICLES_DIR = 'E:/claude/gaokao-site/articles';
const SITE_DIR = 'E:/claude/gaokao-site';
const LLMS_PATH = SITE_DIR + '/llms.txt';
const SITEMAP_PATH = SITE_DIR + '/sitemap.xml';
const ARTICLES_INDEX = ARTICLES_DIR + '/index.html';
const HOMEPAGE = SITE_DIR + '/index.html';

// 文章配置: [文件名前缀, slug, 标题, 描述]
const ARTICLES = [
  ['article-25-位次不用注册.md', '2026-06-28-weici-no-register',
    '查位次的工具那么多，为什么我说"不用注册"这个功能最值钱？',
    '市面查位次工具都要先注册登录获取用户信息，久元报志愿是极少数不用注册不用登录的小程序。讲清楚为什么"不做什么"比"做什么"更需要坚持。'],
  ['article-26-低分段出路.md', '2026-06-28-low-score-way-out',
    '300-450分，是不是就"没救了"？讲几句真话',
    '写给600万本科线下考生的文章。低分段填报三原则：专业优先于学校、城市比学校重要、提前规划专升本路径。不放弃就有出路。'],
  ['article-27-考砸了父母怎么说.md', '2026-06-28-parent-words',
    '孩子考砸了，父母的第一句话决定他未来四年',
    '出分后48小时是家庭矛盾爆发期。用真实案例讲父母的语言如何影响孩子的走向，出分后高情商父母的三步做法。'],
  ['article-28-志愿听谁的.md', '2026-06-28-whose-decision',
    '"我的志愿，到底该听谁的？"——写给卡在父母和自己之间的考生',
    '代际冲突话题。给出一个可操作的决策框架：划分决策权、拿数据说话、分三步解决冲突。父母和考生都该看。'],
  ['article-29-低分捡漏.md', '2026-06-28-low-score-bargain',
    '低分段也有"捡漏"机会：这些学校可能因为你我都没注意到而降分',
    '五种捡漏情况分析：扩招、改名、新专业、大小年、地理位置。底层逻辑是信息差就是捡漏空间。低分段考生必读。'],
  ['article-30-复读真实成本.md', '2026-06-28-fudu-real-cost',
    '复读一年的真实成本：你不算这笔账，可能会后悔两次',
    '经济账、时间账、概率账、心态账。用数据算清复读的完整成本后做理性决策。不管选哪条路，先把今年的志愿填了。'],
  ['article-31-当心扎堆.md', '2026-06-28-beware-crowding',
    '报志愿前多打听一件事，可能帮你避开一个"坑"',
    '填志愿时多问周围人报什么学校专业。如果很多人报同一所外省学校，竞争会异常激烈。教你三个信号判断会不会"挤爆"。'],
];

// HTML模板
function htmlTemplate(title, desc, bodyContent) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} - 久元报志愿选专业</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="https://9ybzy.com/">
<style>
body { font-family: -apple-system, 'PingFang SC', sans-serif; margin: 0; padding: 0; background: #f5f5f5; color: #333; }
.container { max-width: 800px; margin: 0 auto; padding: 20px 16px; }
h1 { font-size: 24px; line-height: 1.4; }
.article-meta { color: #999; font-size: 13px; margin: 8px 0 20px; }
.article-content { font-size: 16px; line-height: 1.8; }
.article-content p { margin: 16px 0; }
.article-content strong { color: #D97706; }
.cta { background: #D97706; color: #fff; text-align: center; padding: 16px; border-radius: 12px; margin: 24px 0; font-size: 15px; }
.cta a { color: #fff; text-decoration: none; font-weight: 600; }
.footer { text-align: center; font-size: 12px; color: #999; padding: 20px 0; }
.back { display: inline-block; margin-bottom: 16px; color: #D97706; text-decoration: none; font-size: 14px; }
</style>
</head>
<body>
<div class="container">
  <a href="/" class="back">← 返回首页</a>
  <h1>${title}</h1>
  <p class="article-meta">2026年6月28日 · 高考志愿填报</p>

  <div class="article-content">
${bodyContent}
  </div>

  <div class="cta">
    微信搜索 <strong>「久元报志愿选专业」</strong><br>
    输入分数一键生成志愿表 · 免费查位次 · 不用注册不用登录
  </div>

  <div class="footer">
    <p><a href="/">返回首页</a> · 查看更多省份和分数段</p>
  </div>
</div>
</body>
</html>`;
}

// 将markdown内容转换为HTML段落
function mdToHtml(md) {
  // 去掉YAML frontmatter
  md = md.replace(/^---[\s\S]*?---\n*/m, '');
  // 去掉h1标题（#开头的）
  md = md.replace(/^# .+\n*/gm, '');
  // 处理h3 (###)
  md = md.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  // 处理h2 (##)
  md = md.replace(/^## (.+)$/gm, '<h3>$1</h3>');
  // 处理加粗
  md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // 处理行内代码
  md = md.replace(/`(.+?)`/g, '<code>$1</code>');
  // 处理列表项
  md = md.replace(/^- (.+)$/gm, '<li>$1</li>');
  // 包裹连续li
  md = md.replace(/(<li>.*<\/li>\n?)+/g, function(match) {
    return '<ul>' + match.replace(/\n$/, '') + '</ul>';
  });
  // 处理表格
  md = md.replace(/\|.+\|\n\|[-| ]+\|\n((?:\|.+\|\n?)*)/g, function(match) {
    var rows = match.trim().split('\n');
    var html = '<table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:14px;">';
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].indexOf('---') !== -1) continue;
      var cells = rows[i].split('|').filter(function(c) { return c.trim(); });
      var tag = i === 1 ? 'th' : 'td';
      html += '<tr>';
      for (var j = 0; j < cells.length; j++) {
        html += '<' + tag + ' style="border:1px solid #ddd;padding:6px 8px;text-align:left;">' + cells[j].trim() + '</' + tag + '>';
      }
      html += '</tr>';
    }
    html += '</table>';
    return html;
  });
  // 处理水平线
  md = md.replace(/^---$/gm, '<hr>');
  // 剩下的空行分隔的段落
  var paragraphs = md.split(/\n\n+/);
  var html = '';
  for (var i = 0; i < paragraphs.length; i++) {
    var p = paragraphs[i].trim();
    if (!p) continue;
    if (p.indexOf('<h3>') === 0 || p.indexOf('<ul>') === 0 || p.indexOf('<table') === 0 || p.indexOf('<hr>') === 0 || p.indexOf('<li>') === 0) {
      html += p + '\n';
    } else if (p.indexOf('*久元报志愿') !== -1) {
      html += '<p style="color:#999;font-size:14px;text-align:center;margin-top:24px;">' + p.replace(/\n/g, '<br>') + '</p>\n';
    } else {
      html += '<p>' + p.replace(/\n/g, '<br>') + '</p>\n';
    }
  }
  return html;
}

// ===== 执行 =====
var log = [];
var createdFiles = [];

// 生成HTML文件
for (var i = 0; i < ARTICLES.length; i++) {
  var cfg = ARTICLES[i];
  var mdPath = DRAFTS_DIR + '/' + cfg[0];
  var htmlPath = ARTICLES_DIR + '/' + cfg[1] + '.html';
  var md = fs.readFileSync(mdPath, 'utf8');
  var body = mdToHtml(md);
  var html = htmlTemplate(cfg[2], cfg[3], body);
  fs.writeFileSync(htmlPath, html, 'utf8');
  createdFiles.push({ slug: cfg[1], title: cfg[2], desc: cfg[3] });
  log.push('  ✓ ' + cfg[1] + '.html');
}

console.log('=== 已创建 ' + createdFiles.length + ' 个HTML文件 ===');
console.log(log.join('\n'));

// 更新首页侧栏（最新5篇）
var homepageContent = fs.readFileSync(HOMEPAGE, 'utf8');
var sidebarStart = homepageContent.indexOf('<div class="articles-sidebar">');
var sidebarEnd = homepageContent.indexOf('</div>', sidebarStart + 20);
var sidebarEnd2 = homepageContent.indexOf('</div>', sidebarEnd + 1);
// 找到"查看全部文章"那个</div>之后的</div>
var oldSidebar = homepageContent.substring(sidebarStart, sidebarEnd2 + 6);

var newSidebarItems = '';
for (var i = 0; i < Math.min(createdFiles.length, 5); i++) {
  var a = createdFiles[i];
  newSidebarItems += '    <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;"><a href="/articles/' + a.slug + '.html" style="color: #D97706; text-decoration: none; font-size: 14px; line-height: 1.4; display: block;">' + a.title + '</a><span style="font-size: 11px; color: #999;">2026-06-28</span></div>\n';
}

var newSidebar = '    <div class="articles-sidebar">\n    <h3 style="font-size: 16px; margin: 0 0 12px; color: #333;">最新文章</h3>\n' + newSidebarItems + '    <p style="margin: 12px 0 0; font-size: 12px; color: #999; text-align: center;"><a href="/articles/" style="color: #D97706;">查看全部文章 →</a></p>\n  </div>';

homepageContent = homepageContent.replace(oldSidebar, newSidebar);
fs.writeFileSync(HOMEPAGE, homepageContent, 'utf8');
console.log('\n=== 首页侧栏已更新 ===');

// 更新文章列表页
var articlesIndexContent = fs.readFileSync(ARTICLES_INDEX, 'utf8');
var listStart = articlesIndexContent.indexOf('<ul class="article-list">');
var listEnd = articlesIndexContent.indexOf('</ul>', listStart);

var newItems = '';
for (var i = 0; i < createdFiles.length; i++) {
  var a = createdFiles[i];
  newItems += '    <li>\n      <a href="/articles/' + a.slug + '.html">' + a.title + '</a>\n      <div class="date">2026-06-28</div>\n    </li>\n';
}

var oldList = articlesIndexContent.substring(listStart, listEnd + 5);
var newList = '<ul class="article-list">\n' + newItems + articlesIndexContent.substring(listStart + 26, listEnd + 5);
// Actually, let's just insert after the <ul> tag
var insertPoint = articlesIndexContent.indexOf('<ul class="article-list">') + 26;
var existingAfterUl = articlesIndexContent.substring(insertPoint, listEnd + 5);
var fullNewList = '<ul class="article-list">\n' + newItems + existingAfterUl;
articlesIndexContent = articlesIndexContent.replace(oldList, fullNewList);

// Update article count
articlesIndexContent = articlesIndexContent.replace(
  /共 \d+ 篇文章/,
  '共 ' + (createdFiles.length + parseInt(articlesIndexContent.match(/共 (\d+) 篇文章/)[1] || 107)) + ' 篇文章'
);
fs.writeFileSync(ARTICLES_INDEX, articlesIndexContent, 'utf8');
console.log('=== 文章列表页已更新 ===');

// 更新llms.txt
var llmsContent = fs.readFileSync(LLMS_PATH, 'utf8');
var articleSectionStart = llmsContent.indexOf('## 文章');
if (articleSectionStart !== -1) {
  var articleSectionEnd = llmsContent.indexOf('\n## ', articleSectionStart + 5);
  if (articleSectionEnd === -1) articleSectionEnd = llmsContent.length;
  var oldArticleSection = llmsContent.substring(articleSectionStart, articleSectionEnd);

  var newArticleLines = '## 文章\n';
  for (var i = 0; i < createdFiles.length; i++) {
    var a = createdFiles[i];
    newArticleLines += '\n- [' + a.title + '](https://9ybzy.com/articles/' + a.slug + '.html): ' + a.desc;
  }
  var existingArticles = oldArticleSection.split('\n').slice(1).join('\n');
  newArticleLines += existingArticles;

  llmsContent = llmsContent.replace(oldArticleSection, newArticleLines);
  fs.writeFileSync(LLMS_PATH, llmsContent, 'utf8');
  console.log('=== llms.txt 已更新 ===');
}

// 更新sitemap
var sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
var insertAfter = '<priority>1.0</priority>';
var insertPos = sitemapContent.indexOf(insertAfter) + insertAfter.length;

var newUrls = '';
for (var i = 0; i < createdFiles.length; i++) {
  var a = createdFiles[i];
  newUrls += '\n        <url>\n    <loc>https://9ybzy.com/articles/' + a.slug + '.html</loc>\n    <lastmod>2026-06-28</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>';
}

sitemapContent = sitemapContent.substring(0, insertPos) + newUrls + sitemapContent.substring(insertPos);
fs.writeFileSync(SITEMAP_PATH, sitemapContent, 'utf8');
console.log('=== sitemap.xml 已更新 ===');

// ===== 验证 index.html 完整性 =====
function validateHtml(filePath, label) {
  var content = fs.readFileSync(filePath, 'utf8');
  var errors = [];
  if (content.indexOf('<!DOCTYPE html>') !== 0) errors.push('缺少 DOCTYPE 声明（文件开头不是 <!DOCTYPE html>）');
  if (content.indexOf('<html') === -1) errors.push('缺少 <html> 标签');
  if (content.indexOf('<head>') === -1) errors.push('缺少 <head> 标签');
  if (content.indexOf('</head>') === -1) errors.push('缺少 </head> 标签');
  if (content.indexOf('<body') === -1) errors.push('缺少 <body> 标签');
  if (content.indexOf('</body>') === -1) errors.push('缺少 </body> 标签');
  if (content.indexOf('</html>') === -1) errors.push('缺少 </html> 标签');

  if (errors.length > 0) {
    console.error('\n❌ ' + label + ' 完整性验证失败：');
    errors.forEach(function(e) { console.error('   - ' + e); });
    process.exit(1);
  }
  console.log('   ✓ ' + label + ' 完整性通过（DOCTYPE/html/head/body 齐全）');
}

validateHtml(HOMEPAGE, '首页');
validateHtml(ARTICLES_INDEX, '文章列表页');

console.log('\n✅ 全部完成！共发布 ' + createdFiles.length + ' 篇文章');
