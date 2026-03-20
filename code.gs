function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('Hệ Thống Tra Cứu Điều Phối Pro')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetConfigs = [
    { name: "Ca 1", type: "Nhân Sự" },
    { name: "Ca 2", type: "Nhân Sự" },
    { name: "Ca 3", type: "Nhân Sự" },
    { name: "LXX C3", type: "Xuất Tải" }
  ];
  
  let allData = [];
  
  sheetConfigs.forEach(config => {
    const sheet = ss.getSheetByName(config.name);
    if (sheet) {
      const data = sheet.getDataRange().getDisplayValues();
      if (data.length < 2) return;
      
      const headers = data[0].map(h => h.toLowerCase().trim());
      
      for (let i = 1; i < data.length; i++) {
        let obj = { 
          _sheet: config.name, 
          _type: config.type,
          _rowId: config.name + i
        };
        headers.forEach((header, index) => {
          if (header) obj[header] = data[i][index];
        });
        allData.push(obj);
      }
    }
  });
  return allData;
}
