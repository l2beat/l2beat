import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { CodeSource } from './codeAnchor'
import type { AgentEntry } from './resolveRef'
import { StepResolver } from './steps'

// Resolves steps against two contracts, one of them a proxy whose
// implementation source sits second, like the code panel lists them.
const PROXY = ChainSpecificAddress(
  'eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
)
const ADMIN = ChainSpecificAddress(
  'eth:0x875573B973F7E9Ca54eb34a59180C70eE1128208',
)
const ENTRIES: AgentEntry[] = [
  { address: PROXY, name: 'Bridge' },
  { address: ADMIN, name: 'ProxyAdmin' },
]

const PROXY_SOURCES: CodeSource[] = [
  { name: 'Proxy.sol', code: 'contract Proxy {\n  function pause() {}\n}' },
  {
    name: 'Bridge.sol',
    code: [
      'contract Bridge {',
      '  function deposit() external {',
      '    pause();',
      '  }',
      '  function pause() external {}',
      '}',
    ].join('\n'),
  },
]

describe(StepResolver.name, () => {
  it('selects the code contract first, then the rest once each', () => {
    const resolver = new StepResolver(ENTRIES, () => PROXY_SOURCES)
    const step = resolver.resolve({
      note: 'n',
      contracts: ['ProxyAdmin', 'Bridge', 'ProxyAdmin'],
      code: { contract: 'Bridge', find: 'function deposit(' },
    })
    expect(step.contracts.map((e) => e.address)).toEqual([PROXY, ADMIN])
    expect(step.code?.sourceIndex).toEqual(1)
    expect(step.code?.sourceName).toEqual('Bridge.sol')
    expect(step.code?.line).toEqual(2)
    expect(step.code?.length).toEqual('function deposit('.length)
  })

  it('lists the other places with the snippet', () => {
    const resolver = new StepResolver(ENTRIES, () => PROXY_SOURCES)
    const step = resolver.resolve({
      note: 'n',
      code: { contract: 'Bridge', find: 'pause()' },
    })
    expect(step.code?.sourceName).toEqual('Proxy.sol')
    expect(step.code?.others).toEqual([
      { sourceName: 'Bridge.sol', line: 3 },
      { sourceName: 'Bridge.sol', line: 5 },
    ])
  })

  it('reads the code of a contract once per call', () => {
    let reads = 0
    const resolver = new StepResolver(ENTRIES, () => {
      reads++
      return PROXY_SOURCES
    })
    const code = { contract: 'Bridge', find: 'function deposit(' }
    resolver.resolve({ note: 'one', code })
    resolver.resolve({ note: 'two', code })
    expect(reads).toEqual(1)
  })

  it('tells the agent when the code cannot be read', () => {
    const resolver = new StepResolver(ENTRIES, () => {
      throw new Error('No .flat files')
    })
    expect(() =>
      resolver.resolve({
        note: 'n',
        code: { contract: 'Bridge', find: 'pause' },
      }),
    ).toThrow('Cannot read the contract source')
  })

  it('tells the agent when the snippet is not in the code', () => {
    const resolver = new StepResolver(ENTRIES, () => PROXY_SOURCES)
    expect(() =>
      resolver.resolve({
        note: 'n',
        code: { contract: 'Bridge', find: 'function withdraw(' },
      }),
    ).toThrow('Snippet not found in the contract source')
  })
})
