import { existsSync } from 'fs'
import {
  type TrackedTxConfigEntry,
  type TrackedTxFunctionCallConfig,
  type TrackedTxTransferConfig,
  createTrackedTxId,
} from '@l2beat/shared'
import { assert, EthereumAddress, type ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
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
      // It can be squashed, but it's more readable this way
      const target = [...layer2s, ...layer3s].filter(
        (project) =>
          !project.isUpcoming &&
          !project.isUnderReview &&
          !project.isArchived &&
          // TODO: Ideally the category check should be removed, but
          // hyperliquid and polygon-pos are exceptions that would fail the test
          (project.display.category === 'Optimium' ||
            project.display.category === 'Validium') &&
          // It makes no sense to list them on the DA-BEAT
          project.dataAvailability &&
          project.dataAvailability.layer.value !== 'None' &&
          // Will be listed on the DA-BEAT automatically
          !project.customDa,
      )

      const daLayers = projects.filter((x) => x.daLayer !== undefined)
      const daBridges = projects.filter((x) => x.daBridge !== undefined)

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

  describe('contracts', () => {
    for (const project of getProjects()) {
      describe(project.id, () => {
        const contracts = project.contracts?.addresses ?? {}
        for (const [chain, perChain] of Object.entries(contracts)) {
          for (const [i, contract] of perChain.entries()) {
            const description = contract.description
            if (description) {
              it(`contracts[${i}].description - each line ends with a dot`, () => {
                for (const descLine of description.trimEnd().split('\n')) {
                  expect(descLine.trimEnd().endsWith('.')).toEqual(true)
                }
              })
            }

            it(`contracts[${chain}][${i}] name isn't empty`, () => {
              expect(contract.name.trim().length).toBeGreaterThan(0)
            })
            const upgradableBy = contract.upgradableBy
            const permissionsForChain = (project.permissions ?? {})[chain]
            const all = [
              ...(permissionsForChain?.roles ?? []),
              ...(permissionsForChain?.actors ?? []),
            ]
            const actors = all.map((x) => {
              if (x.name === 'EOA') {
                assert(x.accounts[0].type === 'EOA')
                return x.accounts[0].address
              }
              return x.name
            })

            if (upgradableBy) {
              it(`contracts[${chain}][${i}].upgradableBy is valid`, () => {
                expect(actors).toInclude(...upgradableBy.map((a) => a.name))
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
      .map((x) => x.chainConfig)
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
            const key = `${config.params.from.toString()}-${config.params.to.toString()}-${
              config.type
            }`
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

  describe('escrows', () => {
    it('every escrow is unique', () => {
      const addressToKey = (address: EthereumAddress, chain: string) =>
        `${address.toString()} (${chain})`
      const addresses = new Set<string>()

      for (const project of projects) {
        for (const { address, chain } of project.tvlConfig?.escrows ?? []) {
          it(address.toString(), () => {
            const key = addressToKey(address, chain ?? 'ethereum')
            expect(addresses.has(key)).toEqual(false)
            addresses.add(key)
          })
        }
      }
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

    // All new projects should have non-zero sinceBlock - it will make sync more efficient
    describe('every project has non-zero sinceBlock', () => {
      for (const project of projects) {
        if (project.daTrackingConfig) {
          if (!excluded.has(project.id)) {
            it(project.id, () => {
              assert(project.daTrackingConfig) // type issue
              for (const config of project.daTrackingConfig) {
                expect(config.sinceBlock).toBeGreaterThan(0)
              }
            })
          }
        }
      }
    })
  })

  describe('all new projects are discovery driven', () => {
    const isNormalProject = (p: BaseProject) => {
      return (
        p.isScaling === true && p.isArchived !== true && p.isUpcoming !== true
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
})
