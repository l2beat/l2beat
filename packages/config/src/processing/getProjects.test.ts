import {
  createTrackedTxId,
  type TrackedTxConfigEntry,
  type TrackedTxFunctionCallConfig,
  type TrackedTxTransferConfig,
} from '@l2beat/shared'
import { assert, EthereumAddress, type ProjectId } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { expect } from 'earl'
import { existsSync } from 'fs'
import { asArray } from '../templates/utils'
import { NON_DISCOVERY_DRIVEN_PROJECTS } from '../test/constants'
import { checkRisk } from '../test/helpers'
import type { BaseProject } from '../types'
import {
  areContractsDiscoveryDriven,
  arePermissionsDiscoveryDriven,
} from '../utils/discoveryDriven'
import { getProjects } from './getProjects'
import { layer2s } from './layer2s'
import { layer3s } from './layer3s'

describe('getProjects', () => {
  const projects = getProjects()

  describe('every project has a unique and valid id and slug', () => {
    const ids = new Set<ProjectId>()
    const slugs = new Set<string>()
    for (const project of projects) {
      it(`${project.name} id: ${project.id}, slug: ${project.slug}`, () => {
        expect(project.slug).toMatchRegex(/^[a-z\-\d]+$/)
        expect(ids.has(project.id)).toEqual(false)
        ids.add(project.id)
        if (project.slug === 'payy' || project.slug === 'near') {
          // Those two projects are exceptions!
          // Both should most likely be merged with their duplicates
          // Right now it only works because refactored projects are resolved
          // first when querying by slug
          return
        }

        expect(slugs.has(project.slug)).toEqual(false)
        slugs.add(project.slug)

        const dir = `./src/projects/${project.id}/${project.id}.ts`
        expect(existsSync(dir)).toEqual(true)
      })
    }
  })

  describe('every non-ecosystem project has statuses and display', () => {
    for (const project of projects) {
      if (project.ecosystemConfig) {
        continue
      }
      it(project.name, () => {
        expect(project.statuses).not.toEqual(undefined)
        expect(project.display).not.toEqual(undefined)
      })
    }
  })

  it('every project can be serialized', () => {
    function findNonSerializable(
      value: unknown,
      path: string[],
    ): string[] | undefined {
      if (
        typeof value === 'boolean' ||
        typeof value === 'number' ||
        typeof value === 'string' ||
        value === undefined
      ) {
        return undefined
      }
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const res = findNonSerializable(value[i], [...path, i.toString()])
          if (res) {
            return res
          }
        }
        return undefined
      }
      if (
        typeof value === 'object' &&
        value !== null &&
        Object.getPrototypeOf(value) === Object.prototype
      ) {
        for (const key in value) {
          const res = findNonSerializable(Reflect.get(value, key), [
            ...path,
            key,
          ])
          if (res) {
            return res
          }
        }
        return undefined
      }
      return path
    }

    for (const project of projects) {
      const path = findNonSerializable(project, [])
      if (path) {
        throw new Error(
          `Project ${project.id} cannot be serialized. Path: ${path.join('.')}`,
        )
      }
    }
  })

  describe('display.description ends with a dot', () => {
    for (const project of projects) {
      if (project.display) {
        it(project.name, () => {
          expect(project.display?.description.endsWith('.')).toEqual(true)
        })
      }
    }
  })

  describe('verifier descriptions end with a dot', () => {
    for (const project of projects) {
      if (!project.proofVerification) {
        return
      }
      describe(project.name, () => {
        project.proofVerification?.verifiers.forEach((sV) => {
          it(sV.name, () => {
            expect(sV.description.endsWith('.')).toEqual(true)
          })
        })
      })
    }
  })

  describe('synchronization with scaling projects - layer2s and layer3s', () => {
    it('each scaling project should have a corresponding entry in the DA-BEAT', () => {
      const daLayers = projects.filter((x) => x.daLayer !== undefined)
      const daBridges = projects.filter((x) => x.daBridge !== undefined)

      // It can be squashed, but it's more readable this way
      const target = [...layer2s, ...layer3s].filter(
        (project) =>
          !project.isUpcoming &&
          !project.reviewStatus &&
          !project.archivedAt &&
          // It makes no sense to list them on the DA-BEAT
          project.dataAvailability &&
          asArray(project.dataAvailability).some(
            (da) => da.layer.value !== 'None',
          ) &&
          asArray(project.dataAvailability).some(
            (da) => da.bridge.projectId !== undefined,
          ) &&
          asArray(project.dataAvailability).every((da) => {
            const bridgeProjId = da.bridge.projectId
            if (bridgeProjId === undefined) return true
            daBridges.map((x) => x.id).includes(bridgeProjId)
          }) &&
          // Will be listed on the DA-BEAT automatically
          !project.customDa,
      )

      const daBeatProjectIds = daLayers
        .flatMap((project) => project.daLayer?.usedWithoutBridgeIn ?? [])
        .concat(daBridges.flatMap((bridge) => bridge.daBridge?.usedIn ?? []))
        .map((usedIn) => usedIn.id)

      const scalingProjectIds = target.map((project) => project.id)

      const projectsWithoutDaBeatEntry = scalingProjectIds.filter(
        (project) => !daBeatProjectIds.includes(project),
      )

      // Array comparison to have a better error message with actual names
      expect(projectsWithoutDaBeatEntry).toEqual([])
    })
  })

  describe('daLayer', () => {
    const SUPPORTED_ECONOMIC_SECURITY_PROJECTS = [
      'ethereum',
      'celestia',
      'avail',
      'near-da',
    ]

    for (const project of projects) {
      if (project.daLayer?.economicSecurity) {
        it(`${project.id} economicSecurity is supported in BE code`, () => {
          expect(
            SUPPORTED_ECONOMIC_SECURITY_PROJECTS.includes(project.id),
          ).toEqual(true)
        })
      }
    }

    const SUPPORTED_DYNAMIC_VALIDATORS_PROJECTS = [
      'ethereum',
      'celestia',
      'avail',
      'near-da',
    ]

    for (const project of projects) {
      if (project.daLayer?.validators?.type === 'dynamic') {
        it(`${project.id} dynamic type validators is supported in BE code`, () => {
          expect(
            SUPPORTED_DYNAMIC_VALIDATORS_PROJECTS.includes(project.id),
          ).toEqual(true)
        })
      }
    }
  })

  describe('contracts', () => {
    for (const project of getProjects()) {
      describe(project.id, () => {
        const permissions = Object.values(project.permissions ?? {})
        const all = [
          ...permissions.flatMap((p) => p.roles ?? []),
          ...permissions.flatMap((p) => p.actors ?? []),
        ]

        const contracts = project.contracts?.addresses ?? {}
        for (const [chain, perChain] of Object.entries(contracts)) {
          for (const contract of perChain) {
            it(`contract [${chain}:${contract.address}] name isn't empty`, () => {
              assert(
                contract.name.trim().length > 0,
                [
                  `contract [${chain}:${contract.address}] name is empty`,
                  `this is most likely because it's unverified and the name needs to be assigned manually`,
                ].join('\n'),
              )
            })

            const upgradableBy = contract.upgradableBy
            const actorIds = all.map((a) => a.id)

            if (upgradableBy) {
              it('contracts.upgradableBy is valid', () => {
                const expectedToContain = upgradableBy.map(
                  (a) => a.id ?? a.name,
                )

                for (const expected of expectedToContain) {
                  const message = [
                    '',
                    chalk.red('ERROR:'),
                    `Contract ${contract.name} (${contract.address}) in project ${chalk.blue(project.id)} is marked as upgradable by an actor named ${chalk.magenta(expected)}.`,
                    `But the actor ${chalk.magenta(expected)} does not exist in the list of actors!`,
                    '',
                    `${chalk.cyan('Current actors')}: ${all.map((a) => a.name).join(', ')}`,
                    '',
                    `${chalk.green('POSSIBLE FIX')}: check if the actor is not marked as spam`,
                  ].join('\n')

                  assert(actorIds.includes(expected), message)
                }
              })
            }
          }
        }

        for (const [i, risk] of project.contracts?.risks.entries() ?? []) {
          checkRisk(risk, `contracts.risks[${i}]`)
        }
      })
    }
  })

  describe('chain config', () => {
    const chains = projects
      .map((x) =>
        x.chainConfig
          ? {
              projectId: x.id,
              ...x.chainConfig,
            }
          : undefined,
      )
      .filter((x) => x !== undefined)

    it('every name is lowercase a-z0-9 <20 characters', () => {
      for (const chain of chains) {
        expect(chain.name).toMatchRegex(/^[a-z0-9]{1,20}$/)
      }
    })

    it('every name is unique', () => {
      const encountered = new Set()
      for (const chain of chains) {
        expect(encountered.has(chain.name)).toEqual(false)
        encountered.add(chain.name)
      }
    })

    it('every name is equal to projectId', () => {
      // in many places chain name and project id are used interchangeably so we need them to be the same
      // do not add new projects here!
      const KNOWN_EXCEPTIONS = ['polygonpos', 'g7']

      for (const chain of chains) {
        if (KNOWN_EXCEPTIONS.includes(chain.name)) continue
        expect(chain.name).toEqual(chain.projectId)
      }
    })

    it('every chainId is unique', () => {
      const encountered = new Set()
      for (const chain of chains) {
        if (encountered.has(chain.chainId)) {
          expect(chain.chainId).toEqual(undefined)
        }
        encountered.add(chain.chainId)
      }
    })

    it('every explorerUrl does not end with /', () => {
      for (const chain of chains) {
        if (chain.explorerUrl) {
          expect(chain.explorerUrl).toMatchRegex(/\w$/)
        }
      }
    })

    it('every api url uses https', () => {
      for (const chain of chains) {
        for (const api of chain.apis) {
          if ('url' in api) {
            expect(api.url).toMatchRegex(/^https:\/\//)
          }
        }
      }
    })

    describe('every multicall3 contract has the same address', () => {
      const address = EthereumAddress(
        '0xcA11bde05977b3631167028862bE2a173976CA11',
      )

      const contracts = chains
        .filter(
          (c) =>
            c.name !== 'zksync2' && c.name !== 'kinto' && c.name !== 'degen',
        ) // we are omitting zksync2, degen and kinto as they use different addresses
        .flatMap(
          (x) => x.multicallContracts?.map((y) => [x.name, y] as const) ?? [],
        )
        .filter(([_, y]) => y.version === '3')

      for (const [chain, contract] of contracts) {
        it(`multicall3 on ${chain}`, () => {
          expect(contract.address).toEqual(address)
        })
      }
    })

    describe('multicall contracts are sorted by sinceBlock', () => {
      for (const chain of chains) {
        const contracts = chain.multicallContracts?.map((x) => x.sinceBlock)
        if (!contracts || contracts.length === 0) {
          continue
        }
        it(chain.name, () => {
          expect(contracts).toEqual(contracts.slice().sort((a, b) => b - a))
        })
      }
    })
  })

  describe('Tracked transactions', () => {
    it('every TrackedTxId is unique', () => {
      const ids = new Set<string>()
      for (const project of projects) {
        const trackedTxsIds =
          project.trackedTxsConfig?.map((entry) => createTrackedTxId(entry)) ??
          []
        for (const id of trackedTxsIds) {
          assert(!ids.has(id), `Duplicate TrackedTxsId in ${project.id}`)
          ids.add(id)
        }
      }
    })
    describe('transfers', () => {
      it('every configuration points to unique transfer params', () => {
        const transfers = new Set<string>()
        for (const project of projects) {
          const transferConfigs = project.trackedTxsConfig?.filter(
            (
              e,
            ): e is TrackedTxConfigEntry & {
              params: TrackedTxTransferConfig
            } => e.params.formula === 'transfer',
          )
          for (const config of transferConfigs ?? []) {
            const key =
              (config.params.from ? `${config.params.from.toString()}-` : '') +
              `${config.params.to.toString()}-${config.type}`
            assert(
              !transfers.has(key),
              `Duplicate transfer config in ${project.id}`,
            )
            transfers.add(key)
          }
        }
      })
    })
    describe('function calls', () => {
      it('every configuration points to unique function call params', () => {
        const functionCalls = new Set<string>()
        for (const project of projects) {
          const functionCallConfigs = project.trackedTxsConfig?.filter(
            (
              e,
            ): e is TrackedTxConfigEntry & {
              params: TrackedTxFunctionCallConfig
            } => e.params.formula === 'functionCall',
          )
          for (const config of functionCallConfigs ?? []) {
            const key = `${config.params.address.toString()}-${
              config.params.selector
            }-${config.untilTimestamp?.toString()}-${config.type}-${config.subtype}`
            assert(
              !functionCalls.has(key),
              `Duplicate function call config in ${project.id}`,
            )
            functionCalls.add(key)
          }
        }
      })
    })
  })

  describe('links', () => {
    describe('every project has at least one website link', () => {
      for (const project of projects) {
        if (project.display?.links.websites) {
          it(project.name, () => {
            expect(
              project.display?.links.websites?.length ?? 0,
            ).toBeGreaterThan(0)
          })
        }
      }
    })

    describe('every link is https', () => {
      const links = projects.flatMap((x) =>
        (Object.values(x.display?.links ?? {}) as string[]).flat(),
      )
      for (const link of links) {
        it(link, () => {
          expect(link).toMatchRegex(/^https:\/\//)
        })
      }
    })

    describe('social media links are properly formatted', () => {
      const links = projects.flatMap((x) => x.display?.links.socialMedia ?? [])
      for (const link of links) {
        it(link, () => {
          if (link.includes('discord')) {
            expect(link).toMatchRegex(
              /^https:\/\/discord\.(gg|com\/invite)\/[\w-]+$/,
            )
          } else if (link.includes('t.me')) {
            expect(link).toMatchRegex(
              /^https:\/\/t\.me\/(joinchat\/)?[\w\-+]+$/,
            )
          } else if (link.includes('medium')) {
            expect(link).toMatchRegex(
              /^https:\/\/([\w-]+\.)?medium\.com\/[@\w-]*$/,
            )
          } else if (link.includes('twitter')) {
            expect(link).toMatchRegex(/^https:\/\/twitter\.com\/[\w-]+$/)
          } else if (link.includes('reddit')) {
            expect(link).toMatchRegex(/^https:\/\/reddit\.com\/r\/[\w-]+\/$/)
          } else if (link.includes('youtube')) {
            if (!link.includes('playlist')) {
              expect(link).toMatchRegex(
                /^https:\/\/youtube\.com\/((c|channel)\/|@)[\w-]+$/,
              )
            }
          } else if (link.includes('twitch')) {
            expect(link).toMatchRegex(/^https:\/\/twitch\.tv\/[\w-]+$/)
          } else if (link.includes('gitter')) {
            expect(link).toMatchRegex(/^https:\/\/gitter\.im\/[\w-/]+$/)
          } else if (link.includes('instagram')) {
            expect(link).toMatchRegex(/^https:\/\/instagram\.com\/[\w-./]+$/)
          }
        })
      }
    })
  })

  // TODO: refactor config so there are no more zeroes, resync data
  describe('daTracking', () => {
    // Some of the projects have sinceBlock set to zero because they were added at DA Module start
    const excluded = new Set([
      'aevo',
      'ancient',
      'arbitrum',
      'base',
      'bob',
      'fuel',
      'hypr',
      'ink',
      'karak',
      'kinto',
      'kroma',
      'linea',
      'loopring',
      'lyra',
      'eclipse',
      'mantapacific',
      'mint',
      'morph',
      'optimism',
      'orderly',
      'paradex',
      'polynomial',
      'scroll',
      'sophon',
      'starknet',
      'superlumio',
      'taiko',
      'b3',
      'deri',
      'ham',
      'rari',
      'stack',
    ])

    // All new projects should have non-zero sinceBlock/sinceTimestamp - it will make sync more efficient
    describe('every project has non-zero sinceBlock/sinceTimestamp', () => {
      for (const project of projects) {
        if (project.daTrackingConfig) {
          if (!excluded.has(project.id)) {
            it(project.id, () => {
              assert(project.daTrackingConfig) // type issue
              for (const config of project.daTrackingConfig) {
                if (
                  config.type === 'ethereum' ||
                  config.type === 'avail' ||
                  config.type === 'celestia'
                ) {
                  expect(config.sinceBlock).toBeGreaterThan(0)
                } else {
                  expect(config.sinceTimestamp).toBeGreaterThan(0)
                }
              }
            })
          }
        }
      }
    })

    describe('every appId is unique for Avail projects', () => {
      const appIds = new Map<string, string>()
      for (const project of projects) {
        const trackingConfig = project.daTrackingConfig
        if (trackingConfig) {
          it(project.id, () => {
            for (const config of trackingConfig) {
              if (config.type === 'avail') {
                for (const appId of config.appIds) {
                  assert(
                    !appIds.has(appId),
                    `Duplicate appId (${appId}) detected [${project.id}, ${appIds.get(appId)}]`,
                  )
                  appIds.set(appId, project.id)
                }
              }
            }
          })
        }
      }
    })

    describe('every namespace is unique for Celestia projects', () => {
      const namespaces = new Map<string, string>()
      for (const project of projects) {
        if (project.daTrackingConfig) {
          it(project.id, () => {
            assert(project.daTrackingConfig) // type issue
            for (const config of project.daTrackingConfig) {
              if (config.type === 'celestia') {
                assert(
                  !namespaces.has(config.namespace),
                  `Duplicate namespace (${config.namespace}) detected [${project.id}, ${namespaces.get(config.namespace)}]`,
                )
                namespaces.set(config.namespace, project.id)
              }
            }
          })
        }
      }
    })
  })

  describe('all new projects are discovery driven', () => {
    const isNormalProject = (p: BaseProject) => {
      return (
        p.isScaling === true &&
        p.archivedAt === undefined &&
        p.isUpcoming !== true
      )
    }

    const filteredProjects = projects.filter(
      (p) =>
        isNormalProject(p) &&
        !NON_DISCOVERY_DRIVEN_PROJECTS.includes(p.id.toString()),
    )

    for (const p of filteredProjects) {
      it(`${p.id.toString()} is discovery driven`, () => {
        assert(
          arePermissionsDiscoveryDriven(p.permissions) &&
            areContractsDiscoveryDriven(p.contracts),
          'New projects are expected to be discovery driven. Read the comment in constants.ts',
        )
      })
    }
  })

  describe('badges', () => {
    const singularBadges = ['Infra', 'RaaS', 'Stack', 'Fork', 'L3ParentChain']

    for (const badge of singularBadges) {
      it(`has maximum one ${badge} badge`, () => {
        for (const project of projects) {
          const badges = project.display?.badges?.filter(
            (b) => b.type === badge,
          )
          if (badges) {
            expect(badges.length).toBeLessThanOrEqual(1)
          }
        }
      })
    }
  })

  describe('associated tokens can only have category other', () => {
    for (const project of projects) {
      if (!project.tvsConfig) {
        continue
      }
      const associated = project.tvsConfig?.filter((t) => t.isAssociated)
      for (const a of associated) {
        it(`${project.name}: ${a.id}`, () => {
          expect(a.category).toEqual('other')
        })
      }
    }
  })
})
