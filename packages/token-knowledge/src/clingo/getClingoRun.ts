import type { ClingoError, ClingoResult } from 'clingo-wasm'

type ClingoRun = (
  program: string,
  models?: number,
) => Promise<ClingoResult | ClingoError>

interface ClingoModuleShape {
  default?: {
    run?: ClingoRun
  }
  run?: ClingoRun
}

export function getClingoRun(clingoModule: ClingoModuleShape): ClingoRun {
  const run = clingoModule.default?.run ?? clingoModule.run

  if (typeof run !== 'function') {
    throw new TypeError('Clingo run export is not a function')
  }

  return run
}
