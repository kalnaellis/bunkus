import { z } from "zod";

export const caseSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  consent: z.literal(true),
  consentTextVersion: z.string().trim().min(1).max(32)
});

export const uploadMetaSchema = z.object({
  caseId: z.string().trim().min(1),
  rowIndex: z.coerce.number().int().positive(),
  folderId: z.string().trim().min(1)
});

export type CaseInput = z.infer<typeof caseSchema>;
export type UploadMetaInput = z.infer<typeof uploadMetaSchema>;
