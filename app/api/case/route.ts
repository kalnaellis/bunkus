import { NextRequest, NextResponse } from "next/server";
import { createCaseRow } from "@/lib/google";
import { caseSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = caseSchema.parse(payload);

    const result = await createCaseRow({
      name: parsed.name,
      email: parsed.email,
      consentTextVersion: parsed.consentTextVersion,
      consentChecked: parsed.consent,
      ip: request.ip ?? request.headers.get("x-forwarded-for") ?? undefined,
      userAgent: request.headers.get("user-agent") ?? undefined
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Unable to create intake case."
      },
      { status: 400 }
    );
  }
}
