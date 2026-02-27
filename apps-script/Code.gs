/**
 * Google Apps Script backend for static intake frontend.
 * Deploy as a Web App, then set NEXT_PUBLIC_APPS_SCRIPT_URL to the deployed URL.
 */

const SHEET_NAME = 'Intake';
const CASE_PREFIX = 'CASE';
const ALLOWED_MIME = {
  'application/pdf': true,
  'application/msword': true,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
  'image/jpeg': true,
  'image/png': true,
  'application/zip': true,
  'application/x-zip-compressed': true
};

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    if (payload.action === 'intake') {
      return json(intake(payload));
    }

    if (payload.action === 'upload') {
      return json(upload(payload));
    }

    return json({ error: 'Unsupported action' }, 400);
  } catch (error) {
    return json({ error: String(error) }, 400);
  }
}

function intake(payload) {
  if (!payload.name || !payload.email || payload.consent !== true) {
    throw new Error('name/email/consent required');
  }

  const sheet = getSheet();
  const caseId = createCaseId();
  const folder = DriveApp.createFolder(caseId);

  const row = [
    new Date().toISOString(),
    payload.name,
    payload.email,
    true,
    payload.source || 'site',
    caseId,
    0,
    '[]',
    ''
  ];

  sheet.appendRow(row);
  const rowIndex = sheet.getLastRow();

  return {
    caseId,
    rowIndex,
    folderId: folder.getId(),
    folderUrl: folder.getUrl()
  };
}

function upload(payload) {
  if (!payload.caseId || !payload.rowIndex || !Array.isArray(payload.files)) {
    throw new Error('caseId, rowIndex, files[] required');
  }

  const sheet = getSheet();
  const rowIndex = Number(payload.rowIndex);
  const caseId = String(payload.caseId);
  const folder = findOrCreateCaseFolder(caseId);

  const uploads = payload.files.map((file) => {
    if (!file.name || !file.content) {
      throw new Error('Each file requires name + content');
    }

    const mimeType = file.type || 'application/octet-stream';
    if (!ALLOWED_MIME[mimeType] && mimeType !== 'application/octet-stream') {
      throw new Error('Unsupported file type: ' + mimeType);
    }

    const blob = Utilities.newBlob(Utilities.base64Decode(file.content), mimeType, file.name);
    const created = folder.createFile(blob);

    return {
      name: file.name,
      url: created.getUrl(),
      id: created.getId(),
      status: 'uploaded'
    };
  });

  sheet.getRange(rowIndex, 7).setValue(uploads.length);
  sheet.getRange(rowIndex, 8).setValue(JSON.stringify(uploads));

  return { files: uploads };
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['timestamp', 'name', 'email', 'consent', 'source', 'case_id', 'files_count', 'file_links', 'notes']);
  }

  return sheet;
}

function findOrCreateCaseFolder(caseId) {
  const folders = DriveApp.getFoldersByName(caseId);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(caseId);
}

function createCaseId() {
  const year = new Date().getUTCFullYear();
  const rand = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return `${CASE_PREFIX}-${year}-${rand}`;
}

function json(payload, status) {
  const output = ContentService.createTextOutput(JSON.stringify(payload));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
