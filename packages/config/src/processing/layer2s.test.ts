import {
  assertUnreachable,
  ChainSpecificAddress,
  notUndefined,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import uniq from 'lodash/uniq'
import { describe } from 'mocha'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import type { ProjectScalingTechnology } from '../internalTypes'
import { isRiskCorrectlyFormatted } from '../test/helpers'
import { getTokenList } from '../tokens/tokens'
import { chains } from './chains'
import { ecosystems } from './ecosystems'
import { layer2s, milestonesLayer2s } from './layer2s'

const tokenList = getTokenList(chains)

describe('layer2s', () => {
  it('l2s do not have a host chain', () => {
    for (const layer2 of layer2s) {
      expect(layer2.hostChain).toEqual(undefined)
      expect(layer2.stackedRiskView).toEqual(undefined)
    }
  })

  describe('ecosystems', () => {
    const ecosystemIds = ecosystems.map((e) => e.id)
    it('every project with ecosystemInfo has valid ecosystem configured', () => {
      for (const layer2 of layer2s) {
        if (layer2.ecosystemInfo) {
          expect(ecosystemIds).toInclude(layer2.ecosystemInfo.id)
        }
      }
    })

    it('uses isPartOfSuperchain only for superchain', () => {
      for (const layer2 of layer2s) {
        if (layer2.ecosystemInfo?.isPartOfSuperchain) {
          expect(layer2.ecosystemInfo?.id).toEqual(ProjectId('superchain'))
        }
      }
    })
  })

  describe('links', () => {
    const links = layer2s.flatMap((l) => Object.values(l.display.links).flat())

    it('all links do not contain spaces', () => {
      expect(links.filter((link) => link.includes(' '))).toEqual([])
    })

    it('do not include www part', () => {
      expect(links.filter((link) => link.includes('www'))).toEqual([])
    })
  })

  describe('escrows', () => {
    it('every escrow in new format resolves to discovery entry', () => {
      const missing: string[] = []
      for (const layer2 of layer2s) {
        // NOTE(radomski): PolygonCDK projects have a shared escrow
        if (layer2.display.stacks?.includes('Agglayer CDK')) continue

        const escrows = layer2.config.escrows.filter(
          (e) => e.contract && !e.isHistorical,
        )
        if (escrows.length === 0) continue

        const discovery = new ProjectDiscovery(layer2.id.toString())
        for (const escrow of escrows) {
          const address = ChainSpecificAddress.from('eth', escrow.address)
          if (discovery.getContractByAddress(address) === undefined) {
            missing.push(`${layer2.id} ${address}`)
          }
        }
      }
      expect(missing).toEqual([])
    })

    it('every escrow sinceTimestamp is greater or equal to chains sinceTimestamp', () => {
      const problems: string[] = []
      for (const layer2 of layer2s) {
        for (const escrow of layer2.config.escrows) {
          const label = `${layer2.id} ${escrow.address}`
          const chain = chains.find((c) => c.name === escrow.chain)
          if (!chain) {
            problems.push(`${label}: chain ${escrow.chain} not found`)
            continue
          }
          if (!chain.sinceTimestamp) {
            problems.push(`${label}: chain ${chain.name} has no sinceTimestamp`)
            continue
          }
          if (escrow.sinceTimestamp < chain.sinceTimestamp) {
            problems.push(`${label}: before chain ${chain.name} sinceTimestamp`)
          }
        }
      }
      expect(problems).toEqual([])
    })

    it('every escrow can resolve all of its tokens', () => {
      const chainsMap = new Map<string, number | undefined>(
        chains.map((c) => [c.name, c.chainId]),
      )
      const missing: string[] = []
      for (const layer2 of layer2s) {
        for (const escrow of layer2.config.escrows) {
          const chainId = chainsMap.get(escrow.chain)
          if (!chainId) continue
          if (escrow.tokens === '*') continue
          const tokensOnChain = tokenList.filter((t) => t.chainId === chainId)
          for (const token of escrow.tokens) {
            if (!tokensOnChain.some((t) => t.symbol === token)) {
              missing.push(`${layer2.id} ${escrow.address}: ${token}`)
            }
          }
        }
      }
      // Add the missing tokens on the escrow's chain
      expect(missing).toEqual([])
    })
  })

  it('chain name equals project id', () => {
    const exceptions = ['polygon-pos', 'apex-pro']
    const invalid = layer2s
      .filter((l) => l.chainConfig !== undefined)
      .filter((l) => !exceptions.includes(l.id))
      .filter((l) => l.chainConfig?.name !== l.id.toString())
      .map((l) => l.id)
    expect(invalid).toEqual([])
  })

  describe('tracked transactions', () => {
    it('every tracked transaction which is function call has valid signatures', () => {
      const invalid: string[] = []
      for (const project of layer2s) {
        for (const { query } of project.config.trackedTxs ?? []) {
          if (query.formula !== 'functionCall') continue
          const i = new utils.Interface([query.functionSignature])
          const fragment = i.fragments[0]
          if (i.getSighash(fragment) !== query.selector) {
            invalid.push(`${project.id}: ${query.functionSignature}`)
          }
        }
      }
      expect(invalid).toEqual([])
    })

    it('every cost multiplier is in 0 to 1 range', () => {
      const invalid = layer2s
        .filter((p) =>
          (p.config.trackedTxs ?? [])
            .map((t) => t._hackCostMultiplier)
            .filter(notUndefined)
            .some((m) => m <= 0 || m > 1),
        )
        .map((p) => p.id)
      expect(invalid).toEqual([])
    })

    it('every current address is present in discovery', () => {
      const missing: string[] = []
      for (const project of layer2s) {
        const addresses = (project.config.trackedTxs ?? [])
          .filter(({ query }) => query.untilTimestamp === undefined)
          .flatMap(({ query }) => {
            switch (query.formula) {
              case 'functionCall':
                return [query.address]
              case 'transfer':
                return []
              case 'sharpSubmission':
                return []
              case 'sharedBridge':
                return []
              default:
                assertUnreachable(query)
            }
          })
        if (addresses.length === 0) continue

        const discovery = new ProjectDiscovery(project.id.toString())
        for (const a of addresses) {
          const address = ChainSpecificAddress.from('eth', a)
          if (discovery.getContractByAddress(address) === undefined) {
            missing.push(`${project.id} ${address}`)
          }
        }
      }
      expect(missing).toEqual([])
    })
  })

  it('all arbitrum and op stack chains have the assessCount defined', () => {
    const missing = layer2s
      .filter((layer2) => {
        const { stacks: stack } = layer2.display
        return stack?.includes('Arbitrum') || stack?.includes('OP Stack')
      })
      // we skip zircuit, it is an anomaly. the research team decided to not
      // do any adjustment and overcount by 1/6.
      .filter((layer2) => layer2.id !== 'zircuit')
      .filter((layer2) => {
        const { activityConfig } = layer2.config
        return (
          activityConfig?.type === 'block' &&
          activityConfig.adjustCount === undefined
        )
      })
      .map((layer2) => layer2.id)
    expect(missing).toEqual([])
  })

  it('every referenced address is found in discovery', () => {
    const missing: string[] = []
    for (const layer2 of layer2s) {
      const referencedAddresses = new Set(
        JSON.stringify(layer2)
          .match(/address\/(0x[a-fA-F0-9]{40})/g)
          ?.map((match) => match.slice(8).toLowerCase()) || [],
      )
      if (referencedAddresses.size === 0) continue

      const discoveryAddresses = new Set(
        new ProjectDiscovery(layer2.id)
          .getTopLevelAddresses()
          .map((address) =>
            ChainSpecificAddress.address(address).toString().toLowerCase(),
          ),
      )
      for (const address of referencedAddresses) {
        if (!discoveryAddresses.has(address)) {
          missing.push(`${layer2.id} ${address}`)
        }
      }
    }
    expect(missing).toEqual([])
  })

  describe('display', () => {
    it('every description ends with a dot', () => {
      const invalid = layer2s
        .filter((l) => !l.display.description.endsWith('.'))
        .map((l) => l.id)
      expect(invalid).toEqual([])
    })

    it('every technology choice is correctly formatted', () => {
      const keys = [
        'dataAvailability',
        'operator',
        'forceTransactions',
        'exitMechanisms',
        'massExit',
        'otherConsiderations',
      ] as const satisfies (keyof ProjectScalingTechnology)[]

      const problems: string[] = []
      for (const layer2 of layer2s) {
        for (const key of keys) {
          const item = layer2.technology?.[key]
          const choices = item === undefined ? [] : [item].flat()
          for (const [i, choice] of choices.entries()) {
            const label = `${layer2.id} ${key}[${i}]`
            if (choice.name.endsWith('.')) {
              problems.push(`${label}.name ends with a dot`)
            }
            if (!choice.description.endsWith('.')) {
              problems.push(`${label}.description does not end with a dot`)
            }
            for (const risk of choice.risks) {
              if (!isRiskCorrectlyFormatted(risk)) {
                problems.push(`${label}.risks: ${risk.text}`)
              }
            }
          }
        }
      }
      expect(problems).toEqual([])
    })
  })

  describe('others', () => {
    it('no project has duplicated reasons for being other', () => {
      const invalid = layer2s
        .filter((l) => {
          const labels = (l.reasonsForBeingOther ?? []).map((r) => r.label)
          return labels.length !== uniq(labels).length
        })
        .map((l) => l.id)
      expect(invalid).toEqual([])
    })

    it('live projects without proof system have reasons for being other', () => {
      const invalid = layer2s
        .filter((l) => !l.archivedAt && !l.proofSystem)
        .filter((l) => (l.reasonsForBeingOther?.length ?? 0) === 0)
        .map((l) => l.id)
      expect(invalid).toEqual([])
    })
  })

  describe('milestones', () => {
    const allMilestones = [
      ...milestonesLayer2s.map((milestone) => ({
        label: `${milestone.title} (main page)`,
        milestone,
      })),
      ...layer2s.flatMap((l) =>
        (l.milestones ?? []).map((milestone) => ({
          label: `${milestone.title} (${l.display.name})`,
          milestone,
        })),
      ),
    ]

    it('name is no longer than 50 characters', () => {
      const invalid = allMilestones
        .filter(({ milestone }) => milestone.title.length > 50)
        .map(({ label }) => label)
      expect(invalid).toEqual([])
    })

    it('description ends with a dot', () => {
      const invalid = allMilestones
        .filter(({ milestone }) => milestone.description !== undefined)
        .filter(({ milestone }) => !milestone.description?.endsWith('.'))
        .map(({ label }) => label)
      expect(invalid).toEqual([])
    })

    it('description is no longer than 100 characters', () => {
      const invalid = allMilestones
        .filter(({ milestone }) => (milestone.description?.length ?? 0) > 100)
        .map(({ label }) => label)
      expect(invalid).toEqual([])
    })

    it('date is full day', () => {
      const invalid = allMilestones
        .filter(
          ({ milestone }) =>
            !UnixTime.isFull(
              UnixTime.fromDate(new Date(milestone.date)),
              'day',
            ),
        )
        .map(({ label }) => label)
      expect(invalid).toEqual([])
    })

    it('date is correct', () => {
      const invalid = allMilestones
        .filter(({ milestone }) =>
          Number.isNaN(new Date(milestone.date).getTime()),
        )
        .map(({ label }) => label)
      expect(invalid).toEqual([])
    })
  })

  it('every stage requirement description ends with a dot', () => {
    const invalid: string[] = []
    for (const layer2 of layer2s) {
      if (
        layer2.stage.stage === 'UnderReview' ||
        layer2.stage.stage === 'NotApplicable'
      ) {
        continue
      }
      for (const item of layer2.stage.summary) {
        for (const req of item.requirements) {
          if (req.description.includes('[View code]')) continue
          if (!req.description.endsWith('.')) {
            invalid.push(`${layer2.id}: ${req.description}`)
          }
        }
      }
    }
    expect(invalid).toEqual([])
  })

  it('every state validation description ends with a dot', () => {
    const invalid: string[] = []
    for (const layer2 of layer2s) {
      const stateValidation = layer2.stateValidation
      if (!stateValidation) continue

      if (
        stateValidation.description &&
        !stateValidation.description.endsWith('.')
      ) {
        invalid.push(`${layer2.id}: description`)
      }
      for (const category of stateValidation.categories) {
        if (!category.description.endsWith('.')) {
          invalid.push(`${layer2.id}: ${category.title}`)
        }
      }
    }
    expect(invalid).toEqual([])
  })

  it('no project has duplicated badges', () => {
    const invalid = layer2s
      .filter((l) => l.badges !== undefined)
      .filter((l) => l.badges?.length !== uniq(l.badges).length)
      .map((l) => l.id)
    expect(invalid).toEqual([])
  })
})
