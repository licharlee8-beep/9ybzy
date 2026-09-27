const fs=require('fs');
const h=fs.readFileSync('articles/index.html','utf8');
const m=[...h.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
const out=m.map(x=>x[1]+'\t'+x[2].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim()).filter(x=>x[1].includes('2026-'));
fs.writeFileSync('_titles_gk.txt',out.join('\n'),'utf8');
console.log('count=',out.length);
console.log(out.slice(-12).join('\n'));
