import {
  type ConfigReader,
  ConfigRegistry,
  type DiscoveryConfig,
} from '@l2beat/discovery'
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { contractStub, discoveredJsonStub } from '../test/stubs/discoveredJson'
import { ProjectDiscovery } from './ProjectDiscovery'

describe(ProjectDiscovery.name, () => {
  const projectName = 'ExampleProject'
  const configReader = mockObject<ConfigReader>({
    readConfig: (projectName: string) => mockConfig(projectName),
    readDiscoveryWithReferences: () => [discoveredJsonStub],
  })

  const discovery = new ProjectDiscovery(projectName, configReader)

  describe(ProjectDiscovery.prototype.getContract.name, () => {
    it('should return contract for given address', () => {
      const contract = discovery.getContract(contractStub.address.toString())

      expect(JSON.stringify(contract)).toEqual(JSON.stringify(contractStub))
    })

    it('should throw an error if contract with given address does not exist', () => {
      const nonExistingAddress = ChainSpecificAddress(
        'eth:0xF380166F8490F24AF32Bf47D1aA217FBA62B6575',
      )

      expect(() => discovery.getContract(nonExistingAddress)).toThrow(
        `Assertion Error: No contract of ${nonExistingAddress} address found (${projectName})`,
      )
    })

    it('should return contract for given name', () => {
      assert(contractStub.name !== undefined)
      const contract = discovery.getContract(contractStub.name)

      expect(JSON.stringify(contract)).toEqual(JSON.stringify(contractStub))
    })

    it('should throw an error if contract for given name does not exist', () => {
      const name = 'randomContract'

      expect(() => discovery.getContract(name)).toThrow(
        `Assertion Error: Found no contract of ${name} name (${projectName})`,
      )
    })

    it('should throw an error if there is more than one contract with given name', () => {
      const name = 'DuplicatedNameContractMock'

      expect(() => discovery.getContract(name)).toThrow(
        `Assertion Error: Found more than one contracts of ${name} name (${projectName})`,
      )
    })
  })

  describe(ProjectDiscovery.prototype.getContractValue.name, () => {
    it('should return given contract value', () => {
      assert(contractStub.name !== undefined)
      const value = discovery.getContractValue(
        contractStub.name,
        'CHILD_BLOCK_INTERVAL',
      )
      expect(value).toEqual(contractStub.values?.CHILD_BLOCK_INTERVAL as number)
    })

    it('should throw an error if given contract value does not exist', () => {
      assert(contractStub.name !== undefined)
      const name = contractStub.name
      const key = 'randomValue'
      expect(() => discovery.getContractValue(name, key)).toThrow(
        `Assertion Error: Value of key ${key} does not exist in ${contractStub.name} contract (${projectName})`,
      )
    })
  })

  it('reads configurations for different chainIds', () => {
    const discovery = new ProjectDiscovery('ExampleProject', configReader)
    const contract = discovery.getContract(contractStub.address.toString())

    expect(JSON.stringify(contract)).toEqual(JSON.stringify(contractStub))
  })

  describe(ProjectDiscovery.prototype.replaceAddressesWithNames.name, () => {
    it('should replace addresses with names', () => {
      const replaced = discovery.replaceAddressesWithNames(
        'Can be updated by eth:0x0D4C1222f5e839a911e2053860e45F18921D72ac, eth:0x787A0ACaB02437c60Aafb1a29167A3609801e320',
      )
      expect(replaced).toEqual(
        'Can be updated by MockedContract, 0x787A0ACaB02437c60Aafb1a29167A3609801e320',
      )
    })
  })

  describe(ProjectDiscovery.prototype.getEoaActors.name, () => {
    it('should return empty arrays when no EOAs have permissions', () => {
      const configReaderEmpty = mockObject<ConfigReader>({
        readConfig: (projectName: string) => mockConfig(projectName),
        readDiscoveryWithReferences: () => [
          {
            ...discoveredJsonStub,
            entries: discoveredJsonStub.entries.filter((e) => e.type !== 'EOA'),
          },
        ],
      })
      const discoveryEmpty = new ProjectDiscovery(
        'EmptyProject',
        configReaderEmpty,
      )

      const result = discoveryEmpty.getEoaActors()

      expect(result).toEqual({
        raw: [],
        linkable: [],
        grouped: [],
      })
    })

    it('should handle single EOA with permissions', () => {
      const configReaderSingle = mockObject<ConfigReader>({
        readConfig: (projectName: string) => mockConfig(projectName),
        readDiscoveryWithReferences: () => [
          {
            ...discoveredJsonStub,
            entries: [
              ...discoveredJsonStub.entries.filter((e) => e.type !== 'EOA'),
              {
                type: 'Contract',
                name: 'TestContract',
                address: ChainSpecificAddress(
                  'eth:0x2222222222222222222222222222222222222222',
                ),
                category: { name: 'Test', priority: 1 },
              },
              {
                type: 'EOA',
                name: 'TestEOA',
                address: ChainSpecificAddress(
                  'eth:0x1111111111111111111111111111111111111111',
                ),
                receivedPermissions: [
                  {
                    permission: 'upgrade',
                    from: ChainSpecificAddress(
                      'eth:0x2222222222222222222222222222222222222222',
                    ),
                  },
                ],
                category: { name: 'Test', priority: 1 },
              },
            ],
          },
        ],
      })
      const discoverySingle = new ProjectDiscovery(
        'SingleProject',
        configReaderSingle,
      )

      const result = discoverySingle.getEoaActors()

      expect(result.raw).toHaveLength(1)
      expect(result.linkable).toHaveLength(1)
      expect(result.grouped).toHaveLength(1)
      expect(result.linkable[0].name).toEqual('TestEOA')
      expect(result.grouped[0].name).toEqual('TestEOA')
    })

    it('should group EOAs with same description but different chains', () => {
      const configReaderMultiChain = mockObject<ConfigReader>({
        readConfig: (projectName: string) => mockConfig(projectName),
        readDiscoveryWithReferences: () => [
          {
            ...discoveredJsonStub,
            entries: [
              ...discoveredJsonStub.entries.filter((e) => e.type !== 'EOA'),
              {
                type: 'Contract',
                name: 'MultiSigContract',
                address: ChainSpecificAddress(
                  'eth:0x3333333333333333333333333333333333333333',
                ),
                category: { name: 'Test', priority: 1 },
              },
              {
                type: 'Contract',
                name: 'MultiSigContract',
                address: ChainSpecificAddress(
                  'arb1:0x3333333333333333333333333333333333333333',
                ),
                category: { name: 'Test', priority: 1 },
              },
              {
                type: 'EOA',
                name: 'MultiSigMember1',
                address: ChainSpecificAddress(
                  'eth:0x1111111111111111111111111111111111111111',
                ),
                receivedPermissions: [
                  {
                    permission: 'upgrade',
                    from: ChainSpecificAddress(
                      'eth:0x3333333333333333333333333333333333333333',
                    ),
                  },
                ],
                category: { name: 'Test', priority: 1 },
              },
              {
                type: 'EOA',
                name: 'MultiSigMember2',
                address: ChainSpecificAddress(
                  'arb1:0x2222222222222222222222222222222222222222',
                ),
                receivedPermissions: [
                  {
                    permission: 'upgrade',
                    from: ChainSpecificAddress(
                      'arb1:0x3333333333333333333333333333333333333333',
                    ),
                  },
                ],
                category: { name: 'Test', priority: 1 },
              },
              {
                type: 'EOA',
                name: 'MultiSigMember3',
                address: ChainSpecificAddress(
                  'eth:0x4444444444444444444444444444444444444444',
                ),
                receivedPermissions: [
                  {
                    permission: 'upgrade',
                    from: ChainSpecificAddress(
                      'eth:0x3333333333333333333333333333333333333333',
                    ),
                  },
                ],
                category: { name: 'Test', priority: 1 },
              },
            ],
          },
        ],
      })
      const discoveryMultiChain = new ProjectDiscovery(
        'MultiChainProject',
        configReaderMultiChain,
      )

      const result = discoveryMultiChain.getEoaActors()

      expect(result.raw).toHaveLength(3)
      expect(result.linkable).toHaveLength(3)

      // Should have 2 grouped actors: one for eth chain (2 EOAs), one for arb1 chain (1 EOA)
      expect(result.grouped).toHaveLength(2)

      const ethGroup = result.grouped.find((g) => g.chain === 'ethereum')
      const arbGroup = result.grouped.find((g) => g.chain === 'arbitrum')

      expect(ethGroup).not.toEqual(undefined)
      expect(arbGroup).not.toEqual(undefined)
      expect(ethGroup?.accounts ?? []).toHaveLength(2)
      expect(arbGroup?.accounts ?? []).toHaveLength(1)
      expect(ethGroup?.name).toEqual('MultiSigMember1 and MultiSigMember3')
      expect(ethGroup?.id).toEqual('MultiSigMember1-and-MultiSigMember3')
      expect(arbGroup?.name).toEqual('MultiSigMember2')
      expect(arbGroup?.id).toEqual('MultiSigMember2')
    })
  })

  describe(ProjectDiscovery.prototype.getDiscoveredPermissions.name, () => {
    it('uses project-scoped permissions after the referenced actor description', () => {
      const target = ChainSpecificAddress(
        'eth:0x1111111111111111111111111111111111111111',
      )
      const dependencyTarget = ChainSpecificAddress(
        'eth:0x2222222222222222222222222222222222222222',
      )
      const externalActor = ChainSpecificAddress(
        'eth:0x3333333333333333333333333333333333333333',
      )
      const unrelatedActor = ChainSpecificAddress(
        'eth:0x4444444444444444444444444444444444444444',
      )
      const rootDiscovery = {
        ...discoveredJsonStub,
        name: 'root',
        entries: [
          { type: 'Contract' as const, address: target, name: 'RootTarget' },
        ],
        externalPermissions: {
          [externalActor]: {
            receivedPermissions: [
              {
                permission: 'interact' as const,
                from: target,
                description: 'provide the input consumed by the project.',
                via: [
                  {
                    address: dependencyTarget,
                    permission: 'act' as const,
                    description: 'reconfigure the dependency.',
                  },
                ],
              },
              {
                permission: 'interact' as const,
                from: dependencyTarget,
                description: 'manage the dependency input.',
              },
            ],
          },
        },
      }
      const dependencyDiscovery = {
        ...discoveredJsonStub,
        name: 'dependency',
        entries: [
          {
            type: 'Contract' as const,
            address: dependencyTarget,
            name: 'DependencyTarget',
          },
          {
            type: 'Contract' as const,
            address: externalActor,
            name: 'ExternalActor',
            description: 'External actor details.',
            receivedPermissions: [
              {
                permission: 'interact' as const,
                from: dependencyTarget,
                description: 'Unrelated dependency permission.',
              },
            ],
          },
          {
            type: 'Contract' as const,
            address: unrelatedActor,
            name: 'UnrelatedActor',
            receivedPermissions: [
              {
                permission: 'interact' as const,
                from: dependencyTarget,
                description: 'Unrelated dependency permission.',
              },
            ],
          },
        ],
      }
      const scopedConfigReader = mockObject<ConfigReader>({
        readConfig: (projectName: string) => mockConfig(projectName),
        readDiscoveryWithReferences: () => [rootDiscovery, dependencyDiscovery],
      })
      const scopedDiscovery = new ProjectDiscovery('root', scopedConfigReader)

      const actors = scopedDiscovery.getDiscoveredPermissions().ethereum.actors

      assert(actors !== undefined)
      expect(actors).toHaveLength(1)
      expect(actors[0].name).toEqual('ExternalActor')
      expect(
        actors[0].description.startsWith('External actor details.'),
      ).toEqual(true)
      expect(actors[0].description).toInclude(
        'provide the input consumed by the project',
      )
      expect(actors[0].description).toInclude('manage the dependency input')
      expect(actors[0].description).toInclude('External actor details.')
      expect(actors[0].description).not.toInclude(
        'Unrelated dependency permission.',
      )
      expect(actors[0].permissionOrigins).toEqual([
        { type: 'project' },
        {
          type: 'dependency',
          name: 'dependency',
          projectId: 'dependency',
        },
      ])
    })

    it('shows modeled capabilities only inside their impact scenarios', () => {
      const modeledTarget = ChainSpecificAddress(
        'eth:0x1111111111111111111111111111111111111111',
      )
      const unrelatedTarget = ChainSpecificAddress(
        'eth:0x2222222222222222222222222222222222222222',
      )
      const actor = ChainSpecificAddress(
        'eth:0x3333333333333333333333333333333333333333',
      )
      const modeledCapability = 'replace the configured oracle.'
      const rootDiscovery = {
        ...discoveredJsonStub,
        name: 'root',
        entries: [
          {
            type: 'Contract' as const,
            address: modeledTarget,
            name: 'ModeledOracle',
          },
          {
            type: 'Contract' as const,
            address: unrelatedTarget,
            name: 'UnrelatedTarget',
          },
          {
            type: 'Contract' as const,
            address: actor,
            name: 'Controller',
            description: 'Controller details.',
            receivedPermissions: [
              {
                permission: 'interact' as const,
                from: modeledTarget,
                description: modeledCapability,
              },
              {
                permission: 'interact' as const,
                from: unrelatedTarget,
                description: 'perform an unrelated action.',
              },
            ],
          },
        ],
        impactScenarios: [
          {
            id: 'scenario-1',
            principals: [{ type: 'address' as const, address: actor }],
            sources: [
              {
                id: 'source-1',
                capabilityId: 'replace-oracle',
                principal: `address:${actor.toLowerCase()}`,
                contract: modeledTarget,
                effect: 'value.overstated',
                capability: modeledCapability,
              },
            ],
            steps: [
              {
                ruleId: 'rule-1',
                ruleDefinition: { id: 'rule-1' },
                contract: modeledTarget,
                inputs: [
                  { address: modeledTarget, effect: 'value.overstated' },
                ],
                output: 'impact.value.overstated',
                impact: 'The consumer reads an overstated value.',
              },
            ],
            terminals: [
              { address: modeledTarget, effect: 'impact.value.overstated' },
            ],
            paths: [
              {
                terminal: {
                  address: modeledTarget,
                  effect: 'impact.value.overstated',
                },
                trace: {
                  type: 'rule' as const,
                  ruleId: 'rule-1',
                  inputs: [{ type: 'source' as const, sourceId: 'source-1' }],
                },
              },
            ],
          },
        ],
      }
      const scopedConfigReader = mockObject<ConfigReader>({
        readConfig: (projectName: string) => mockConfig(projectName),
        readDiscoveryWithReferences: () => [rootDiscovery],
      })
      const scopedDiscovery = new ProjectDiscovery('root', scopedConfigReader)

      const actors = scopedDiscovery.getDiscoveredPermissions().ethereum.actors

      assert(actors !== undefined)
      expect(actors).toHaveLength(1)
      expect(actors[0].description).toInclude('Controller details.')
      expect(actors[0].description).toInclude('perform an unrelated action')
      expect(actors[0].description).not.toInclude(
        'replace the configured oracle',
      )
      expect(
        actors[0].impactScenarios?.[0]?.capabilities[0]?.descriptions,
      ).toEqual([modeledCapability])
      expect(actors[0].permissionOrigins).toEqual([{ type: 'project' }])
    })

    it('groups instances of one impact rule without grouping matching prose from another rule', () => {
      const oracle = ChainSpecificAddress(
        'eth:0x1111111111111111111111111111111111111111',
      )
      const consumerA = ChainSpecificAddress(
        'eth:0x2222222222222222222222222222222222222222',
      )
      const consumerB = ChainSpecificAddress(
        'eth:0x3333333333333333333333333333333333333333',
      )
      const actor = ChainSpecificAddress(
        'eth:0x4444444444444444444444444444444444444444',
      )
      const consumerC = ChainSpecificAddress(
        'eth:0x5555555555555555555555555555555555555555',
      )
      const impact = 'Users observe the wrong value.'
      const rootDiscovery = {
        ...discoveredJsonStub,
        name: 'root',
        entries: [
          { type: 'Contract' as const, address: oracle, name: 'Oracle' },
          {
            type: 'Contract' as const,
            address: consumerA,
            name: 'ConsumerA',
          },
          {
            type: 'Contract' as const,
            address: consumerB,
            name: 'ConsumerB',
          },
          {
            type: 'Contract' as const,
            address: consumerC,
            name: 'ConsumerC',
          },
          {
            type: 'Contract' as const,
            address: actor,
            name: 'Controller',
            receivedPermissions: [
              {
                permission: 'interact' as const,
                from: oracle,
                description: 'control the reported value.',
              },
            ],
          },
        ],
        impactScenarios: [
          {
            id: 'scenario-1',
            principals: [{ type: 'address' as const, address: actor }],
            sources: [
              {
                id: 'source-1',
                capabilityId: 'control-value',
                principal: `address:${actor.toLowerCase()}`,
                contract: oracle,
                effect: 'value.wrong',
                capability: 'control the reported value.',
              },
            ],
            steps: [
              impactStep(
                'rule-a',
                'templates/Consumer',
                consumerA,
                oracle,
                impact,
              ),
              impactStep(
                'rule-b',
                'templates/Consumer',
                consumerB,
                oracle,
                impact,
              ),
              impactStep(
                'rule-c',
                'templates/OtherConsumer',
                consumerC,
                oracle,
                impact,
              ),
              {
                ruleId: 'local-protection',
                ruleDefinition: {
                  template: 'templates/Oracle',
                  id: 'guardExit',
                },
                contract: oracle,
                inputs: [{ address: oracle, effect: 'value.wrong' }],
                output: 'exit.guarded',
                description: 'The oracle guards the exit path.',
                limitation: 'Out-of-bounds values cannot block the exit path.',
              },
              {
                ruleId: 'remaining-protection',
                ruleDefinition: {
                  template: 'templates/Consumer',
                  id: 'keepExitAvailable',
                },
                contract: consumerA,
                inputs: [{ address: oracle, effect: 'exit.guarded' }],
                output: 'protection.exit.available',
                description: 'The consumer keeps its exit path available.',
                protection: 'Users can still exit through ConsumerA.',
              },
            ],
            terminals: [
              ...[consumerA, consumerB, consumerC].map((address) => ({
                address,
                effect: 'impact.value.wrong',
              })),
              {
                address: consumerA,
                effect: 'protection.exit.available',
              },
            ],
            paths: [
              impactPath('rule-a', consumerA),
              impactPath('rule-b', consumerB),
              impactPath('rule-c', consumerC),
              {
                terminal: {
                  address: consumerA,
                  effect: 'protection.exit.available',
                },
                trace: {
                  type: 'rule' as const,
                  ruleId: 'remaining-protection',
                  inputs: [
                    {
                      type: 'rule' as const,
                      ruleId: 'local-protection',
                      inputs: [
                        { type: 'source' as const, sourceId: 'source-1' },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        ],
      }
      const scopedConfigReader = mockObject<ConfigReader>({
        readConfig: (projectName: string) => mockConfig(projectName),
        readDiscoveryWithReferences: () => [rootDiscovery],
      })
      const scopedDiscovery = new ProjectDiscovery('root', scopedConfigReader)

      const actors = scopedDiscovery.getDiscoveredPermissions().ethereum.actors

      assert(actors !== undefined)
      const impacts = actors[0]?.impactScenarios?.[0]?.impacts
      assert(impacts !== undefined)
      expect(impacts).toHaveLength(2)
      expect(impacts[0]?.components).toEqual(['ConsumerA', 'ConsumerB'])
      expect(impacts[0]?.paths.map((path) => path.component)).toEqual([
        'ConsumerA',
        'ConsumerB',
      ])
      expect(impacts[1]?.components).toEqual(['ConsumerC'])
      expect(impacts[0]?.id).not.toEqual(impacts[1]?.id)
      const protections = actors[0]?.impactScenarios?.[0]?.protections
      assert(protections !== undefined)
      expect(protections).toHaveLength(1)
      expect(protections[0]?.description).toEqual(
        'Users can still exit through ConsumerA.',
      )
      expect(protections[0]?.paths[0]?.inputs[0]?.limitation).toEqual(
        'Out-of-bounds values cannot block the exit path.',
      )
    })

    it('keeps one outcome identity across different capability scenarios', () => {
      const oracle = ChainSpecificAddress(
        'eth:0x1111111111111111111111111111111111111111',
      )
      const consumer = ChainSpecificAddress(
        'eth:0x2222222222222222222222222222222222222222',
      )
      const actor = ChainSpecificAddress(
        'eth:0x3333333333333333333333333333333333333333',
      )
      const impact = 'Users observe the wrong value.'
      const rootDiscovery = {
        ...discoveredJsonStub,
        name: 'root',
        entries: [
          { type: 'Contract' as const, address: oracle, name: 'Oracle' },
          { type: 'Contract' as const, address: consumer, name: 'Consumer' },
          {
            type: 'Contract' as const,
            address: actor,
            name: 'Controller',
            receivedPermissions: [
              {
                permission: 'interact' as const,
                from: oracle,
                description: 'replace the source.',
              },
              {
                permission: 'interact' as const,
                from: oracle,
                description: 'reconfigure the source.',
              },
            ],
          },
        ],
        impactScenarios: [
          {
            id: 'scenario-1',
            principals: [{ type: 'address' as const, address: actor }],
            sources: [
              {
                id: 'source-1',
                capabilityId: 'replace-source',
                principal: `address:${actor.toLowerCase()}`,
                contract: oracle,
                effect: 'value.wrong',
                capability: 'replace the source.',
              },
            ],
            steps: [
              impactStep(
                'rule-1',
                'templates/Consumer',
                consumer,
                oracle,
                impact,
              ),
            ],
            terminals: [{ address: consumer, effect: 'impact.value.wrong' }],
            paths: [impactPath('rule-1', consumer, 'source-1')],
          },
          {
            id: 'scenario-2',
            principals: [{ type: 'address' as const, address: actor }],
            sources: [
              {
                id: 'source-2',
                capabilityId: 'reconfigure-source',
                principal: `address:${actor.toLowerCase()}`,
                contract: oracle,
                effect: 'value.wrong',
                capability: 'reconfigure the source.',
              },
            ],
            steps: [
              impactStep(
                'rule-1',
                'templates/Consumer',
                consumer,
                oracle,
                impact,
              ),
            ],
            terminals: [{ address: consumer, effect: 'impact.value.wrong' }],
            paths: [impactPath('rule-1', consumer, 'source-2')],
          },
        ],
      }
      const scopedConfigReader = mockObject<ConfigReader>({
        readConfig: (projectName: string) => mockConfig(projectName),
        readDiscoveryWithReferences: () => [rootDiscovery],
      })
      const scopedDiscovery = new ProjectDiscovery('root', scopedConfigReader)

      const actors = scopedDiscovery.getDiscoveredPermissions().ethereum.actors

      assert(actors !== undefined)
      const scenarios = actors[0]?.impactScenarios
      assert(scenarios !== undefined)
      expect(scenarios).toHaveLength(2)
      expect(scenarios[0]?.impacts[0]?.id).toEqual(scenarios[1]?.impacts[0]?.id)
      expect(scenarios[0]?.capabilities[0]?.descriptions).toEqual([
        'replace the source.',
      ])
      expect(scenarios[1]?.capabilities[0]?.descriptions).toEqual([
        'reconfigure the source.',
      ])
    })

    it('renders a thresholded dependency group as one actor', () => {
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
      const rootDiscovery = {
        ...discoveredJsonStub,
        name: 'root',
        entries: [],
        externalPermissionGroups: [
          {
            id: 'signReports',
            name: 'Signers',
            memberName: 'Signer',
            threshold: 2,
            members: [memberA, memberB],
            admin,
            permission: {
              permission: 'interact' as const,
              from: aggregator,
              description: 'authorize reports.',
            },
          },
        ],
        impactScenarios: [
          {
            id: 'scenario-1',
            principals: [
              {
                type: 'group' as const,
                key: `group:${aggregator.toLowerCase()}:signReports`,
                from: aggregator,
                id: 'signReports',
                name: 'Signers',
              },
            ],
            sources: [
              {
                id: 'source-1',
                capabilityId: 'sign-reports',
                principal: `group:${aggregator.toLowerCase()}:signReports`,
                contract: aggregator,
                effect: 'report.authorized',
                capability: 'authorize reports.',
                description: 'The quorum can authorize a report.',
              },
            ],
            steps: [
              {
                ruleId: 'rule-1',
                ruleDefinition: { id: 'rule-1' },
                contract: aggregator,
                inputs: [{ address: aggregator, effect: 'report.authorized' }],
                output: 'value.overstated',
                description: 'The aggregator accepts the report.',
                impact: 'A false price can be reported.',
                categories: ['funds-can-be-stolen' as const],
                limitation: 'The configured threshold is required.',
              },
            ],
            terminals: [{ address: aggregator, effect: 'value.overstated' }],
            paths: [
              {
                terminal: { address: aggregator, effect: 'value.overstated' },
                trace: {
                  type: 'rule' as const,
                  ruleId: 'rule-1',
                  inputs: [{ type: 'source' as const, sourceId: 'source-1' }],
                },
              },
            ],
          },
        ],
      }
      const dependencyDiscovery = {
        ...discoveredJsonStub,
        name: 'dependency',
        entries: [
          {
            type: 'Contract' as const,
            address: aggregator,
            name: 'ETH_USD_Aggregator',
          },
          {
            type: 'EOA' as const,
            address: memberA,
            name: 'SignerA',
            receivedPermissions: [
              { permission: 'interact' as const, from: aggregator },
            ],
          },
          {
            type: 'EOA' as const,
            address: memberB,
            name: 'SignerB',
            receivedPermissions: [
              { permission: 'interact' as const, from: aggregator },
            ],
          },
          {
            type: 'Contract' as const,
            address: admin,
            name: 'OracleAdmin',
          },
        ],
      }
      const scopedConfigReader = mockObject<ConfigReader>({
        readConfig: (projectName: string) => mockConfig(projectName),
        readDiscoveryWithReferences: () => [rootDiscovery, dependencyDiscovery],
      })
      const scopedDiscovery = new ProjectDiscovery('root', scopedConfigReader)

      const actors = scopedDiscovery.getDiscoveredPermissions().ethereum.actors

      assert(actors !== undefined)
      expect(actors).toHaveLength(1)
      expect(actors[0].name).toEqual('ETH_USD_Aggregator Signers')
      expect(actors[0].displayName).toEqual('ETH_USD_Aggregator Signers')
      expect(actors[0].accounts).toHaveLength(2)
      expect(actors[0].accounts.map((account) => account.displayName)).toEqual([
        'Signer 1',
        'Signer 2',
      ])
      expect(actors[0].description).toInclude(
        'A 2/2 permissioned signer group.',
      )
      expect(actors[0].description).toInclude(
        'OracleAdmin can replace the members',
      )
      expect(actors[0].description).not.toInclude('authorize reports')
      expect(actors[0].permissionOrigins).toEqual([
        {
          type: 'dependency',
          name: 'dependency',
          projectId: 'dependency',
        },
      ])
      const impactId = actors[0].impactScenarios?.[0]?.impacts[0]?.id
      assert(impactId !== undefined)
      expect(impactId.startsWith('0x')).toEqual(true)
      expect(actors[0].impactScenarios).toEqual([
        {
          id: 'scenario-1',
          requires: undefined,
          capabilities: [
            {
              actor: 'ETH_USD_Aggregator Signers',
              component: 'ETH_USD_Aggregator',
              descriptions: ['authorize reports.'],
            },
          ],
          impacts: [
            {
              id: impactId,
              components: ['ETH_USD_Aggregator'],
              description: 'A false price can be reported.',
              categories: ['funds-can-be-stolen'],
              limitation: 'The configured threshold is required.',
              paths: [
                {
                  component: 'ETH_USD_Aggregator',
                  effect: 'value.overstated',
                  description: 'The aggregator accepts the report.',
                  limitation: 'The configured threshold is required.',
                  inputs: [
                    {
                      component: 'ETH_USD_Aggregator',
                      effect: 'report.authorized',
                      description: 'The quorum can authorize a report.',
                      inputs: [],
                    },
                  ],
                },
              ],
            },
          ],
          protections: [],
        },
      ])
    })
  })
})

function impactStep(
  ruleId: string,
  template: string,
  contract: ChainSpecificAddress,
  oracle: ChainSpecificAddress,
  impact: string,
) {
  return {
    ruleId,
    ruleDefinition: { template, id: 'consumeWrongValue' },
    contract,
    inputs: [{ address: oracle, effect: 'value.wrong' }],
    output: 'impact.value.wrong',
    description: 'The consumer uses the reported value.',
    impact,
  }
}

function impactPath(
  ruleId: string,
  contract: ChainSpecificAddress,
  sourceId = 'source-1',
) {
  return {
    terminal: { address: contract, effect: 'impact.value.wrong' },
    trace: {
      type: 'rule' as const,
      ruleId,
      inputs: [{ type: 'source' as const, sourceId }],
    },
  }
}

function mockConfig(
  name: string,
  innerConfig: Partial<DiscoveryConfig> = {},
): ConfigRegistry {
  return new ConfigRegistry({
    name,
    initialAddresses: [],
    ...innerConfig,
  })
}
