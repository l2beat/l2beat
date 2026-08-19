import { expect } from 'earl'
import { readFileSync } from 'fs'
import path from 'path'
import { pruneScarbWorkspace, referencedCrates } from './pruneScarbWorkspace'
import { parseSierraAbi } from './sierraAbi'

describe('pruneScarbWorkspace', () => {
  const abi = parseSierraAbi(
    readFileSync(
      path.join(__dirname, 'fixtures', 'strk20PoolAbi.json'),
      'utf8',
    ),
  )

  const files = {
    LICENSE: 'MIT',
    'Scarb.toml': '[workspace]\nmembers = ["packages/*"]',
    'Scarb.lock': 'version = 1',
    'packages/privacy/Scarb.toml': '[package]\nname = "privacy"',
    'packages/privacy/src/lib.cairo': 'mod privacy;',
    'packages/ekubo_swap_anonymizer/Scarb.toml':
      '[package]\nname = "ekubo_swap_anonymizer"\n[dependencies]\nprivacy = { path = "../privacy" }',
    'packages/ekubo_swap_anonymizer/src/lib.cairo': 'mod anonymizer;',
  }

  it('extracts crates referenced by the strk20 ABI', () => {
    const crates = referencedCrates(abi)
    expect(crates.has('privacy')).toEqual(true)
    expect(crates.has('starkware_utils')).toEqual(true)
    expect(crates.has('core')).toEqual(false)
    expect(crates.has('ekubo_swap_anonymizer')).toEqual(false)
  })

  it('keeps only referenced packages and root files', () => {
    const pruned = pruneScarbWorkspace(files, abi)
    expect(Object.keys(pruned).sort()).toEqual([
      'LICENSE',
      'Scarb.lock',
      'Scarb.toml',
      'packages/privacy/Scarb.toml',
      'packages/privacy/src/lib.cairo',
    ])
  })

  it('follows path dependencies transitively', () => {
    // If the ABI referenced the anonymizer, privacy comes along as its dep
    const anonymizerAbi = parseSierraAbi(
      JSON.stringify([
        {
          type: 'interface',
          name: 'ekubo_swap_anonymizer::IAnonymizer',
          items: [
            {
              type: 'function',
              name: 'swap',
              inputs: [],
              outputs: [],
              state_mutability: 'external',
            },
          ],
        },
      ]),
    )
    const pruned = pruneScarbWorkspace(files, anonymizerAbi)
    expect(
      Object.keys(pruned).includes('packages/privacy/src/lib.cairo'),
    ).toEqual(true)
    expect(
      Object.keys(pruned).includes(
        'packages/ekubo_swap_anonymizer/src/lib.cairo',
      ),
    ).toEqual(true)
  })

  it('keeps everything for single-package repos', () => {
    const single = { 'Scarb.toml': 'x', 'src/lib.cairo': 'y' }
    expect(pruneScarbWorkspace(single, abi)).toEqual(single)
  })
})
