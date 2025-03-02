import { KnowledgeBase, groupFacts } from '@l2beat/discovery'
import { ClingoFactFile } from '@l2beat/discovery/dist/discovery/modelling/factTypes'
import { expect } from 'earl'
import {
  type GroupedTransitivePermissionFact,
  renderGroupedTransitivePermissionFact,
} from './factRendering'

const permissionFacts = {
  facts: [
    {
      atom: 'transitivePermission',
      params: [
        'outbox_ethereum_0x0b9857ae2d4a3dbe74ffe1d7df045bb7f96e4840',
        'upgrade',
        'l1CustomGateway_ethereum_0xcee284f754e854890e311e3280b767f80797180d',
        3600,
        'update the implementation',
        [
          {
            atom: 'tuple',
            params: [
              'bridge_ethereum_0x8315177ab297ba92a06054ce80a67ed4dbd7ed3a',
              'act',
              0,
            ],
          },
          {
            atom: 'tuple',
            params: [
              'l1Timelock_ethereum_0xe6841d92b0c345144506576ec13ecf5103ac7f49',
              'act',
              259200,
            ],
          },
          {
            atom: 'tuple',
            params: [
              'upgradeExecutor_ethereum_0x3fffbadaf827559da092217e474760e2b2c3cedd',
              'act',
              0,
            ],
          },
          {
            atom: 'tuple',
            params: [
              'gatewaysAdmin_ethereum_0x9ad46fac0cf7f790e5be05a0f15223935a0c0ada',
              'act',
              0,
            ],
          },
          {
            atom: 'tuple',
            params: [
              'l1CustomGateway_ethereum_0xcee284f754e854890e311e3280b767f80797180d',
              'upgrade',
              0,
            ],
          },
        ],
        'isFinal',
      ],
    },
  ],
}

describe(renderGroupedTransitivePermissionFact.name, () => {
  it('should render transitivePermission fact', () => {
    const knowledgeBase = new KnowledgeBase(
      ClingoFactFile.parse(permissionFacts).facts,
    )
    const facts = knowledgeBase.getFacts('transitivePermission', [
      'outbox_ethereum_0x0b9857ae2d4a3dbe74ffe1d7df045bb7f96e4840',
      'upgrade',
      'l1CustomGateway_ethereum_0xcee284f754e854890e311e3280b767f80797180d',
    ])
    const grouped = groupFacts(facts, 2)
    const result = renderGroupedTransitivePermissionFact(
      grouped[0] as GroupedTransitivePermissionFact,
    )
    expect(result).toEqual(
      'Can upgrade the implementation of @@l1CustomGateway_ethereum_0xcee284f754e854890e311e3280b767f80797180d with 1h delay - update the implementation - acting via @@l1CustomGateway_ethereum_0xcee284f754e854890e311e3280b767f80797180d, @@gatewaysAdmin_ethereum_0x9ad46fac0cf7f790e5be05a0f15223935a0c0ada, @@upgradeExecutor_ethereum_0x3fffbadaf827559da092217e474760e2b2c3cedd, @@l1Timelock_ethereum_0xe6841d92b0c345144506576ec13ecf5103ac7f49 with 3d delay, @@bridge_ethereum_0x8315177ab297ba92a06054ce80a67ed4dbd7ed3a.',
    )
  })
})
