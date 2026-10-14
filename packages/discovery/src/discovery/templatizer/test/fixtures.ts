/**
 * Real contracts from the benchmark suite, as the analyzer would hand them
 * to the templatizer: merged ABI, baseline, flattened implementation
 * sources. They were captured from the research branch's prepared files at
 * the blocks the benchmark ran; proxy sources are left out because nothing
 * in them bears on a draft. Tests use them so every rule is checked
 * against the shapes real contracts have, not only against toy ABIs.
 */
import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { readFileSync } from 'fs'
import path from 'path'
import type { ContractFacts } from '../facts'

export const FIXTURE_NAMES = [
  'ScrollChain',
  'DisputeGameFactory',
  'NitroEnclaveVerifier',
  'SequencerInbox',
] as const
export type FixtureName = (typeof FIXTURE_NAMES)[number]

interface FixtureFile
  extends Omit<ContractFacts, 'address' | 'shapeHash' | 'bundles' | 'sources'> {
  address: string
  shapeHash: string
  sources: { address: string; name: string; flattened: string }[]
}

export function loadFixture(name: FixtureName): ContractFacts {
  const file = path.join(__dirname, 'fixtures', `${name}.json`)
  const raw = JSON.parse(readFileSync(file, 'utf8')) as FixtureFile
  return {
    ...raw,
    address: ChainSpecificAddress(raw.address),
    shapeHash: Hash256(raw.shapeHash),
    bundles: [],
    sources: raw.sources.map((source) => ({
      ...source,
      address: ChainSpecificAddress(source.address),
    })),
  }
}
