import { google } from "googleapis";
import { createCaseId } from "@/lib/caseId";

const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/spreadsheets"
];

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function getAuth() {
  const clientEmail = getEnv("GOOGLE_CLIENT_EMAIL");
  const privateKey = getEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES
  });
}

export async function createCaseRow(params: {
  name: string;
  email: string;
  consentTextVersion: string;
  consentChecked: boolean;
  ip?: string;
  userAgent?: string;
}) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const drive = google.drive({ version: "v3", auth });

  const spreadsheetId = getEnv("GOOGLE_SHEETS_ID");
  const intakeSheet = process.env.GOOGLE_SHEETS_TAB ?? "intake";
  const driveRootFolderId = getEnv("GOOGLE_DRIVE_ROOT_FOLDER_ID");

  const caseId = createCaseId();
  const createdAt = new Date().toISOString();

  const appendResult = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${intakeSheet}!A:L`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          caseId,
          createdAt,
          params.name,
          params.email,
          params.consentChecked,
          params.consentTextVersion,
          params.ip ?? "",
          params.userAgent ?? "",
          "",
          "",
          "[]",
          "created"
        ]
      ]
    }
  });

  const updatedRange = appendResult.data.updates?.updatedRange;
  const rowIndex = Number(updatedRange?.match(/!(?:[A-Z]+)(\d+):/)?.[1] ?? "0");

  const folder = await drive.files.create({
    requestBody: {
      name: caseId,
      mimeType: "application/vnd.google-apps.folder",
      parents: [driveRootFolderId]
    },
    fields: "id, webViewLink"
  });

  if (!folder.data.id || !rowIndex) {
    throw new Error("Failed to create case row or drive folder.");
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${intakeSheet}!I${rowIndex}:L${rowIndex}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[folder.data.id, folder.data.webViewLink ?? "", "[]", "upload_ready"]]
    }
  });

  return {
    caseId,
    rowIndex,
    folderId: folder.data.id,
    folderUrl: folder.data.webViewLink ?? ""
  };
}

export async function uploadCaseFiles(params: {
  caseId: string;
  rowIndex: number;
  folderId: string;
  files: File[];
}) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const drive = google.drive({ version: "v3", auth });

  const spreadsheetId = getEnv("GOOGLE_SHEETS_ID");
  const intakeSheet = process.env.GOOGLE_SHEETS_TAB ?? "intake";

  const uploaded = [] as Array<{ name: string; fileId: string; url: string }>;

  for (const file of params.files) {
    const bytes = Buffer.from(await file.arrayBuffer());

    const created = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [params.folderId]
      },
      media: {
        mimeType: file.type || "application/octet-stream",
        body: bytes
      },
      fields: "id, webViewLink"
    });

    if (!created.data.id) {
      throw new Error(`Drive upload failed for ${file.name}`);
    }

    uploaded.push({
      name: file.name,
      fileId: created.data.id,
      url: created.data.webViewLink ?? ""
    });
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${intakeSheet}!K${params.rowIndex}:L${params.rowIndex}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[JSON.stringify(uploaded), "complete"]]
    }
  });

  return uploaded;
}
