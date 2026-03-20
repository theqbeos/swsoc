const SOURCE_ID = '1rNFxGXT32vX2SyN_MDtYKlUJ-6lGY18YoXY1Lu8VFy4';
const CACHE_KEY = "SUNSHINE_DATA";
const CACHE_TTL = 600;

function doGet() { return HtmlService.createHtmlOutputFromFile('SearchForm'); }

function getAllData() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get(CACHE_KEY);
  if(cached) return JSON.parse(cached);

  const ss = SpreadsheetApp.openById(SOURCE_ID);
  const sheet = ss.getSheets()[0];
  const data = sheet.getDataRange().getValues();

  cache.put(CACHE_KEY, JSON.stringify(data), CACHE_TTL);
  return data;
}

// Live search theo Họ tên
function searchData(criteria) {
  const data = getAllData();
  const headers = data[0];
  const colHoTen = headers.findIndex(h => h.toLowerCase().includes('tên'));
  const keywords = (criteria.hoTen||'').toLowerCase().split(/\s+/).filter(Boolean);

  const result = data.slice(1).filter(r=>{
    if(!keywords.length) return true;
    return keywords.every(k => (r[colHoTen]||'').toString().toLowerCase().includes(k));
  });

  return { headers, data: result, total: result.length, keywords };
}

// Auto-suggest Họ tên
function suggestName(keyword) {
  const data = getAllData();
  const headers = data[0];
  const colHoTen = headers.findIndex(h => h.toLowerCase().includes('tên'));
  const list = new Set();
  data.slice(1).forEach(r=>{ const ht=r[colHoTen]||''; if(ht.toLowerCase().includes(keyword.toLowerCase())) list.add(ht); });
  return [...list].slice(0,10);
}
