import * as z from 'zod'

export type ClingoValue = string | number | null | ClingoFact | ClingoValue[]
export const ClingoValue: z.ZodType<ClingoValue> = z.lazy(() =>
  z.union([z.string(), z.number(), z.null(), ClingoFact, z.array(ClingoValue)]),
)

export type ClingoFact = {
  atom: string
  params: ClingoValue[]
}

export const ClingoFact: z.ZodType<ClingoFact> = z.object({
  atom: z.string(),
  params: z.array(ClingoValue),
})

export type ClingoFactFile = z.infer<typeof ClingoFactFile>
export const ClingoFactFile = z.object({
  facts: z.array(ClingoFact),
})

export function parseExportedFacts(fileContents: string): ClingoFactFile {
  return ClingoFactFile.parse(JSON.parse(fileContents))
}
