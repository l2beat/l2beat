import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { TemplateService } from '../analysis/TemplateService'
import type { PermissionsConfig } from '../config/PermissionConfig'
import type { DiscoveryOutput, PermissionsOutput } from '../output/types'
import { resolveImpactScenarios } from './resolveImpactScenarios'

describe(resolveImpactScenarios.name, () => {
  const actor = ChainSpecificAddress(
    'eth:0x1111111111111111111111111111111111111111',
  )
  const dependency = ChainSpecificAddress(
    'eth:0x2222222222222222222222222222222222222222',
  )
  const consumer = ChainSpecificAddress(
    'eth:0x3333333333333333333333333333333333333333',
  )

  it('uses a modeled dependency instead of its black-box boundary', () => {
    const projects = [
      project(
        [
          {
            type: 'Contract',
            address: dependency,
            name: 'Dependency',
            values: { owner: actor },
          },
          {
            type: 'Contract',
            address: consumer,
            name: 'Consumer',
            template: 'ConsumerTemplate',
            values: { dependency },
          },
          { type: 'EOA', address: actor, name: 'Actor' },
        ],
        {
          overrides: {
            [dependency]: {
              fields: {
                owner: {
                  permissions: [
                    {
                      id: 'controlValue',
                      type: 'interact',
                      delay: 0,
                      description: 'control the dependency value.',
                      effects: [
                        {
                          id: 'value.overstated',
                          description: 'The dependency value is overstated.',
                        },
                      ],
                    },
                  ],
                },
              },
            },
            [consumer]: consumerPermission(),
          },
        },
      ),
    ]
    const output = permissionsOutput([
      {
        receiver: actor,
        permission: 'interact',
        from: dependency,
        description: 'control the dependency value.',
        role: '.owner',
        isFinal: true,
      },
    ])

    const result = resolveImpactScenarios(
      projects,
      output,
      mockObject<TemplateService>({
        loadContractPermissionTemplate: () => ({ fields: {} }),
      }),
    )

    expect(result?.length).toEqual(1)
    expect(result?.[0]?.principals).toEqual([
      { type: 'address', address: actor },
    ])
    expect(result?.[0]?.sources.length).toEqual(1)
    expect(result?.[0]?.sources[0]?.principal).toEqual(
      `address:${actor.toLowerCase()}`,
    )
    expect(result?.[0]?.sources[0]?.description).toEqual(
      'The dependency value is overstated.',
    )
    expect(result?.[0]?.sources[0]?.dependencyName).toEqual(undefined)
    expect(result?.[0]?.steps.map((step) => step.output)).toEqual([
      'impact.consumer.changed',
    ])
    expect(result?.[0]?.steps[0]?.ruleDefinition).toEqual({
      template: 'ConsumerTemplate',
      id: 'consumeOverstatedValue',
    })
    expect(result?.[0]?.steps[0]?.categories).toEqual(['funds-can-lose-value'])
    expect(result?.[0]?.paths).toEqual([
      {
        terminal: {
          address: consumer,
          effect: 'impact.consumer.changed',
        },
        trace: {
          type: 'rule',
          ruleId: JSON.stringify([
            'effect-rule',
            consumer,
            'consumeOverstatedValue',
            0,
          ]),
          inputs: [
            {
              type: 'source',
              sourceId: JSON.stringify([
                JSON.stringify([
                  'permission-effect',
                  dependency,
                  'controlValue',
                  `address:${actor.toLowerCase()}`,
                  '',
                ]),
                'value.overstated',
              ]),
            },
          ],
        },
      },
    ])
  })

  it('creates a black-box principal when the dependency has no model', () => {
    const projects = [
      project(
        [
          {
            type: 'Contract',
            address: consumer,
            name: 'Consumer',
            values: { dependency },
          },
        ],
        {
          overrides: { [consumer]: consumerPermission() },
        },
      ),
    ]

    const result = resolveImpactScenarios(
      projects,
      permissionsOutput([]),
      {} as TemplateService,
    )

    expect(result?.length).toEqual(1)
    expect(result?.[0]?.principals).toEqual([
      { type: 'address', address: dependency },
    ])
    expect(result?.[0]?.sources[0]?.dependencyName).toEqual(
      'External value provider',
    )
    expect(result?.[0]?.sources[0]?.description).toEqual(
      'The black box can overstate its value.',
    )
  })

  it('does not silently substitute a black box for an incomplete model', () => {
    const projects = [
      project(
        [
          {
            type: 'Contract',
            address: dependency,
            name: 'Dependency',
            values: {},
          },
          {
            type: 'Contract',
            address: consumer,
            name: 'Consumer',
            values: { dependency },
          },
        ],
        {
          overrides: {
            [dependency]: {
              fields: {},
              effectRules: [
                {
                  id: 'differentEffect',
                  inputs: [{ effect: 'unreachable.input' }],
                  output: 'different.output',
                  description: 'Produce a different local effect.',
                  terminal: false,
                },
              ],
            },
            [consumer]: consumerPermission(),
          },
        },
      ),
    ]

    expect(() =>
      resolveImpactScenarios(
        projects,
        permissionsOutput([]),
        {} as TemplateService,
      ),
    ).toThrow(
      'Modeled dependency Dependency does not produce required effect "value.overstated"',
    )
  })

  it('rejects an impact on a nonterminal rule', () => {
    const projects = [
      project([{ type: 'Contract', address: consumer, name: 'Consumer' }], {
        overrides: {
          [consumer]: {
            fields: {},
            effectRules: [
              {
                id: 'hiddenImpact',
                inputs: [{ effect: 'input' }],
                output: 'output',
                description: 'Transform the input locally.',
                impact: 'Users are affected.',
                terminal: false,
              },
            ],
          },
        },
      }),
    ]

    expect(() =>
      resolveImpactScenarios(
        projects,
        permissionsOutput([]),
        {} as TemplateService,
      ),
    ).toThrow(
      'Effect rule "hiddenImpact" on Consumer defines an impact but is not terminal',
    )
  })

  it('requires every terminal rule to expose an impact or protection', () => {
    const projects = [
      project([{ type: 'Contract', address: consumer, name: 'Consumer' }], {
        overrides: {
          [consumer]: {
            fields: {},
            effectRules: [
              {
                id: 'unexplainedTerminal',
                inputs: [{ effect: 'input' }],
                output: 'output',
                description: 'Transform the input locally.',
                terminal: true,
              },
            ],
          },
        },
      }),
    ]

    expect(() =>
      resolveImpactScenarios(
        projects,
        permissionsOutput([]),
        {} as TemplateService,
      ),
    ).toThrow(
      'Terminal effect rule "unexplainedTerminal" on Consumer must define an impact or protection',
    )
  })

  it('rejects a protection on a nonterminal rule', () => {
    const projects = [
      project([{ type: 'Contract', address: consumer, name: 'Consumer' }], {
        overrides: {
          [consumer]: {
            fields: {},
            effectRules: [
              {
                id: 'hiddenProtection',
                inputs: [{ effect: 'input' }],
                output: 'output',
                description: 'Transform the input locally.',
                protection: 'Users retain an exit.',
                terminal: false,
              },
            ],
          },
        },
      }),
    ]

    expect(() =>
      resolveImpactScenarios(
        projects,
        permissionsOutput([]),
        {} as TemplateService,
      ),
    ).toThrow(
      'Effect rule "hiddenProtection" on Consumer defines a protection but is not terminal',
    )
  })

  it('keeps impact and protection terminals separate', () => {
    const projects = [
      project([{ type: 'Contract', address: consumer, name: 'Consumer' }], {
        overrides: {
          [consumer]: {
            fields: {},
            effectRules: [
              {
                id: 'ambiguousTerminal',
                inputs: [{ effect: 'input' }],
                output: 'output',
                description: 'Transform the input locally.',
                impact: 'Users are harmed.',
                protection: 'Users retain an exit.',
                terminal: true,
              },
            ],
          },
        },
      }),
    ]

    expect(() =>
      resolveImpactScenarios(
        projects,
        permissionsOutput([]),
        {} as TemplateService,
      ),
    ).toThrow(
      'Terminal effect rule "ambiguousTerminal" on Consumer cannot define both an impact and a protection',
    )
  })

  it('requires impact categories to classify an impact', () => {
    const projects = [
      project([{ type: 'Contract', address: consumer, name: 'Consumer' }], {
        overrides: {
          [consumer]: {
            fields: {},
            effectRules: [
              {
                id: 'misplacedCategories',
                inputs: [{ effect: 'input' }],
                output: 'output',
                description: 'Transform the input locally.',
                categories: ['funds-can-be-frozen'],
                protection: 'Users retain an exit.',
                terminal: true,
              },
            ],
          },
        },
      }),
    ]

    expect(() =>
      resolveImpactScenarios(
        projects,
        permissionsOutput([]),
        {} as TemplateService,
      ),
    ).toThrow(
      'Effect rule "misplacedCategories" on Consumer defines impact categories but no impact',
    )
  })

  it('rejects duplicate impact categories', () => {
    const projects = [
      project([{ type: 'Contract', address: consumer, name: 'Consumer' }], {
        overrides: {
          [consumer]: {
            fields: {},
            effectRules: [
              {
                id: 'duplicateCategories',
                inputs: [{ effect: 'input' }],
                output: 'output',
                description: 'Transform the input locally.',
                impact: 'Users are harmed.',
                categories: ['funds-can-lose-value', 'funds-can-lose-value'],
                terminal: true,
              },
            ],
          },
        },
      }),
    ]

    expect(() =>
      resolveImpactScenarios(
        projects,
        permissionsOutput([]),
        {} as TemplateService,
      ),
    ).toThrow(
      'Effect rule "duplicateCategories" on Consumer defines duplicate impact categories',
    )
  })

  it('rejects an empty impact category list', () => {
    const projects = [
      project([{ type: 'Contract', address: consumer, name: 'Consumer' }], {
        overrides: {
          [consumer]: {
            fields: {},
            effectRules: [
              {
                id: 'emptyCategories',
                inputs: [{ effect: 'input' }],
                output: 'output',
                description: 'Transform the input locally.',
                impact: 'Users are harmed.',
                categories: [],
                terminal: true,
              },
            ],
          },
        },
      }),
    ]

    expect(() =>
      resolveImpactScenarios(
        projects,
        permissionsOutput([]),
        {} as TemplateService,
      ),
    ).toThrow(
      'Effect rule "emptyCategories" on Consumer defines an empty impact category list',
    )
  })

  function consumerPermission(): NonNullable<
    PermissionsConfig['overrides']
  >[string] {
    return {
      fields: {},
      effectAssumptions: [
        {
          field: 'dependency',
          name: 'External value provider',
          description: 'supply the value consumed by this contract.',
          effects: [
            {
              id: 'value.overstated',
              description: 'The black box can overstate its value.',
            },
          ],
        },
      ],
      effectRules: [
        {
          id: 'consumeOverstatedValue',
          inputs: [{ field: 'dependency', effect: 'value.overstated' }],
          output: 'impact.consumer.changed',
          description: 'The consumer uses the dependency value.',
          impact: 'The consumer is affected.',
          categories: ['funds-can-lose-value'],
          terminal: true,
        },
      ],
    }
  }
})

function project(
  entries: DiscoveryOutput['entries'],
  permissions: PermissionsConfig,
) {
  return {
    discovery: {
      name: 'project',
      timestamp: 1,
      entries,
      abis: {},
      configHash: Hash256.random(),
      usedTemplates: {},
      usedBlockNumbers: {},
    },
    permissions,
  }
}

function permissionsOutput(
  permissions: PermissionsOutput['permissions'],
): PermissionsOutput {
  return {
    permissionsConfigHash: Hash256.random(),
    permissions,
    dependentTimestamps: {},
  }
}
