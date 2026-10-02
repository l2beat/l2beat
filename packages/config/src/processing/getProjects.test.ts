import {
  createTrackedTxId,
  type TrackedTxConfigEntry,
  type TrackedTxFunctionCallConfig,
  type TrackedTxTransferConfig,
} from '@l2beat/shared'
import {
  assert,
  type ChainSpecificAddress,
  EthereumAddress,
  notUndefined,
  type ProjectId,
} from '@l2beat/shared-pure'
import chalk from 'chalk'
import { expect } from 'earl'
import { existsSync } from 'fs'
import uniq from 'lodash/uniq'
import { asArray } from '../templates/utils'
import { NON_DISCOVERY_DRIVEN_PROJECTS } from '../test/constants'
import { isRiskCorrectlyFormatted } from '../test/helpers'
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
  const projectsById = new Map(projects.map((p) => [p.id, p]))

  it('every project has a unique and valid id and slug', () => {
    const problems: string[] = []
    const ids = new Set<ProjectId>()
    const slugs = new Set<string>()
    for (const project of projects) {
      if (!/^[a-z\-\d]+$/.test(project.slug)) {
        problems.push(`${project.id}: invalid slug ${project.slug}`)
      }
      if (ids.has(project.id)) {
        problems.push(`${project.id}: duplicate id`)
      }
      ids.add(project.id)
      if (project.slug === 'near') {
        // This project is an exception.
        // It should most likely be merged with its duplicate
        // Right now it only works because refactored projects are resolved
        // first when querying by slug
        continue
      }

      if (slugs.has(project.slug)) {
        problems.push(`${project.id}: duplicate slug ${project.slug}`)
      }
      slugs.add(project.slug)

      const dir = `./src/projects/${project.id}/${project.id}.ts`
      if (!existsSync(dir)) {
        problems.push(`${project.id}: missing ${dir}`)
      }
    }
    expect(problems).toEqual([])
  })

  it('every project has statuses and display (except ecosystems and interop protocols)', () => {
    const missing = projects
      .filter(
        (p) =>
          !(
            (p.ecosystemConfig || p.interopConfig) &&
            (!p.statuses || !p.display)
          ),
      )
      .filter((p) => p.statuses === undefined || p.display === undefined)
      .map((p) => p.id)
    expect(missing).toEqual([])
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

  it('display.description ends with a dot', () => {
    const invalid = projects
      .filter((p) => p.display && !p.display.description.endsWith('.'))
      .map((p) => p.id)
    expect(invalid).toEqual([])
  })

  describe('synchronization with scaling projects - layer2s and layer3s', () => {
    it('each scaling project should have a corresponding entry in the DA-BEAT', () => {
      const daLayers = projects.filter((x) => x.daLayer !== undefined)
      const daBridges = projects.filter((x) => x.daBridge !== undefined)

      // It can be squashed, but it's more readable this way
      const target = [...layer2s, ...layer3s].filter(
        (project) =>
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
            return daBridges.map((x) => x.id).includes(bridgeProjId)
          }) &&
          // an L2 can be the DA layer of an L3, and scaling projects are not
          // listed on the DA-BEAT
          asArray(project.dataAvailability).every((da) => {
            const layerProjId = da.layer.projectId
            if (layerProjId === undefined) return true
            return daLayers.map((x) => x.id).includes(layerProjId)
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

    it('each referenced DA bridge project exists', () => {
      const daBridgeIds = projects
        .filter((x) => x.daBridge !== undefined)
        .map((x) => x.id)

      const dangling = [...layer2s, ...layer3s].flatMap((project) =>
        asArray(project.dataAvailability)
          .map((da) => da.bridge.projectId)
          .filter(notUndefined)
          .filter((bridgeProjId) => !daBridgeIds.includes(bridgeProjId))
          .map((bridgeProjId) => `${project.id} -> ${bridgeProjId}`),
      )

      expect(dangling).toEqual([])
    })
  })

  describe('daLayer', () => {
    const SUPPORTED_ECONOMIC_SECURITY_PROJECTS = [
      'ethereum',
      'celestia',
      'avail',
      'near-da',
      'espresso',
    ]

    it('every economicSecurity is supported in BE code', () => {
      const unsupported = projects
        .filter((p) => p.daLayer?.economicSecurity)
        .filter((p) => !SUPPORTED_ECONOMIC_SECURITY_PROJECTS.includes(p.id))
        .map((p) => p.id)
      expect(unsupported).toEqual([])
    })

    const SUPPORTED_DYNAMIC_VALIDATORS_PROJECTS = [
      'ethereum',
      'celestia',
      'avail',
      'near-da',
      'espresso',
    ]

    it('every dynamic type validators is supported in BE code', () => {
      const unsupported = projects
        .filter((p) => p.daLayer?.validators?.type === 'dynamic')
        .filter((p) => !SUPPORTED_DYNAMIC_VALIDATORS_PROJECTS.includes(p.id))
        .map((p) => p.id)
      expect(unsupported).toEqual([])
    })
  })

  describe('zk catalog', () => {
    const usageMap = getUsageMap(projects)
    const currentZkCatalogsByTvsProject = new Map<ProjectId, ProjectId[]>()

    for (const project of projects) {
      if (!project.zkCatalogInfo) continue

      for (const tvsProject of project.zkCatalogInfo.projectsForTvs ?? []) {
        if (tvsProject.untilTimestamp) continue

        const zkCatalogs = currentZkCatalogsByTvsProject.get(
          tvsProject.projectId,
        )
        if (zkCatalogs) {
          zkCatalogs.push(project.id)
        } else {
          currentZkCatalogsByTvsProject.set(tvsProject.projectId, [project.id])
        }
      }
    }

    const unconfiguredUsages: string[] = []
    const undetectedTvsProjects: string[] = []
    for (const project of projects) {
      if (!project.zkCatalogInfo) continue
      const liveTvsProjects = new Set(
        project.zkCatalogInfo.projectsForTvs
          ?.filter((p) => !p.untilTimestamp)
          .map((p) => p.projectId),
      )

      const usedInVerifiers = uniq(
        project.zkCatalogInfo.verifierHashes.flatMap((v) =>
          v.knownDeployments.flatMap(
            (d) => d.overrideUsedIn ?? usageMap.get(`${d.address}`),
          ),
        ),
      ).filter((p): p is ProjectId => {
        if (p === undefined) return false

        // Archived projects can keep historical verifier deployments, but
        // they do not have to be listed as current TVS projects. Shared
        // verifier deployments can also be attributed to another current
        // zk catalog entry.
        if (projectsById.get(p)?.archivedAt !== undefined) return false

        const currentZkCatalogs = currentZkCatalogsByTvsProject.get(p)
        return (
          currentZkCatalogs === undefined ||
          currentZkCatalogs.includes(project.id)
        )
      })
      const usedInVerifiersSet = new Set(usedInVerifiers)

      for (const usedIn of usedInVerifiers) {
        if (!liveTvsProjects.has(usedIn)) {
          unconfiguredUsages.push(`${usedIn} in ${project.id}`)
        }
      }

      for (const tvsProject of liveTvsProjects) {
        const tvsProjectConfig = projectsById.get(tvsProject)
        if (!tvsProjectConfig || tvsProjectConfig.archivedAt) continue
        if (tvsProjectConfig.daBridge) continue
        if (!usedInVerifiersSet.has(tvsProject)) {
          undetectedTvsProjects.push(`${tvsProject} in ${project.id}`)
        }
      }
    }

    it('every verifier user is configured in TVS projects', () => {
      expect(unconfiguredUsages).toEqual([])
    })

    it('every TVS project is detected in verifier usage', () => {
      expect(undetectedTvsProjects).toEqual([])
    })
  })

  it('every proofSystem zkCatalogIds entry references a zk catalog project', () => {
    const problems: string[] = []
    for (const project of projects) {
      const zkCatalogIds = project.scalingInfo?.proofSystem?.zkCatalogIds ?? []
      if (new Set(zkCatalogIds).size !== zkCatalogIds.length) {
        problems.push(`${project.id}: duplicates`)
      }
      for (const zkCatalogId of zkCatalogIds) {
        if (projectsById.get(zkCatalogId)?.zkCatalogInfo === undefined) {
          problems.push(`${project.id}: unknown ${zkCatalogId}`)
        }
      }
    }
    expect(problems).toEqual([])
  })

  it('scaling project zkVerifiers are configured in zk catalog', () => {
    const zkCatalogAddresses = new Set<ChainSpecificAddress>()
    for (const project of projects) {
      if (!project.zkCatalogInfo) continue
      for (const verifierHash of project.zkCatalogInfo.verifierHashes) {
        for (const deployment of verifierHash.knownDeployments) {
          zkCatalogAddresses.add(deployment.address)
        }
      }
    }

    const missing: string[] = []
    for (const project of projects) {
      if (!project.scalingInfo || !project.contracts?.zkVerifiers) continue
      for (const verifier of project.contracts.zkVerifiers) {
        if (!zkCatalogAddresses.has(verifier)) {
          missing.push(`${project.id} ${verifier}`)
        }
      }
    }
    expect(missing).toEqual([])
  })

  it('zk catalog projects are archived when all their projects are archived', () => {
    const notArchived = projects
      .filter((p) => p.zkCatalogInfo && p.archivedAt === undefined)
      .filter((p) => {
        const tvsProjects = p.zkCatalogInfo?.projectsForTvs ?? []
        return (
          tvsProjects.length > 0 &&
          tvsProjects.every(
            (t) => projectsById.get(t.projectId)?.archivedAt !== undefined,
          )
        )
      })
      .map((p) => p.id)
    expect(notArchived).toEqual([])
  })

  it('every tracked externalDependency exists', () => {
    const missing = projects.flatMap((p) =>
      (p.externalDependencies ?? [])
        .filter((d) => d.type === 'tracked')
        .filter((d) => !projectsById.has(d.projectId))
        .map((d) => `${p.id} -> ${d.projectId}`),
    )
    expect(missing).toEqual([])
  })

  it('every DeFi TVL source is complete', () => {
    const problems: string[] = []
    for (const project of projects) {
      const tvl = project.defiInfo?.tvl
      if (!tvl) continue

      if (tvl.source === 'l2beat') {
        if (project.tvsConfig === undefined) {
          problems.push(`${project.id}: L2BEAT source without TVS config`)
        }
        continue
      }
      if (project.tvsConfig !== undefined) {
        problems.push(`${project.id}: external source with TVS config`)
      }
      if (tvl.protocolSlug.length === 0) {
        problems.push(`${project.id}: empty protocolSlug`)
      }
      if (tvl.sinceTimestamp <= 0) {
        problems.push(`${project.id}: non-positive sinceTimestamp`)
      }
      if (tvl.chains.length === 0) {
        problems.push(`${project.id}: no chains`)
      }
      if (new Set(tvl.chains.map((c) => c.chain)).size !== tvl.chains.length) {
        problems.push(`${project.id}: duplicate chain`)
      }
      if (
        new Set(tvl.chains.map((c) => c.providerChain)).size !==
        tvl.chains.length
      ) {
        problems.push(`${project.id}: duplicate providerChain`)
      }
    }
    expect(problems).toEqual([])
  })

  describe('privacy projects', () => {
    const chainNames = new Set(
      projects.flatMap((p) => (p.chainConfig ? [p.chainConfig.name] : [])),
    )

    const privacyProjects = projects.flatMap((p) =>
      p.privacyInfo ? [{ project: p, privacyInfo: p.privacyInfo }] : [],
    )

    it('every project has valid trackedOn chains', () => {
      const problems: string[] = []
      for (const { project, privacyInfo } of privacyProjects) {
        const trackedOn = privacyInfo.trackedOn
        if (trackedOn.length === 0) {
          problems.push(`${project.id}: not tracked on any chain`)
        }
        if (new Set(trackedOn).size !== trackedOn.length) {
          problems.push(`${project.id}: duplicate trackedOn chains`)
        }
        for (const chain of trackedOn) {
          if (!chainNames.has(chain)) {
            problems.push(`${project.id}: no chainConfig named ${chain}`)
          }
        }
      }
      expect(problems).toEqual([])
    })

    it('every project has at most one zk catalog trusted setup entry', () => {
      const invalid = privacyProjects
        .filter(({ project }) => {
          const trustedSetups = project.zkCatalogInfo?.trustedSetups ?? []
          return trustedSetups.length > 1
        })
        .map(({ project }) => project.id)
      expect(invalid).toEqual([])
    })

    it('every project has valid anonymity-set configuration', () => {
      const problems: string[] = []
      for (const { project, privacyInfo } of privacyProjects) {
        const trackedBucketIds = new Set<string>()
        const seriesIds = new Set<string>()
        let configuredBuckets = 0

        for (const token of privacyInfo.tokens ?? []) {
          for (const bucket of token.buckets) {
            const amounts = bucket.anonymitySet?.minimumAmounts
            if (amounts === undefined) continue

            if (amounts.length === 0) {
              problems.push(`${project.id} ${bucket.id}: no minimumAmounts`)
            }
            if (trackedBucketIds.has(bucket.id)) {
              problems.push(`${project.id} ${bucket.id}: duplicate bucket`)
            }
            trackedBucketIds.add(bucket.id)

            configuredBuckets++
            for (const amount of amounts) {
              if (!/^[1-9]\d*$/.test(amount)) {
                problems.push(`${project.id} ${bucket.id}: invalid ${amount}`)
              }
              const seriesId = `${bucket.id}:${amount}`
              if (seriesIds.has(seriesId)) {
                problems.push(`${project.id}: duplicate series ${seriesId}`)
              }
              seriesIds.add(seriesId)
            }
          }
        }

        if (privacyInfo.anonymitySet !== undefined && configuredBuckets !== 0) {
          problems.push(
            `${project.id}: ${privacyInfo.anonymitySet.type} with buckets`,
          )
        }
      }
      expect(problems).toEqual([])
    })

    it('every adversary cell is consistent with the baseline and contracts', () => {
      const problems: string[] = []
      for (const { project, privacyInfo } of privacyProjects) {
        const adversaries = privacyInfo.adversaries
        if (!adversaries) continue
        const baseline = adversaries.cells.publicObserver
        const contractNames = new Set(
          Object.values(project.contracts?.addresses ?? {})
            .flat()
            .map((c) => c.name),
        )
        for (const [adversaryId, cell] of Object.entries(adversaries.cells)) {
          if (
            (cell.interior !== undefined) !==
            (baseline.interior !== undefined)
          ) {
            problems.push(
              `${project.id} ${adversaryId}: interior map differs from baseline`,
            )
          }
          for (const source of cell.sources ?? []) {
            if (!('contract' in source)) continue
            if (!contractNames.has(source.contract)) {
              problems.push(
                `${project.id} ${adversaryId}: unknown contract ${source.contract}`,
              )
            }
          }
        }
      }
      expect(problems).toEqual([])
    })
  })

  describe('contracts', () => {
    it('every contract name is not empty', () => {
      const unnamed = projects.flatMap((p) =>
        Object.values(p.contracts?.addresses ?? {})
          .flat()
          .filter((c) => c.name.trim().length === 0)
          .map((c) => `${p.id} ${c.address}`),
      )
      // Most likely unverified, the name needs to be assigned manually
      expect(unnamed).toEqual([])
    })

    it('every contracts.upgradableBy is valid', () => {
      for (const project of projects) {
        const permissions = Object.values(project.permissions ?? {})
        const all = [
          ...permissions.flatMap((p) => p.roles ?? []),
          ...permissions.flatMap((p) => p.actors ?? []),
        ]
        const actorIds = all.map((a) => a.id)

        const contracts = Object.values(project.contracts?.addresses ?? {})
        for (const contract of contracts.flat()) {
          for (const actor of contract.upgradableBy ?? []) {
            const expected = actor.id ?? actor.name

            if (actorIds.includes(expected)) {
              const reachableActorMarkedUnreachableMessage = [
                '',
                chalk.red('ERROR:'),
                `Contract ${contract.name} (${contract.address}) in project ${chalk.blue(project.id)} has upgrader ${chalk.magenta(expected)} marked as unreachable.`,
                'Reachable upgraders should not have unreachable: true.',
                '',
                `${chalk.green('POSSIBLE FIX')}: remove unreachable: true for reachable upgraders`,
              ].join('\n')
              assert(
                actor.unreachable !== true,
                reachableActorMarkedUnreachableMessage,
              )
              continue
            }

            const missingActorMessage = [
              '',
              chalk.red('ERROR:'),
              `Contract ${contract.name} (${contract.address}) in project ${chalk.blue(project.id)} is marked as upgradable by an actor named ${chalk.magenta(expected)}.`,
              `But the actor ${chalk.magenta(expected)} does not exist in the list of actors!`,
              '',
              `${chalk.cyan('Current actors')}: ${all.map((a) => a.name).join(', ')}`,
              '',
              `${chalk.green('POSSIBLE FIX')}: check if the actor should be marked with unreachable: true`,
            ].join('\n')

            assert(actor.unreachable === true, missingActorMessage)

            const unreachableActorWithIdMessage = [
              '',
              chalk.red('ERROR:'),
              `Contract ${contract.name} (${contract.address}) in project ${chalk.blue(project.id)} has unreachable upgrader ${chalk.magenta(actor.name)}.`,
              'Unreachable upgraders cannot be linked to a permission actor id.',
              '',
              `${chalk.green('POSSIBLE FIX')}: remove the id field for unreachable upgraders`,
            ].join('\n')

            assert(actor.id === undefined, unreachableActorWithIdMessage)
          }
        }
      }
    })

    it('every contracts risk is correctly formatted', () => {
      const invalid = projects.flatMap((p) =>
        (p.contracts?.risks ?? [])
          .filter((r) => !isRiskCorrectlyFormatted(r))
          .map((r) => `${p.id}: ${r.text}`),
      )
      expect(invalid).toEqual([])
    })
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
      const KNOWN_EXCEPTIONS = ['polygonpos', 'g7', 'apexomni', 'apexpro']

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
          if ('url' in api && api.url !== undefined) {
            expect(api.url).toMatchRegex(/^https:\/\//)
          }
        }
      }
    })

    it('every multicall3 contract has the same address', () => {
      const address = EthereumAddress(
        '0xcA11bde05977b3631167028862bE2a173976CA11',
      )

      const invalid = chains
        .filter(
          (c) =>
            c.name !== 'zksync2' &&
            c.name !== 'kinto' &&
            c.name !== 'degen' &&
            c.name !== 'abstract',
        ) // we are omitting zksync2, degen and kinto as they use different addresses
        .flatMap(
          (x) => x.multicallContracts?.map((y) => [x.name, y] as const) ?? [],
        )
        .filter(([_, y]) => y.version === '3' && y.address !== address)
        .map(([chain]) => chain)
      expect(invalid).toEqual([])
    })

    it('multicall contracts are sorted by sinceBlock', () => {
      const unsorted = chains
        .filter((chain) => {
          const blocks = (chain.multicallContracts ?? []).map(
            (x) => x.sinceBlock,
          )
          return blocks.some((block, i) => block > (blocks[i - 1] ?? block))
        })
        .map((chain) => chain.name)
      expect(unsorted).toEqual([])
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

    it('every untilTimestamp (if present) is greater than sinceTimestamp', () => {
      const invalid = projects.flatMap((p) =>
        (p.trackedTxsConfig ?? [])
          .filter(
            (c) => c.untilTimestamp && c.untilTimestamp <= c.sinceTimestamp,
          )
          .map((c) => `${p.id} ${createTrackedTxId(c)}`),
      )
      expect(invalid).toEqual([])
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
    it('every websites list is not empty', () => {
      const empty = projects
        .filter((p) => p.display?.links.websites?.length === 0)
        .map((p) => p.id)
      expect(empty).toEqual([])
    })

    it('every link is https', () => {
      const invalid = projects
        .flatMap((x) =>
          (Object.values(x.display?.links ?? {}) as string[]).flat(),
        )
        .filter((link) => !link.startsWith('https://'))
      expect(invalid).toEqual([])
    })

    it('social media links are properly formatted', () => {
      const invalid = projects
        .flatMap((x) => x.display?.links.socialMedia ?? [])
        .filter((link) => !isSocialMediaLinkFormatted(link))
      expect(invalid).toEqual([])
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

    const trackingConfigs = projects.flatMap((p) =>
      (p.daTrackingConfig ?? []).map((config) => ({ projectId: p.id, config })),
    )

    // All new projects should have non-zero sinceBlock/sinceTimestamp - it will make sync more efficient
    it('every project has non-zero sinceBlock/sinceTimestamp', () => {
      const invalid = trackingConfigs
        .filter(({ projectId }) => !excluded.has(projectId))
        .filter(({ config }) =>
          config.type === 'ethereum' ||
          config.type === 'avail' ||
          config.type === 'celestia'
            ? config.sinceBlock <= 0
            : config.sinceTimestamp <= 0,
        )
        .map(({ projectId }) => projectId)
      expect(invalid).toEqual([])
    })

    // The backend compares these raw strings against tx to/from addresses,
    // so a chain-prefixed address (e.g. 'eth:0x...') silently matches nothing
    it('every ethereum inbox and sequencer is a plain unprefixed address', () => {
      const invalid = trackingConfigs.flatMap(({ projectId, config }) =>
        config.type === 'ethereum'
          ? [config.inbox, ...(config.sequencers ?? [])]
              .filter((a) => EthereumAddress.tryParse(a) === undefined)
              .map((a) => `${projectId} ${a}`)
          : [],
      )
      expect(invalid).toEqual([])
    })

    it('every appId is unique for Avail projects', () => {
      const appIds = new Map<string, string>()
      const duplicates: string[] = []
      for (const { projectId, config } of trackingConfigs) {
        if (config.type !== 'avail') continue
        for (const appId of config.appIds) {
          const owner = appIds.get(appId)
          if (owner !== undefined) {
            duplicates.push(`${appId} [${projectId}, ${owner}]`)
          }
          appIds.set(appId, projectId)
        }
      }
      expect(duplicates).toEqual([])
    })

    it('every namespace is unique for Celestia projects', () => {
      const namespaces = new Map<string, string>()
      const duplicates: string[] = []
      for (const { projectId, config } of trackingConfigs) {
        if (config.type !== 'celestia') continue
        const owner = namespaces.get(config.namespace)
        if (owner !== undefined) {
          duplicates.push(`${config.namespace} [${projectId}, ${owner}]`)
        }
        namespaces.set(config.namespace, projectId)
      }
      expect(duplicates).toEqual([])
    })
  })

  // New projects are expected to be discovery driven. Read the comment in constants.ts
  it('all new projects are discovery driven', () => {
    const notDiscoveryDriven = projects
      .filter((p) => p.scalingInfo && p.archivedAt === undefined)
      .filter((p) => !NON_DISCOVERY_DRIVEN_PROJECTS.includes(p.id.toString()))
      .filter(
        (p) =>
          !arePermissionsDiscoveryDriven(p.permissions) ||
          !areContractsDiscoveryDriven(p.contracts),
      )
      .map((p) => p.id)
    expect(notDiscoveryDriven).toEqual([])
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

  it('associated tokens can only have category other', () => {
    const invalid = projects.flatMap((p) =>
      (p.tvsConfig ?? [])
        .filter((t) => t.isAssociated && t.category !== 'other')
        .map((t) => `${p.id}: ${t.id}`),
    )
    expect(invalid).toEqual([])
  })
})

function isSocialMediaLinkFormatted(link: string): boolean {
  if (link.includes('discord')) {
    return /^https:\/\/discord\.(gg|com\/invite)\/[\w-]+$/.test(link)
  }
  if (link.includes('t.me')) {
    return /^https:\/\/t\.me\/(joinchat\/)?[\w\-+]+$/.test(link)
  }
  if (link.includes('medium')) {
    return /^https:\/\/([\w-]+\.)?medium\.com\/[@\w-]*$/.test(link)
  }
  if (link.includes('twitter')) {
    return /^https:\/\/twitter\.com\/[\w-]+$/.test(link)
  }
  if (link.includes('reddit')) {
    return /^https:\/\/reddit\.com\/r\/[\w-]+\/$/.test(link)
  }
  if (link.includes('youtube')) {
    return (
      link.includes('playlist') ||
      /^https:\/\/youtube\.com\/((c|channel)\/|@)[\w-]+$/.test(link)
    )
  }
  if (link.includes('twitch')) {
    return /^https:\/\/twitch\.tv\/[\w-]+$/.test(link)
  }
  if (link.includes('gitter')) {
    return /^https:\/\/gitter\.im\/[\w-/]+$/.test(link)
  }
  if (link.includes('instagram')) {
    return /^https:\/\/instagram\.com\/[\w-./]+$/.test(link)
  }
  return true
}

// This is simpler version of getContractUtils that we have in FE. It's used only for testing.
function getUsageMap(projects: BaseProject[]) {
  const usageMap = new Map<`${ChainSpecificAddress}`, ProjectId[]>()

  function addUsage(address: ChainSpecificAddress, usage: ProjectId) {
    const key = `${address}` as const
    const uses = usageMap.get(key)
    if (!uses) {
      usageMap.set(key, [usage])
      return
    }
    if (!uses.includes(usage)) {
      uses.push(usage)
    }
  }

  for (const project of projects) {
    if (
      !(project.scalingInfo || project.daBridge || project.privacyInfo) ||
      !project.contracts
    )
      continue

    for (const [, contracts] of Object.entries(project.contracts.addresses)) {
      for (const contract of contracts) {
        addUsage(contract.address, project.id)
        for (const impl of contract.upgradeability?.implementations ?? []) {
          addUsage(impl, project.id)
        }
      }
    }
  }
  return usageMap
}
