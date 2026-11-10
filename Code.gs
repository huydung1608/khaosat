/**
 * Google Apps Script – nhận câu trả lời khảo sát và ghi vào Google Sheets.
 * Dán toàn bộ file này vào Tiện ích mở rộng → Apps Script của bảng tính.
 */

// Tên trang tính (tab) để ghi câu trả lời. Tự tạo nếu chưa có.
const SHEET_NAME = 'Câu trả lời';

// Email nhận thông báo khi có khảo sát mới. Để '' nếu không cần.
const NOTIFY_EMAIL = '';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const data = JSON.parse(e.postData.contents);
    const row = data.row || {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Lấy tiêu đề cột hiện có; thêm cột mới nếu bộ câu hỏi thay đổi
    let headers = [];
    if (sh.getLastRow() > 0 && sh.getLastColumn() > 0) {
      headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
    }
    Object.keys(row).forEach(function (k) {
      if (headers.indexOf(k) === -1) headers.push(k);
    });
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#e9effd');
    sh.setFrozenRows(1);

    const values = headers.map(function (h) { return row[h] !== undefined ? row[h] : ''; });
    sh.appendRow(values);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        'Khảo sát web mới: ' + (data.name || 'Không tên') + ' – ' + (data.phone || ''),
        (data.text || '') + '\n\n' +
        'Điểm phức tạp: ' + (row['Điểm phức tạp (nội bộ)'] || '') + '\n' +
        'Mức độ: ' + (row['Mức độ (nội bộ)'] || '') + '\n' +
        'Gợi ý giá: ' + (row['Gợi ý giá (nội bộ)'] || '') + '\n\n' +
        'Xem bảng tính: ' + ss.getUrl()
      );
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Mở URL Web App trên trình duyệt để kiểm tra đã triển khai đúng chưa
function doGet() {
  return ContentService.createTextOutput('Web App khảo sát đang hoạt động.');
}
