import { expect } from 'earl'
import type { ApiProjectChain, ApiProjectContract } from '../../../api/types'
import {
  buildCodeGroups,
  buildSearchGroups,
  GROUP_LIMIT_MIXED,
  GROUP_LIMIT_SCOPED,
  type SearchSources,
  toSearchRows,
} from './groups'
import {
  buildCommandSearchables,
  buildContractSearchables,
  buildFieldSearchables,
  buildProjectSearchables,
} from './items'
import { cycleScope, getSearchScopes, scopeForPrefix } from './scopes'

const BRIDGE = '0x1111111111111111111111111111111111111111'
const OWNER = '0x2222222222222222222222222222222222222222'

describe(buildSearchGroups.name, () => {
  it('groups contracts, fields, projects and commands for one query', () => {
    const groups = search('all', 'bridge')

    expect(groups.map((g) => g.label)).toEqual([
      'Contracts',
      'Fields',
      'Projects',
    ])
    expect(groups[0]?.items.map((i) => i.title)).toEqual(['L1Bridge'])
    expect(groups[1]?.items.map((i) => i.title)).toEqual(['bridgeOwner'])
    expect(groups[2]?.items.map((i) => i.title)).toEqual(['bridgeland'])
  })

  it('finds a contract by its bare address and by its template', () => {
    expect(titles(search('contracts', BRIDGE.slice(0, 10)))).toEqual([
      'L1Bridge',
    ])
    expect(titles(search('contracts', 'opstack/l1bridge'))).toEqual([
      'L1Bridge',
    ])
  })

  it('names an unnamed EOA by its address and roles', () => {
    const [eoa] = search('contracts', 'challenger')[0]?.items ?? []
    expect(eoa?.title).toEqual('eth:0x2222…2222')
    expect(eoa?.detail).toEqual('EOA · Challenger')
  })

  it('caps mixed groups and offers the scoped view for the rest', () => {
    const manyFields = Array.from(
      { length: GROUP_LIMIT_MIXED + 3 },
      (_, i) => ({
        name: `owner${i}`,
        value: { type: 'number' as const, value: '1' },
      }),
    )
    const groups = buildSearchGroups({
      scope: 'all',
      text: 'owner',
      sources: sourcesFor([contract('Many', BRIDGE, manyFields)]),
      recentAddresses: [],
    })
    const fields = groups.find((g) => g.label === 'Fields')

    expect(fields?.total).toEqual(GROUP_LIMIT_MIXED + 3)
    expect(fields?.items.at(-1)).toEqual(
      expect.subset({ kind: 'scope', scope: 'fields' }),
    )
    const rows = toSearchRows(groups).rows
    expect(
      rows.find((r) => r.kind === 'label' && r.label === 'Fields'),
    ).toEqual(
      expect.subset({
        count: `${GROUP_LIMIT_MIXED} of ${GROUP_LIMIT_MIXED + 3}`,
      }),
    )
  })

  it('shows recent contracts and commands for an empty query', () => {
    const groups = search('all', '', [`eth:${OWNER}`, 'eth:0xgone'])

    expect(groups.map((g) => g.label)).toEqual(['Recent', 'Commands'])
    expect(groups[0]?.items.map((i) => i.key)).toEqual([
      `contract:eth:${OWNER}`,
    ])
  })
})

describe(buildCodeGroups.name, () => {
  it('summarizes contracts dropped by the row cap', () => {
    const match = (address: string, hits: number) => ({
      name: 'C',
      address,
      codeLocation: Array.from({ length: hits }, (_, i) => ({
        line: 'owner',
        fileName: 'C.sol',
        index: 0,
        offset: i,
      })),
    })
    const groups = buildCodeGroups(
      {
        matches: [
          match(`eth:${BRIDGE}`, GROUP_LIMIT_SCOPED),
          match(`eth:${OWNER}`, 3),
          match('eth:0x3333333333333333333333333333333333333333', 2),
        ],
      },
      5,
    )

    expect(groups.map((g) => g.items.length)).toEqual([GROUP_LIMIT_SCOPED, 0])
    expect(toSearchRows(groups).rows.at(-1)).toEqual(
      expect.subset({
        label: '2 more contracts, narrow the query',
        count: '5 matches',
      }),
    )
  })
})

describe('search scopes', () => {
  it('maps prefixes to scopes and drops code in read-only builds', () => {
    expect(scopeForPrefix(getSearchScopes(false), '%')).toEqual('code')
    expect(scopeForPrefix(getSearchScopes(true), '%')).toEqual(undefined)
    expect(scopeForPrefix(getSearchScopes(false), '#')).toEqual('fields')
  })

  it('cycles in both directions with wraparound', () => {
    const scopes = getSearchScopes(false)
    expect(cycleScope(scopes, 'all', -1)).toEqual('commands')
    expect(cycleScope(scopes, 'commands', 1)).toEqual('all')
    expect(cycleScope(scopes, 'all', 1)).toEqual('contracts')
  })
})

function search(
  scope: Parameters<typeof buildSearchGroups>[0]['scope'],
  text: string,
  recentAddresses: string[] = [],
) {
  return buildSearchGroups({
    scope,
    text,
    sources: sourcesFor([
      contract('L1Bridge', BRIDGE, [
        {
          name: 'bridgeOwner',
          value: { type: 'address', addressType: 'EOA', address: OWNER },
        },
      ]),
    ]),
    recentAddresses,
  })
}

function titles(groups: ReturnType<typeof buildSearchGroups>) {
  return groups.flatMap((g) => g.items.map((i) => i.title))
}

function sourcesFor(contracts: ApiProjectContract[]): SearchSources {
  const chains: ApiProjectChain[] = [
    {
      project: 'test',
      initialContracts: contracts,
      discoveredContracts: [],
      eoas: [
        {
          type: 'EOA',
          address: `eth:${OWNER}`,
          roles: ['Challenger'],
          referencedBy: [],
          isReachable: true,
          chain: 'ethereum',
        },
      ],
      blockNumbers: {},
    },
  ]
  return {
    contracts: buildContractSearchables(chains),
    fields: buildFieldSearchables(chains),
    projects: buildProjectSearchables(
      [
        {
          name: 'bridgeland',
          category: 'interop',
          addresses: [],
          contractNames: [],
        },
      ],
      { matchContractNames: false },
    ),
    commands: buildCommandSearchables([
      { command: { type: 'addPanel' }, title: 'Add panel', shortcut: '' },
    ]),
  }
}

function contract(
  name: string,
  address: string,
  fields: ApiProjectContract['fields'],
): ApiProjectContract {
  return {
    name,
    type: 'Contract',
    address: `eth:${address}`,
    chain: 'ethereum',
    roles: [],
    referencedBy: [],
    isReachable: true,
    template: { id: 'opstack/L1Bridge' },
    fields,
    abis: [],
  }
}
