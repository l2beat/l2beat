import type { ClingoError, ClingoResult } from 'clingo-wasm'

export type { ClingoError, ClingoResult }

export async function runClingo(
  program: string,
): Promise<ClingoResult | ClingoError> {
  const clingoModule = await import('clingo-wasm')
  // Handle both ESM and CommonJS module formats
  // @ts-ignore
  const run = clingoModule.default.run ?? clingoModule.run
  return run(program, 0)
}

export function extractFacts(result: ClingoResult | ClingoError): string[] {
  if (result.Result === 'ERROR') {
    throw new Error(`Clingo error: ${result.Error}`)
  }
  if (result.Result !== 'SATISFIABLE') {
    throw new Error(`Clingo result: ${result.Result}`)
  }
  const witness = result.Call[0]?.Witnesses[0]
  if (!witness) {
    throw new Error('No witness found in Clingo result')
  }
  return witness.Value
}
