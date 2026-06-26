/**
 * Parse 浙江省2025年普通高校招生投档及专业录取情况 (平行投档一、二段)
 * Output: JSON in major_score_data.json format (province -> school -> program -> {score, rank})
 */

const fs = require('fs');

const text = fs.readFileSync('E:/claude/gaokao-site/zhejiang_2025_raw.txt', 'utf8');
const lines = text.split(/\r?\n/);

// Full-width to ASCII digit converter
const fw2ascii = (s) => {
  if (!s) return s;
  return s.replace(/[０１２３４５６７８９]/g, d => '０１２３４５６７８９'.indexOf(d).toString());
};

// School code pattern: 4 full-width digits at start of line
// Must NOT be a page header like "２０２５ 年浙江省普通高校招生..."
const isSchoolLine = (s) => /^[０１２３４５６７８９]{4} /.test(s) && !s.includes('年浙江省普通高校招生');

// Known single-word subject keywords (for dynamic detection)
const SUBJECT_KEYWORDS = new Set(['不限', '物理', '化学', '历史', '地理', '生物', '思想政治', '技术', '外语']);
const SUBJECT_SEPARATORS = new Set(['＆', '&', '／', '/', '或']);

// Dynamically detect subject requirement at the END of text before numbers
// Walks backward from end, collecting known subject keywords and separators
function matchSubject(text) {
  const tokens = text.split(/\s+/);
  const subjTokens = [];
  let idx = tokens.length - 1;
  while (idx >= 0) {
    const t = tokens[idx];
    if (SUBJECT_KEYWORDS.has(t) || SUBJECT_SEPARATORS.has(t)) {
      subjTokens.unshift(t);
      idx--;
    } else break;
  }
  if (subjTokens.length === 0) return null;

  const subject = subjTokens.join(' ');
  // Calculate char index: sum of (token length + 1 space) for non-subject tokens
  let charIdx = 0;
  for (let i = 0; i < tokens.length - subjTokens.length; i++) {
    charIdx += tokens[i].length + 1;
  }
  if (charIdx > 0 && text[charIdx - 1] === ' ') charIdx--;

  return { subject, subjectEndIdx: charIdx };
}

// Check if a line is a page header (contains ·page· or "年浙江省普通高校招生")
const isPageHeader = (s) => /·\d+·/.test(s) || s.includes('年浙江省普通高校招生');

const isHeaderLine = (s) => {
  const headers = new Set([
    '院校代码、院校（专业）', '名称、所在地', '选考科目', '范围要求',
    '录取人数', '录', '取', '人', '数', '学制', '学', '制',
    '平均分', '平', '均', '分', '最低分', '最', '低', '分', '位次', '位',
    '一段 二段', '一段', '二段', '次',
    '科类（方向）', '（综', '合', '分）︵录', '取', '平', '均',
    '分︶', '︵综合分︶录取平均分',
  ]);
  if (headers.has(s.trim())) return true;
  // Also match partial column headers
  if (/^(院校代码|名称、|选考科目|范围要求|录取人数|录$|取$|人$|数$|学制|学$|制$|平均分|平$|均$|分$|最低分|最$|低$|位次|位$|次$|一段|二段|科类|︵综|合$|分︶|︵综合)/.test(s.trim())) return true;
  return false;
};

// Find data boundaries
let dataStart = -1, dataEnd = -1;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.includes('平行投档一、二段各专业录取情况')) {
    if (dataStart === -1) dataStart = i;
  }
  if (/艺术类平行投档/.test(line)) {
    dataEnd = i;
    break;
  }
}

console.log(`Data section: line ${dataStart} to ${dataEnd}`);

// Province markers found in the file
const provinceOrder = [];
for (let i = dataStart; i < dataEnd; i++) {
  const m = lines[i].trim().match(/^［(.+?)］$/);
  if (m) provinceOrder.push({ province: m[1], line: i });
}
console.log('Provinces found:', provinceOrder.map(p => p.province).join(', '));

// Province name normalization
const PROVINCE_MAP = {
  '浙江': '浙江', '北京': '北京', '天津': '天津', '河北': '河北',
  '山西': '山西', '内蒙古': '内蒙古', '辽宁': '辽宁', '吉林': '吉林',
  '黑龙江': '黑龙江', '上海': '上海', '江苏': '江苏', '安徽': '安徽',
  '福建': '福建', '江西': '江西', '山东': '山东', '河南': '河南',
  '湖北': '湖北', '湖南': '湖南', '广东': '广东', '广西': '广西',
  '海南': '海南', '重庆': '重庆', '四川': '四川', '贵州': '贵州',
  '云南': '云南', '西藏': '西藏', '陕西': '陕西', '甘肃': '甘肃',
  '青海': '青海', '宁夏': '宁夏', '新疆': '新疆', '香港': '香港',
};

// ========== MAIN PARSER ==========

const result = {}; // province -> school -> program -> {score, rank, [score2, rank2]}

let currentProvince = null;
let currentSchool = null;
let lineCount = 0;
let progCount = 0;
let multiTokenProgCount = 0;
let erDuanCount = 0;

// Province is determined by the section heading (［浙江］, ［北京］, etc.)
// We use currentProvince directly, not extracted from location string.
// This avoids issues like "北京理工大学（珠海）" incorrectly mapping to 珠海.

function parseProgramLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  if (isPageHeader(trimmed)) return null;
  if (isSchoolLine(trimmed)) return null;
  if (isHeaderLine(trimmed)) return null;
  if (/^·\d+·/.test(trimmed)) return null;
  if (/^［/.test(trimmed)) return null;

  // Check for sufficient full-width numbers
  const fwNums = trimmed.match(/[０１２３４５６７８９]+/g);
  if (!fwNums || fwNums.length < 4) return null;

  // Find the first full-width digit
  const firstNumIdx = trimmed.search(/[０１２３４５６７８９]/);
  const beforeNums = trimmed.substring(0, firstNumIdx).trimEnd();

  // Match subject requirement at end of beforeNums
  const subjectMatch = matchSubject(beforeNums);
  if (!subjectMatch) return null;

  const programName = beforeNums.substring(0, subjectMatch.subjectEndIdx).trim();
  const subject = subjectMatch.subject;
  const afterStr = trimmed.substring(firstNumIdx).trim();

  // Parse numeric fields
  const numStr = fw2ascii(afterStr);
  const nums = numStr.split(/\s+/).filter(s => /^\d+$/.test(s)).map(Number);

  if (nums.length < 5) return null; // Need at least: 人数, 学制, 平均分, 最低分, 位次

  const [count, duration, avgScore, minScore, rank, ...rest] = nums;

  // Validate reasonable values
  if (count < 0 || count > 500) return null;
  if (duration < 2 || duration > 8) {
    // Could be "八年医" etc., store duration anyway
  }
  if (avgScore < 200 || avgScore > 750) return null;
  if (minScore < 200 || minScore > 750) return null;
  if (rank < 0 || rank > 500000) return null;

  // Check for 二段 data
  let result = {
    score: minScore,
    rank: rank,
  };

  if (rest.length >= 2) {
    result.score2 = rest[0];
    result.rank2 = rest[1];
  }

  return { programName, subject, count, duration, avgScore, ...result };
}

// Now parse the entire data section
for (let i = dataStart; i < dataEnd; i++) {
  const rawLine = lines[i];
  const trimmed = rawLine.trim();

  if (!trimmed) continue;

  // Province marker
  const provMatch = trimmed.match(/^［(.+?)］$/);
  if (provMatch) {
    const provName = provMatch[1];
    if (PROVINCE_MAP[provName]) {
      currentProvince = provName;
      if (!result[currentProvince]) result[currentProvince] = {};
      console.log(`  Parsing: ${currentProvince} (line ${i})`);
    }
    continue;
  }

  // Page header
  if (isPageHeader(trimmed)) continue;

  // Column headers
  if (isHeaderLine(trimmed)) continue;

  // School line
  if (isSchoolLine(trimmed)) {
    currentSchool = null;

    // Parse: "０００１ 浙江大学（浙江·杭州）"
    const codeMatch = trimmed.match(/^[０１２３４５６７８９]{4}\s+(.+)/);
    if (!codeMatch) continue;

    const fullName = codeMatch[1].trim();

    // Extract school name from "浙江大学（浙江·杭州）" or similar
    // Just get the name part before the first parenthesis
    const nameMatch = fullName.match(/^(.+?)[（(]/);
    let schoolName = nameMatch ? nameMatch[1].trim() : fullName;

    // Use currentProvince (section heading) as the province key
    const provKey = currentProvince;
    if (!provKey) continue;

    if (!result[provKey]) result[provKey] = {};
    if (!result[provKey][schoolName]) {
      result[provKey][schoolName] = {};
    }
    currentSchool = schoolName;
    lineCount++;

    continue;
  }

  // Program line
  if (!currentSchool) continue;

  // Quick pre-check: does it have enough full-width numbers?
  const fwNums = trimmed.match(/[０１２３４５６７８９]+/g);
  if (!fwNums || fwNums.length < 4) continue;

  const parsed = parseProgramLine(trimmed);
  if (parsed) {
    const { programName, score, rank, score2, rank2 } = parsed;
    const provKey = currentProvince;
    if (!provKey) continue;

    if (!result[provKey]) result[provKey] = {};
    if (!result[provKey][currentSchool]) {
      result[provKey][currentSchool] = {};
    }

    const entry = { score, rank };
    if (score2 !== undefined) {
      entry.score2 = score2;
      entry.rank2 = rank2;
      erDuanCount++;
    }

    result[currentProvince][currentSchool][programName] = entry;
    progCount++;
  }
}

// Stats
let totalSchools = 0, totalProgs = 0;
for (const prov of Object.keys(result)) {
  const schools = Object.keys(result[prov]).length;
  totalSchools += schools;
  for (const sch of Object.keys(result[prov])) {
    totalProgs += Object.keys(result[prov][sch]).length;
  }
}

console.log(`\n=== PARSING RESULTS ===`);
console.log(`Schools found: ${totalSchools}`);
console.log(`Programs found: ${totalProgs}`);
console.log(`With 二段 data: ${erDuanCount}`);

// Output
const outputPath = 'E:/claude/gaokao-site/zhejiang_2025_parsed.json';
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
console.log(`\nOutput written to: ${outputPath}`);
console.log(`File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(1)} MB`);
