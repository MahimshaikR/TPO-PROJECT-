const generateCSV = (headers, rows) => {
  const escapeVal = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = headers.map(h => escapeVal(h.label)).join(',');
  const rowLines = rows.map(row => {
    return headers.map(h => escapeVal(row[h.key])).join(',');
  });

  return [headerLine, ...rowLines].join('\r\n');
};

const generateExcelHTML = (sheetName, headers, rows) => {
  let table = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${sheetName}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
  <body>
  <table border="1">
    <thead>
      <tr style="background-color: #1e3a8a; color: #ffffff; font-weight: bold;">
        ${headers.map(h => `<th style="padding: 8px;">${h.label}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${rows.map(row => `
        <tr>
          ${headers.map(h => `<td style="padding: 6px;">${row[h.key] !== undefined && row[h.key] !== null ? row[h.key] : ''}</td>`).join('')}
        </tr>
      `).join('')}
    </tbody>
  </table>
  </body></html>`;
  return table;
};

module.exports = {
  generateCSV,
  generateExcelHTML
};
