import { expect } from 'earl'
import type { ApiEntrypointGroup } from '../../../../../api/types'
import type { Node } from '../State'
import { enrichEntrypointGroupsForCollapse } from '../../entrypointColors'
import { applyEntrypointCollapse } from './entrypointGroups'

const deputyPause = 'eth:0x76fC2F971FB355D0453cF9F64d3F9E4f640E1754'
const external = 'eth:0x00000000000000000000000000000000000000ee'

function node(id: string, targets: string[] = []): Node {
  return {
    id,
    address: id.split(':')[1] ?? id,
    isInitial: false,
    hasTemplate: false,
    addressType: 'Contract',
    name: id,
    fields: targets.map((target, i) => ({
      name: `field${i}`,
      target,
      box: { x: 0, y: 0, width: 0, height: 0 },
      connection: {
        from: { direction: 'right', x: 0, y: 0 },
        to: { direction: 'left', x: 0, y: 0 },
      },
    })),
    hiddenFields: [],
    box: { x: 0, y: 0, width: 400, height: 200 },
    color: 0,
    hueShift: 0,
    data: null,
    isReachable: true,
  }
}

describe(applyEntrypointCollapse.name, () => {
  it('collapses per-entrypoint groups that share addresses with a module-wide optimism group', () => {
    const groups: ApiEntrypointGroup[] = [
      {
        id: `mode::${deputyPause}`,
        label: 'mode: DeputyPauseModule',
        sourceProject: 'mode',
        memberAddresses: [deputyPause],
        bridgeAddresses: [],
        contractCount: 1,
        eoaCount: 0,
      },
      {
        id: 'optimism',
        label: 'optimism',
        sourceProject: 'optimism',
        memberAddresses: [deputyPause, external],
        bridgeAddresses: [],
        contractCount: 2,
        eoaCount: 0,
      },
    ]

    const entries = [
      {
        project: 'mode',
        initialContracts: [],
        discoveredContracts: [
          {
            address: deputyPause,
            chain: 'eth',
            type: 'Contract' as const,
            blockNumber: 1,
            fields: [{ name: 'out', value: { type: 'address' as const, address: external } }],
            roles: [],
            referencedBy: [],
            isReachable: true,
          },
        ],
        eoas: [],
        blockNumbers: {},
      },
    ]

    const enriched = enrichEntrypointGroupsForCollapse(groups, entries)
    const nodes = [node(deputyPause, [external]), node(external)]
    const groupId = `mode::${deputyPause}`
    const result = applyEntrypointCollapse(nodes, [], {
      groups: enriched,
      collapsedGroupIds: [groupId],
    })

    expect(result.hidden.includes(deputyPause)).toEqual(true)
    expect(
      result.nodes.some((entry) => entry.id === `entrypoint:${groupId}`),
    ).toEqual(true)
  })
})
