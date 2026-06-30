const fs = require('fs');
const path = require('path');

// ====== 更新 articles/index.html ======
let articlesHtml = fs.readFileSync(path.join(__dirname, '../articles/index.html'), 'utf-8');

const newArticles = [
  { href: '/articles/2026-07-01-cctv-expose.html', title: '看了央视的报道后，你还敢找那么贵的志愿规划师吗', date: '2026-07-01' },
  { href: '/articles/2026-07-01-cctv-scam.html', title: '央视没说完的真相：天价规划师背后的人头生意，两万块一个学生', date: '2026-07-01' },
];

// Build new article list items
const newListItems = newArticles.map(a =>
  `    <li>\n      <a href="${a.href}">${a.title}</a>\n      <div class="date">${a.date}</div>\n    </li>`
).join('\n');

// Insert after <ul class="article-list"> line
articlesHtml = articlesHtml.replace(
  '<ul class="article-list">',
  '<ul class="article-list">\n' + newListItems
);

fs.writeFileSync(path.join(__dirname, '../articles/index.html'), articlesHtml);
console.log('articles/index.html updated');

// ====== 更新 index.html 侧栏 ======
let indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');

// The sidebar has 5 articles, we need to add 2 new at top, remove bottom 2
const sidebarBlock = `	    <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;"><a href="/articles/2026-07-01-living-north-south.html" style="color: #D97706; text-decoration: none; font-size: 14px; line-height: 1.4; display: block;">北方人在南方上学没暖气，南方人去北方公共澡堂——南北生活大碰撞</a><span style="font-size: 11px; color: #999;">2026-07-01</span></div>
	    <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;"><a href="/articles/2026-07-01-living-5-questions.html" style="color: #D97706; text-decoration: none; font-size: 14px; line-height: 1.4; display: block;">填志愿时没问这5个问题，开学第一天就后悔了</a><span style="font-size: 11px; color: #999;">2026-07-01</span></div>
	    <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;"><a href="/articles/2026-06-30-living-ac.html" style="color: #D97706; text-decoration: none; font-size: 14px; line-height: 1.4; display: block;">大学有没有空调，正在成为填志愿的"隐藏硬指标"</a><span style="font-size: 11px; color: #999;">2026-06-30</span></div>
	    <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;"><a href="/articles/2026-06-30-living-dorm.html" style="color: #D97706; text-decoration: none; font-size: 14px; line-height: 1.4; display: block;">选大学就是选第二个家：宿舍条件比你想象的重要得多</a><span style="font-size: 11px; color: #999;">2026-06-30</span></div>
	    <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;"><a href="/articles/2026-06-30-living-canteen.html" style="color: #D97706; text-decoration: none; font-size: 14px; line-height: 1.4; display: block;">大学食堂好吃有多重要？过来人：直接影响你的体重和幸福感</a><span style="font-size: 11px; color: #999;">2026-06-30</span></div>`;

const newSidebar = `	    <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;"><a href="/articles/2026-07-01-cctv-expose.html" style="color: #D97706; text-decoration: none; font-size: 14px; line-height: 1.4; display: block;">看了央视的报道后，你还敢找那么贵的志愿规划师吗</a><span style="font-size: 11px; color: #999;">2026-07-01</span></div>
	    <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;"><a href="/articles/2026-07-01-cctv-scam.html" style="color: #D97706; text-decoration: none; font-size: 14px; line-height: 1.4; display: block;">央视没说完的真相：天价规划师背后的人头生意，两万块一个学生</a><span style="font-size: 11px; color: #999;">2026-07-01</span></div>
	    <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;"><a href="/articles/2026-07-01-living-north-south.html" style="color: #D97706; text-decoration: none; font-size: 14px; line-height: 1.4; display: block;">北方人在南方上学没暖气，南方人去北方公共澡堂——南北生活大碰撞</a><span style="font-size: 11px; color: #999;">2026-07-01</span></div>
	    <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;"><a href="/articles/2026-07-01-living-5-questions.html" style="color: #D97706; text-decoration: none; font-size: 14px; line-height: 1.4; display: block;">填志愿时没问这5个问题，开学第一天就后悔了</a><span style="font-size: 11px; color: #999;">2026-07-01</span></div>
	    <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;"><a href="/articles/2026-06-30-living-ac.html" style="color: #D97706; text-decoration: none; font-size: 14px; line-height: 1.4; display: block;">大学有没有空调，正在成为填志愿的"隐藏硬指标"</a><span style="font-size: 11px; color: #999;">2026-06-30</span></div>`;

if (indexHtml.includes(sidebarBlock)) {
  indexHtml = indexHtml.replace(sidebarBlock, newSidebar);
  fs.writeFileSync(path.join(__dirname, '../index.html'), indexHtml);
  console.log('index.html sidebar updated');
} else {
  console.log('ERROR: sidebar block not found in index.html');
  // Try to find it
  const idx = indexHtml.indexOf('北方人在南方上学没暖气');
  if (idx >= 0) {
    console.log('Found at position:', idx);
    console.log('Context:', indexHtml.substring(idx - 50, idx + 300));
  }
}

// ====== 更新 sitemap.xml ======
let sitemap = fs.readFileSync(path.join(__dirname, '../sitemap.xml'), 'utf-8');

const newSitemapEntries = `  <url>
    <loc>https://9ybzy.com/articles/2026-07-01-cctv-expose.html</loc>
    <lastmod>2026-07-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
        <url>
    <loc>https://9ybzy.com/articles/2026-07-01-cctv-scam.html</loc>
    <lastmod>2026-07-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
        `;

// Insert after the homepage url entry
sitemap = sitemap.replace(
  '    <priority>1.0</priority>\n        <url>',
  '    <priority>1.0</priority>\n        ' + newSitemapEntries + '<url>'
);

fs.writeFileSync(path.join(__dirname, '../sitemap.xml'), sitemap);
console.log('sitemap.xml updated');

// ====== 更新 llms.txt ======
let llms = fs.readFileSync(path.join(__dirname, '../llms.txt'), 'utf-8');

const newLlmsEntries = `- [看了央视的报道后，你还敢找那么贵的志愿规划师吗](https://9ybzy.com/articles/2026-07-01-cctv-expose.html): 央视6月25日曝光高考志愿填报行业黑幕：万元"资深高报师"身份造假、证书P图、方案全靠免费AI生成。两个月速成的"专家"，凭什么叫价12980元？
- [央视没说完的真相：天价规划师背后的人头生意，两万块一个学生](https://9ybzy.com/articles/2026-07-01-cctv-scam.html): 央视曝光了志愿规划师造假，但更深层的内幕是：志愿填报只是引流工具，真正赚钱的是把学生"卖"给自考本科助学班，一个人头两万块。`;

// Find the articles section in llms.txt
const articlesSectionMarker = '## 文章';
const afterArticlesSection = llms.indexOf(articlesSectionMarker);
if (afterArticlesSection >= 0) {
  // Find first article link after the section header
  const firstArticleLink = llms.indexOf('- [', afterArticlesSection + 10);
  if (firstArticleLink >= 0) {
    llms = llms.slice(0, firstArticleLink) + newLlmsEntries + '\n' + llms.slice(firstArticleLink);
    fs.writeFileSync(path.join(__dirname, '../llms.txt'), llms);
    console.log('llms.txt updated');
  }
}

console.log('\nAll updates done!');
