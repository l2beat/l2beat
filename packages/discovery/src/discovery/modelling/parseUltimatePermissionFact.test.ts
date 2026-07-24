import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { parseClingoFact } from './clingoparser'
import { KnowledgeBase } from './KnowledgeBase'
import { ModelIdRegistry } from './ModelIdRegistry'
import {
  parsePermissionGroupFacts,
  parseUltimatePermissionVia,
} from './parseUltimatePermissionFact'

describe(parseUltimatePermissionVia.name, () => {
  it('preserves the local capability on a permission path edge', () => {
    const address = ChainSpecificAddress(
      'eth:0x1111111111111111111111111111111111111111',
    )
    const registry = new ModelIdRegistry(
      new KnowledgeBase([
        parseClingoFact(`address(proxy, "eth", "${address}")`),
      ]),
    )

    const result = parseUltimatePermissionVia(
      parseClingoFact(
        'tuple(proxy, "act", 0, "repoint the proxy.", ".owner", nil)',
      ),
      registry,
    )

    expect(result).toEqual({
      address,
      permission: 'act',
      delay: undefined,
      description: 'repoint the proxy.',
      role: '.owner',
      condition: undefined,
    })
  })
})

describe(parsePermissionGroupFacts.name, () => {
  it('combines members while preserving threshold, administrator, and capability', () => {
    const aggregator = ChainSpecificAddress(
      'eth:0x1111111111111111111111111111111111111111',
    )
    const memberA = ChainSpecificAddress(
      'eth:0x2222222222222222222222222222222222222222',
    )
    const memberB = ChainSpecificAddress(
      'eth:0x3333333333333333333333333333333333333333',
    )
    const admin = ChainSpecificAddress(
      'eth:0x4444444444444444444444444444444444444444',
    )
    const registry = new ModelIdRegistry(
      new KnowledgeBase([
        parseClingoFact(`address(aggregator, "eth", "${aggregator}")`),
        parseClingoFact(`address(memberA, "eth", "${memberA}")`),
        parseClingoFact(`address(memberB, "eth", "${memberB}")`),
        parseClingoFact(`address(admin, "eth", "${admin}")`),
      ]),
    )
    const facts = [
      parseClingoFact(
        'permissionGroup(aggregator, memberB, "signReports", "Signers", "Signer", 2, admin, "interact", "authorize price reports for this aggregator.", ".ocrConfig", true)',
      ),
      parseClingoFact(
        'permissionGroup(aggregator, memberA, "signReports", "Signers", "Signer", 2, admin, "interact", "authorize price reports for this aggregator.", ".ocrConfig", true)',
      ),
    ]

    expect(parsePermissionGroupFacts(facts, registry)).toEqual([
      {
        id: 'signReports',
        name: 'Signers',
        memberName: 'Signer',
        threshold: 2,
        members: [memberA, memberB],
        admin,
        permission: {
          from: aggregator,
          permission: 'interact',
          description: 'authorize price reports for this aggregator.',
          role: '.ocrConfig',
        },
        isProjectScoped: true,
      },
    ])
  })
})
