import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { type AgentEntry, editDistance, resolveRef } from './resolveRef'
import { ToolError } from './toolError'

const BRIDGE = ChainSpecificAddress(
  'eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
)
const SIGNER_ETH = ChainSpecificAddress(
  'eth:0x875573B973F7E9Ca54eb34a59180C70eE1128208',
)
const SIGNER_ARB = ChainSpecificAddress(
  'arb1:0x875573B973F7E9Ca54eb34a59180C70eE1128208',
)
const UNNAMED = ChainSpecificAddress(
  'eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840',
)

const ENTRIES: AgentEntry[] = [
  { address: BRIDGE, name: 'Bridge' },
  { address: SIGNER_ETH, name: 'zachxbt' },
  { address: SIGNER_ARB, name: 'zachxbt' },
  { address: UNNAMED, name: undefined },
]

describe(resolveRef.name, () => {
  it('resolves an address in the project', () => {
    expect(resolveRef(ENTRIES, BRIDGE)).toEqual(BRIDGE)
  })

  it('resolves an address whatever its case', () => {
    expect(resolveRef(ENTRIES, BRIDGE.toLowerCase())).toEqual(BRIDGE)
  })

  it('rejects an address outside the project', () => {
    const outside = 'eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd'
    expect(() => resolveRef(ENTRIES, outside)).toThrow(
      'Address is not in the project',
    )
  })

  it('points an address on the wrong chain at the right one', () => {
    const wrongChain = `arb1:${ChainSpecificAddress.address(BRIDGE)}`
    const error = catchRefError(() => resolveRef(ENTRIES, wrongChain))
    expect(error.details['on other chains']).toEqual([`${BRIDGE} (Bridge)`])
  })

  it('lists the chains for an unknown chain prefix', () => {
    const error = catchRefError(() => resolveRef(ENTRIES, 'arb:zachxbt'))
    expect(error.message).toEqual('No contracts on this chain')
    expect(error.details.chains).toEqual(['eth', 'arb1'])
  })

  it('resolves a unique name, ignoring case when nothing matches exactly', () => {
    expect(resolveRef(ENTRIES, 'Bridge')).toEqual(BRIDGE)
    expect(resolveRef(ENTRIES, 'bridge')).toEqual(BRIDGE)
  })

  it('lists every candidate for a name on several chains', () => {
    const error = catchRefError(() => resolveRef(ENTRIES, 'zachxbt'))
    expect(error.message).toEqual('Name is ambiguous')
    expect(error.details.candidates).toEqual([
      `${SIGNER_ETH} (zachxbt)`,
      `${SIGNER_ARB} (zachxbt)`,
    ])
  })

  it('narrows a name to a chain with chain:Name', () => {
    expect(resolveRef(ENTRIES, 'arb1:zachxbt')).toEqual(SIGNER_ARB)
  })

  it('suggests names close to an unknown one', () => {
    const error = catchRefError(() => resolveRef(ENTRIES, 'Bridg'))
    expect(error.message).toEqual('No contract with this name')
    expect(error.details.candidates).toEqual([`${BRIDGE} (Bridge)`])
  })

  it('suggests a name for a misspelled one', () => {
    const error = catchRefError(() => resolveRef(ENTRIES, 'Brdige'))
    expect(error.details.candidates).toEqual([`${BRIDGE} (Bridge)`])
    const far = catchRefError(() => resolveRef(ENTRIES, 'Gateway'))
    expect(far.details.candidates).toEqual([])
  })
})

describe(editDistance.name, () => {
  it('counts the insertions, deletions and substitutions between two words', () => {
    expect(editDistance('bridge', 'bridge')).toEqual(0)
    expect(editDistance('bridge', 'brdige')).toEqual(2)
    expect(editDistance('bridge', 'bridges')).toEqual(1)
    expect(editDistance('', 'abc')).toEqual(3)
    expect(editDistance('kitten', 'sitting')).toEqual(3)
  })
})

function catchRefError(resolve: () => unknown): ToolError {
  try {
    resolve()
  } catch (error) {
    if (error instanceof ToolError) {
      return error
    }
    throw error
  }
  throw new Error('Expected a ref error')
}
