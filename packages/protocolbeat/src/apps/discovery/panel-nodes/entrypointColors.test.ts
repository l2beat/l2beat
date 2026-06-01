import { expect } from 'earl'
import type {
  ApiEntrypointGroup,
  ApiProjectChain,
  Field,
} from '../../../api/types'
import {
  buildEntrypointCollapseMembers,
  buildEntrypointColorAssignments,
  buildDisplayEntrypointColorMap,
} from './entrypointColors'

const gateway = 'eth:0x3B6041173B80E77f038f3F2C0f9744f04837185e'
const multisig = 'eth:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878'
const verifier = 'eth:0x00000000000000000000000000000000000000a1'
const memberEoa = 'eth:0x00000000000000000000000000000000000000b1'

function addressField(name: string, address: string): Field {
  return {
    name,
    value: { type: 'address', address },
  }
}

function contract(
  address: string,
  fields: Field[],
): ApiProjectChain['initialContracts'][number] {
  return {
    address,
    chain: 'eth',
    type: 'Contract',
    blockNumber: 1,
    fields,
    roles: [],
    description: undefined,
    referencedBy: [],
    isReachable: true,
  }
}

describe(buildEntrypointCollapseMembers.name, () => {
  it('keeps per-entrypoint seeds when a module-wide group shares the same addresses', () => {
    const groups: ApiEntrypointGroup[] = [
      {
        id: 'mode::' + gateway,
        label: 'mode: DeputyPauseModule',
        sourceProject: 'mode',
        memberAddresses: [gateway],
        bridgeAddresses: [],
        contractCount: 1,
        eoaCount: 0,
      },
      {
        id: 'optimism',
        label: 'optimism',
        sourceProject: 'optimism',
        memberAddresses: [gateway, multisig, verifier],
        bridgeAddresses: [],
        contractCount: 3,
        eoaCount: 0,
      },
    ]

    const entries: ApiProjectChain[] = [
      {
        project: 'mode',
        initialContracts: [],
        discoveredContracts: [contract(gateway, [])],
        eoas: [],
        blockNumbers: {},
      },
    ]

    const members = buildEntrypointCollapseMembers(groups, entries)
    const modeMembers = members.get('mode::' + gateway)

    expect(modeMembers).toEqual([gateway])
  })

  it('includes nested entrypoint subgraphs including EOAs when parent collapses', () => {
    const groups: ApiEntrypointGroup[] = [
      {
        id: 'shared-sp1::' + gateway,
        label: 'shared-sp1/entrypoints.json',
        sourceProject: 'shared-sp1',
        memberAddresses: [gateway],
        bridgeAddresses: [],
        contractCount: 1,
        eoaCount: 0,
        color: 1,
      },
      {
        id: 'taiko::' + multisig,
        label: 'taiko/entrypoints.json',
        sourceProject: 'taiko',
        memberAddresses: [multisig],
        bridgeAddresses: [],
        contractCount: 1,
        eoaCount: 0,
        color: 5,
      },
    ]

    const entries: ApiProjectChain[] = [
      {
        project: 'taiko',
        initialContracts: [],
        discoveredContracts: [
          contract(gateway, [addressField('owner', multisig)]),
          contract(multisig, [addressField('$members[0]', memberEoa)]),
        ],
        eoas: [
          {
            address: memberEoa,
            chain: 'eth',
            type: 'EOA',
            roles: [],
            description: undefined,
            referencedBy: [],
            isReachable: true,
            appearsInProjectsCount: 0,
            appearsInProjects: [],
            allAppearances: [],
          },
        ],
        blockNumbers: {},
      },
    ]

    const members = buildEntrypointCollapseMembers(groups, entries)
    const sp1Members = new Set(members.get('shared-sp1::' + gateway))

    expect(sp1Members.has(gateway)).toEqual(true)
    expect(sp1Members.has(multisig)).toEqual(true)
    expect(sp1Members.has(memberEoa)).toEqual(true)
  })

  it('collapses a legacy/global entrypoint whose seed lives in the consumer project graph', () => {
    // The declaring module (shared-sp1) has its own discovery chain present,
    // but it does NOT contain this (eth) gateway — that node lives in the
    // consumer project's graph (mantle). Keying adjacency purely on
    // sourceProject would yield an empty cluster; we must follow the graph that
    // actually contains the seed.
    const otherSp1Address = 'eth:0x00000000000000000000000000000000000000c1'
    const groups: ApiEntrypointGroup[] = [
      {
        id: 'shared-sp1::' + gateway,
        label: 'shared-sp1: SP1VerifierGateway',
        sourceProject: 'shared-sp1',
        memberAddresses: [gateway],
        bridgeAddresses: [],
        contractCount: 1,
        eoaCount: 0,
        color: 1,
      },
    ]

    const entries: ApiProjectChain[] = [
      {
        project: 'shared-sp1',
        initialContracts: [],
        // shared-sp1's own discovery: a different deployment, not the gateway.
        discoveredContracts: [contract(otherSp1Address, [])],
        eoas: [],
        blockNumbers: {},
      },
      {
        project: 'mantle',
        initialContracts: [],
        discoveredContracts: [
          contract(gateway, [addressField('activeVerifiers', verifier)]),
          contract(verifier, []),
        ],
        eoas: [],
        blockNumbers: {},
      },
    ]

    const members = new Set(
      buildEntrypointCollapseMembers(groups, entries).get(
        'shared-sp1::' + gateway,
      ),
    )

    expect(members.has(gateway)).toEqual(true)
    expect(members.has(verifier)).toEqual(true)
  })
})

describe(buildEntrypointColorAssignments.name, () => {
  it('propagates color from entrypoints and respects explicit entrypoint priority', () => {
    const groups: ApiEntrypointGroup[] = [
      {
        id: 'shared-sp1::' + gateway,
        label: 'shared-sp1/entrypoints.json',
        sourceProject: 'shared-sp1',
        memberAddresses: [gateway],
        bridgeAddresses: [],
        contractCount: 1,
        eoaCount: 0,
        color: 1,
      },
      {
        id: 'taiko::' + multisig,
        label: 'taiko/entrypoints.json',
        sourceProject: 'taiko',
        memberAddresses: [multisig],
        bridgeAddresses: [],
        contractCount: 1,
        eoaCount: 0,
        color: 5,
      },
    ]

    const entries: ApiProjectChain[] = [
      {
        project: 'shared-sp1',
        initialContracts: [],
        discoveredContracts: [
          contract(gateway, [addressField('activeVerifiers[0].verifier', verifier)]),
          contract(verifier, []),
        ],
        eoas: [],
        blockNumbers: {},
      },
      {
        project: 'taiko',
        initialContracts: [],
        discoveredContracts: [
          contract(gateway, [addressField('owner', multisig)]),
          contract(multisig, [
            addressField('$members[0]', memberEoa),
          ]),
        ],
        eoas: [{ address: memberEoa, chain: 'eth', type: 'EOA', roles: [], description: undefined, referencedBy: [], isReachable: true }],
        blockNumbers: {},
      },
    ]

    const assignments = buildEntrypointColorAssignments(groups, entries)
    const displayColors = buildDisplayEntrypointColorMap(
      assignments,
      groups,
      entries,
    )

    expect(assignments.get(gateway)).toEqual([
      { groupId: 'shared-sp1::' + gateway, color: 1 },
    ])
    expect(assignments.get(verifier)).toEqual([
      { groupId: 'shared-sp1::' + gateway, color: 1 },
    ])
    expect(assignments.get(multisig)).toEqual([
      { groupId: 'taiko::' + multisig, color: 5 },
    ])
    expect(displayColors.get(memberEoa)).toEqual([5])
    expect(
      displayColors.get(multisig),
    ).toEqual([5])
  })

  it('accumulates colors when referenced from multiple entrypoint groups', () => {
    const shared = 'eth:0x00000000000000000000000000000000000000c1'
    const groups: ApiEntrypointGroup[] = [
      {
        id: 'mode::' + gateway,
        label: 'mode: A',
        sourceProject: 'mode',
        memberAddresses: [gateway],
        bridgeAddresses: [],
        contractCount: 1,
        eoaCount: 0,
        color: 2,
      },
      {
        id: 'ink::' + multisig,
        label: 'ink: B',
        sourceProject: 'ink',
        memberAddresses: [multisig],
        bridgeAddresses: [],
        contractCount: 1,
        eoaCount: 0,
        color: 7,
      },
    ]

    const entries: ApiProjectChain[] = [
      {
        project: 'celo',
        initialContracts: [],
        discoveredContracts: [
          contract(gateway, [
            addressField('direct', shared),
            addressField('link', multisig),
          ]),
          contract(multisig, [addressField('direct', shared)]),
          contract(shared, []),
        ],
        eoas: [],
        blockNumbers: {},
      },
    ]

    const assignments = buildEntrypointColorAssignments(groups, entries)
    const displayColors = buildDisplayEntrypointColorMap(
      assignments,
      groups,
      entries,
    )
    expect(displayColors.get(shared)?.toSorted()).toEqual([2, 7])
  })

  it('ignores module-wide groups when assigning propagated colors', () => {
    const groups: ApiEntrypointGroup[] = [
      {
        id: 'taiko::' + multisig,
        label: 'taiko/entrypoints.json',
        sourceProject: 'taiko',
        memberAddresses: [multisig],
        bridgeAddresses: [],
        contractCount: 1,
        eoaCount: 0,
        color: 5,
      },
      {
        id: 'optimism',
        label: 'optimism',
        sourceProject: 'optimism',
        memberAddresses: [multisig, memberEoa],
        bridgeAddresses: [],
        contractCount: 2,
        eoaCount: 0,
        color: 1,
      },
    ]

    const entries: ApiProjectChain[] = [
      {
        project: 'taiko',
        initialContracts: [],
        discoveredContracts: [
          contract(multisig, [addressField('$members[0]', memberEoa)]),
        ],
        eoas: [
          {
            address: memberEoa,
            chain: 'eth',
            type: 'EOA',
            roles: [],
            description: undefined,
            referencedBy: [],
            isReachable: true,
          },
        ],
        blockNumbers: {},
      },
    ]

    const assignments = buildEntrypointColorAssignments(groups, entries)
    const displayColors = buildDisplayEntrypointColorMap(
      assignments,
      groups,
      entries,
    )

    expect(assignments.get(memberEoa)).toEqual([
      { groupId: 'taiko::' + multisig, color: 5 },
    ])
    expect(displayColors.get(memberEoa)).toEqual([5])
    expect(displayColors.get(multisig)).toEqual([5])
  })

  it('always colors declared entrypoints from their group even without propagation', () => {
    const modeEntry = gateway
    const groups: ApiEntrypointGroup[] = [
      {
        id: 'mode::' + modeEntry,
        label: 'mode: DeputyPauseModule',
        sourceProject: 'mode',
        memberAddresses: [modeEntry],
        bridgeAddresses: [],
        contractCount: 1,
        eoaCount: 0,
        color: 9,
      },
      {
        id: 'optimism',
        label: 'optimism',
        sourceProject: 'optimism',
        memberAddresses: [modeEntry],
        bridgeAddresses: [],
        contractCount: 1,
        eoaCount: 0,
        color: 1,
      },
    ]

    const entries: ApiProjectChain[] = [
      {
        project: 'celo',
        initialContracts: [],
        discoveredContracts: [contract(modeEntry, [])],
        eoas: [],
        blockNumbers: {},
      },
    ]

    const assignments = buildEntrypointColorAssignments(groups, entries)
    const displayColors = buildDisplayEntrypointColorMap(
      assignments,
      groups,
      entries,
    )

    expect(displayColors.get(modeEntry)).toEqual([9])
  })

  it('propagates per-entrypoint colors from the chain that contains the seed', () => {
    const modeEntry = gateway
    const downstream = verifier
    const groups: ApiEntrypointGroup[] = [
      {
        id: 'mode::' + modeEntry,
        label: 'mode: DeputyPauseModule',
        sourceProject: 'mode',
        memberAddresses: [modeEntry],
        bridgeAddresses: [],
        contractCount: 1,
        eoaCount: 0,
        color: 9,
      },
    ]

    const entries: ApiProjectChain[] = [
      {
        project: 'celo',
        initialContracts: [],
        discoveredContracts: [
          contract(modeEntry, [addressField('child', downstream)]),
          contract(downstream, []),
        ],
        eoas: [],
        blockNumbers: {},
      },
    ]

    const assignments = buildEntrypointColorAssignments(groups, entries)
    const displayColors = buildDisplayEntrypointColorMap(
      assignments,
      groups,
      entries,
    )

    expect(displayColors.get(modeEntry)).toEqual([9])
    expect(displayColors.get(downstream)).toEqual([9])
  })

  it('keeps nested declared entrypoint on its own group after collapse enrichment', () => {
    const groups: ApiEntrypointGroup[] = [
      {
        id: 'shared-sp1::' + gateway,
        label: 'shared-sp1/entrypoints.json',
        sourceProject: 'shared-sp1',
        declaredMemberAddresses: [gateway],
        memberAddresses: [gateway, multisig],
        bridgeAddresses: [],
        contractCount: 1,
        eoaCount: 0,
        color: 1,
      },
      {
        id: 'taiko::' + multisig,
        label: 'taiko/entrypoints.json',
        sourceProject: 'taiko',
        declaredMemberAddresses: [multisig],
        memberAddresses: [multisig],
        bridgeAddresses: [],
        contractCount: 1,
        eoaCount: 0,
        color: 5,
      },
    ]

    const entries: ApiProjectChain[] = [
      {
        project: 'taiko',
        initialContracts: [],
        discoveredContracts: [
          contract(gateway, [addressField('owner', multisig)]),
          contract(multisig, []),
        ],
        eoas: [],
        blockNumbers: {},
      },
    ]

    const assignments = buildEntrypointColorAssignments(groups, entries)
    const displayColors = buildDisplayEntrypointColorMap(
      assignments,
      groups,
      entries,
    )

    expect(displayColors.get(multisig)).toEqual([5])
  })
})
