import type { EntryParameters } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { attributeV1Field } from './attribution'
import { loadV1Project, selectContracts } from './loadProject'

/**
 * Reads the committed Scroll project through V1's own readers, no RPC, and
 * checks the facts the benchmark builds on: the block comes from
 * `usedBlockNumbers`, only verified Ethereum contracts are selected, and the
 * effective config is the template merged with the override exactly as
 * `AddressAnalyzer` would apply it, so ScrollChain's `sequencers` is a
 * handler, a timelock's `Proposer` a projection, and `ignoreMethods` come
 * from the template. `selectContracts` is also exercised on hand-built
 * entries for the filters a project on disk might not cover.
 */
describe(loadV1Project.name, () => {
  const SCROLL_CHAIN = ChainSpecificAddress(
    'eth:0xa13BAF47339d63B743e7Da8741db5456DAc1E556',
  )
  const TIMELOCK = ChainSpecificAddress(
    'eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44',
  )

  it('loads block, verified Ethereum contracts and effective configs for scroll', () => {
    const project = loadV1Project('scroll', 'ethereum')
    expect(project.blockNumber).toEqual(25_789_575)
    expect(project.entries.length).toBeGreaterThan(30)
    expect(
      project.entries.every(
        (entry) =>
          entry.type === 'Contract' &&
          entry.unverified !== true &&
          entry.address.startsWith('eth:'),
      ),
    ).toEqual(true)

    const scrollChain = project.entries.find((e) => e.address === SCROLL_CHAIN)
    if (scrollChain === undefined) throw new Error('ScrollChain missing')
    const config = project.effectiveConfig(scrollChain)
    expect(config.ignoreMethods).toInclude('committedBatches')
    expect(attributeV1Field('sequencers', config)).toEqual({
      kind: 'handler',
      handlerType: 'event',
    })
    expect(attributeV1Field('revertedBatches', config)).toEqual({
      kind: 'handler',
      handlerType: 'event',
    })
    expect(attributeV1Field('owner', config)).toEqual({ kind: 'getter' })

    const timelock = project.entries.find((e) => e.address === TIMELOCK)
    if (timelock === undefined) throw new Error('TimelockSCEmergency missing')
    const timelockConfig = project.effectiveConfig(timelock)
    expect(attributeV1Field('Proposer', timelockConfig)).toEqual({
      kind: 'template-projection',
      via: 'pickRoleMembers',
      handlerType: 'accessControl',
    })
    expect(attributeV1Field('getMinDelayFormatted', timelockConfig)).toEqual({
      kind: 'template-projection',
      via: 'edit',
      handlerType: 'call',
    })
    expect(attributeV1Field('accessControl', timelockConfig)).toEqual({
      kind: 'handler',
      handlerType: 'accessControl',
    })
  })

  it('honours --limit and --addresses, with or without the chain prefix', () => {
    const limited = loadV1Project('scroll', 'ethereum', { limit: 2 })
    expect(limited.entries.length).toEqual(2)
    const picked = loadV1Project('scroll', 'ethereum', {
      addresses: [SCROLL_CHAIN, TIMELOCK.slice(4).toLowerCase()],
    })
    expect(picked.entries.map((e) => e.address).sort()).toEqual([
      TIMELOCK,
      SCROLL_CHAIN,
    ])
  })

  it('refuses a chain the project was not discovered on', () => {
    expect(() => loadV1Project('scroll', 'base')).toThrow(
      /no usedBlockNumbers entry for base/,
    )
  })
})

describe(selectContracts.name, () => {
  const entry = (
    address: string,
    type: EntryParameters['type'],
    extra: Partial<EntryParameters> = {},
  ): EntryParameters => ({
    address: ChainSpecificAddress(address),
    type,
    ...extra,
  })
  const entries = [
    entry('eth:0x1111111111111111111111111111111111111111', 'Contract'),
    entry('eth:0x2222222222222222222222222222222222222222', 'EOA'),
    entry('eth:0x3333333333333333333333333333333333333333', 'Reference'),
    entry('eth:0x4444444444444444444444444444444444444444', 'Contract', {
      unverified: true,
    }),
    entry('scr:0x5555555555555555555555555555555555555555', 'Contract'),
    entry('eth:0x6666666666666666666666666666666666666666', 'Contract'),
  ]

  it('keeps verified contracts on the chain, in order, then applies the limit', () => {
    expect(
      selectContracts(entries, 'ethereum', {}).map((e) => e.address.toString()),
    ).toEqual([
      'eth:0x1111111111111111111111111111111111111111',
      'eth:0x6666666666666666666666666666666666666666',
    ])
    expect(
      selectContracts(entries, 'ethereum', { limit: 1 }).map((e) =>
        e.address.toString(),
      ),
    ).toEqual(['eth:0x1111111111111111111111111111111111111111'])
    expect(
      selectContracts(entries, 'scroll', {}).map((e) => e.address.toString()),
    ).toEqual(['scr:0x5555555555555555555555555555555555555555'])
  })
})
