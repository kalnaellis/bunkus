import { NextResponse } from "next/server";
import { uploadCaseFiles } from "@/lib/google";
import { uploadMetaSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((item): item is File => item instanceof File && item.size > 0);

    const parsedMeta = uploadMetaSchema.parse({
      caseId: formData.get("caseId"),
      rowIndex: formData.get("rowIndex"),
      folderId: formData.get("folderId")
    });

    if (!files.length) {
      return NextResponse.json({ message: "No files provided." }, { status: 400 });
    }

    const uploaded = await uploadCaseFiles({
      caseId: parsedMeta.caseId,
      rowIndex: parsedMeta.rowIndex,
      folderId: parsedMeta.folderId,
      files
    });

    return NextResponse.json({ uploaded }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Upload failed." }, { status: 400 });
  }
}
