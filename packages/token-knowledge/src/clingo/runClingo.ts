export interface ClingoResult {
  Result: string
  Call: { Witnesses: { Value: string[] }[] }[]
}

export async function runClingo(program: string): Promise<ClingoResult> {
  const clingoModule = await import('clingo-wasm')
  // Handle both ESM and CommonJS module formats
  // @ts-ignore
  const run = clingoModule.default.run ?? clingoModule.run
  return run(program, 0)
}

export function extractFacts(result: ClingoResult): string[] {
  if (result.Result !== 'SATISFIABLE') {
    throw new Error(`Clingo result: ${result.Result}`)
  }
  const witness = result.Call[0]?.Witnesses[0]
  if (!witness) {
    throw new Error('No witness found in Clingo result')
  }
  return witness.Value
}
