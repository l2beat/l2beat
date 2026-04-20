import type { ClingoError, ClingoResult } from 'clingo-wasm'
import { expect } from 'earl'
import { getClingoRun } from './getClingoRun'

describe(getClingoRun.name, () => {
  it('returns the ESM-style default.run export', async () => {
    const run = async (): Promise<ClingoResult | ClingoError> => ({
      Result: 'ERROR',
      Error: 'test',
    })

    expect(
      getClingoRun({
        default: { run },
      }),
    ).toEqual(run)
  })

  it('returns the CommonJS-style top-level run export', async () => {
    const run = async (): Promise<ClingoResult | ClingoError> => ({
      Result: 'ERROR',
      Error: 'test',
    })

    expect(
      getClingoRun({
        run,
      }),
    ).toEqual(run)
  })
})
