import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { type AgentEntry, AgentRefError, resolveRef } from './resolveRef'

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

  it('resolves a unique name, ignoring case when nothing matches exactly', () => {
    expect(resolveRef(ENTRIES, 'Bridge')).toEqual(BRIDGE)
    expect(resolveRef(ENTRIES, 'bridge')).toEqual(BRIDGE)
  })

  it('lists every candidate for a name on several chains', () => {
    const error = catchRefError(() => resolveRef(ENTRIES, 'zachxbt'))
    expect(error.message).toEqual('Name is ambiguous')
    expect(error.candidates).toEqual([
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
    expect(error.candidates).toEqual([`${BRIDGE} (Bridge)`])
  })
})

function catchRefError(resolve: () => unknown): AgentRefError {
  try {
    resolve()
  } catch (error) {
    if (error instanceof AgentRefError) {
      return error
    }
    throw error
  }
  throw new Error('Expected a ref error')
}
