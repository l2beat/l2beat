import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { utils } from 'ethers'
import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type ZkStackDaTrackingHandlerDefinition = v.infer<
  typeof ZkStackDaTrackingHandlerDefinition
>
export const ZkStackDaTrackingHandlerDefinition = v.strictObject({
  type: v.literal('zkStackDaTracking'),
  l2ChainId: v.number(),
  // Append-only list of inbox eras. When the chain migrates to a new
  // ValidatorTimelock, close the last era with untilBlock and append a new
  // one - never edit or remove existing entries, the backend wipes DA data
  // indexed under identities that disappear.
  eras: v.array(
    v.strictObject({
      // ChainSpecificAddress of the ValidatorTimelock acting as DA inbox
      inbox: v.string(),
      validatorSource: v.union([
        // ValidatorAdded/ValidatorRemoved(chainId, validator) on legacy
        // ValidatorTimelocks
        v.literal('legacyEvents'),
        // RoleGranted/RoleRevoked(chainAddress, role, account) on post-v29
        // cross-chain access control ValidatorTimelocks
        v.literal('crossChainRoles'),
      ]),
      // Diamond address of the chain, required for crossChainRoles
      chainAddress: v.string().optional(),
      // Role hash filter for crossChainRoles, defaults to EXECUTOR_ROLE
      role: v.string().optional(),
      // Defaults to the block of the first validator event of this era
      sinceBlock: v.number().optional(),
      // Defaults to the next era's sinceBlock; the last era stays open
      untilBlock: v.number().optional(),
      // Full override for eras whose validator set cannot be derived from
      // events (e.g. periods where batches were relayed by a gateway)
      sequencers: v.array(v.string()).optional(),
    }),
  ),
})

const abi = new utils.Interface([
  'event ValidatorAdded(uint256 indexed chainId, address validator)',
  'event ValidatorRemoved(uint256 indexed chainId, address validator)',
  'event RoleGranted(address indexed chainAddress, bytes32 indexed role, address indexed account)',
  'event RoleRevoked(address indexed chainAddress, bytes32 indexed role, address indexed account)',
])

const EXECUTOR_ROLE = utils.solidityKeccak256(['string'], ['EXECUTOR_ROLE'])

interface ValidatorEvent {
  blockNumber: number
  logIndex: number
  validator: string
  added: boolean
}

interface DaTrackingEntry {
  inbox: string
  sequencers: string[]
  sinceBlock: number
  untilBlock?: number
}

type EraDefinition = ZkStackDaTrackingHandlerDefinition['eras'][number]

export class ZkStackDaTrackingHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: ZkStackDaTrackingHandlerDefinition,
  ) {}

  async execute(
    provider: IProvider,
    _address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    try {
      const entries = await this.resolveEras(provider)
      return {
        field: this.field,
        value: entries as unknown as ContractValue,
        // The value is pure data for the backend DA indexer - the addresses
        // in it (old inboxes, validator EOAs) must not be pulled into the
        // discovery graph as relatives.
        ignoreRelative: true,
      }
    } catch (e) {
      return {
        field: this.field,
        error: e instanceof Error ? e.message : String(e),
      }
    }
  }

  private async resolveEras(provider: IProvider): Promise<DaTrackingEntry[]> {
    const eras = this.definition.eras
    if (eras.length === 0) {
      throw new Error('At least one era must be configured')
    }

    const eraEvents = await Promise.all(
      eras.map((era) =>
        era.sequencers !== undefined
          ? Promise.resolve([])
          : this.fetchValidatorEvents(provider, era),
      ),
    )

    const effectiveSince = eras.map((era, i) => {
      const since = era.sinceBlock ?? eraEvents[i]?.[0]?.blockNumber
      if (since === undefined) {
        throw new Error(
          `Era ${i} (inbox ${era.inbox}) has no validator events and no explicit sinceBlock`,
        )
      }
      return since
    })

    const effectiveUntil = eras.map((era, i) => {
      if (era.untilBlock !== undefined) {
        return era.untilBlock
      }
      // The last era stays open
      return i + 1 < eras.length ? effectiveSince[i + 1] : undefined
    })

    const entries: DaTrackingEntry[] = []
    for (const [i, era] of eras.entries()) {
      const since = effectiveSince[i]
      if (since === undefined) {
        throw new Error(`Era ${i} (inbox ${era.inbox}) has no sinceBlock`)
      }
      entries.push(
        ...this.buildEraEntries(
          era,
          eraEvents[i] ?? [],
          since,
          effectiveUntil[i],
          i,
        ),
      )
    }

    return coalesceSameIdentity(entries).sort(
      (a, b) => a.sinceBlock - b.sinceBlock,
    )
  }

  private async fetchValidatorEvents(
    provider: IProvider,
    era: EraDefinition,
  ): Promise<ValidatorEvent[]> {
    const inbox = ChainSpecificAddress(era.inbox)
    const events: ValidatorEvent[] = []

    if (era.validatorSource === 'legacyEvents') {
      const logs = await provider.getLogs(inbox, [
        [
          abi.getEventTopic('ValidatorAdded'),
          abi.getEventTopic('ValidatorRemoved'),
        ],
      ])
      for (const rawLog of logs) {
        const log = abi.parseLog(rawLog)
        if (!log.args.chainId.eq(this.definition.l2ChainId)) {
          continue
        }
        events.push({
          blockNumber: rawLog.blockNumber,
          logIndex: rawLog.logIndex,
          validator: log.args.validator as string,
          added: log.name === 'ValidatorAdded',
        })
      }
    } else {
      if (era.chainAddress === undefined) {
        throw new Error(
          `Era with inbox ${era.inbox} uses crossChainRoles and requires a chainAddress`,
        )
      }
      const chainAddress = ChainSpecificAddress.address(
        ChainSpecificAddress(era.chainAddress),
      ).toLowerCase()
      const role = (era.role ?? EXECUTOR_ROLE).toLowerCase()

      const logs = await provider.getLogs(inbox, [
        [abi.getEventTopic('RoleGranted'), abi.getEventTopic('RoleRevoked')],
      ])
      for (const rawLog of logs) {
        const log = abi.parseLog(rawLog)
        if (
          (log.args.chainAddress as string).toLowerCase() !== chainAddress ||
          (log.args.role as string).toLowerCase() !== role
        ) {
          continue
        }
        events.push({
          blockNumber: rawLog.blockNumber,
          logIndex: rawLog.logIndex,
          validator: log.args.account as string,
          added: log.name === 'RoleGranted',
        })
      }
    }

    return events.sort(
      (a, b) => a.blockNumber - b.blockNumber || a.logIndex - b.logIndex,
    )
  }

  private buildEraEntries(
    era: EraDefinition,
    events: ValidatorEvent[],
    sinceBlock: number,
    untilBlock: number | undefined,
    eraIndex: number,
  ): DaTrackingEntry[] {
    if (era.sequencers !== undefined) {
      if (era.sequencers.length === 0) {
        throw new Error(
          `Era ${eraIndex} (inbox ${era.inbox}) has an empty sequencers override`,
        )
      }
      if (era.sinceBlock === undefined) {
        throw new Error(
          `Era ${eraIndex} (inbox ${era.inbox}) has a sequencers override and requires an explicit sinceBlock`,
        )
      }
      return [
        {
          inbox: era.inbox,
          sequencers: sortAddresses(era.sequencers),
          sinceBlock,
          untilBlock,
        },
      ]
    }

    // Replay events chronologically, starting a new entry at every block
    // where the active validator set changes (split-per-rotation).
    const active = new Set<string>()
    for (const event of events) {
      if (event.blockNumber > sinceBlock) {
        break
      }
      applyEvent(active, event)
    }

    const entries: DaTrackingEntry[] = []
    let currentSet = [...active]
    let currentSince = sinceBlock

    const boundaryBlocks = [
      ...new Set(
        events
          .map((e) => e.blockNumber)
          .filter(
            (b) =>
              b > sinceBlock && (untilBlock === undefined || b <= untilBlock),
          ),
      ),
    ]

    for (const block of boundaryBlocks) {
      for (const event of events) {
        if (event.blockNumber === block) {
          applyEvent(active, event)
        }
      }
      const newSet = [...active]
      if (sameSet(currentSet, newSet)) {
        continue
      }
      if (currentSet.length > 0) {
        entries.push({
          inbox: era.inbox,
          sequencers: sortAddresses(currentSet),
          sinceBlock: currentSince,
          untilBlock: block,
        })
      }
      currentSet = newSet
      currentSince = block
    }

    if (currentSet.length > 0) {
      entries.push({
        inbox: era.inbox,
        sequencers: sortAddresses(currentSet),
        sinceBlock: currentSince,
        untilBlock,
      })
    }

    if (entries.length === 0) {
      throw new Error(
        `Era ${eraIndex} (inbox ${era.inbox}) resolved to no entries with a non-empty validator set`,
      )
    }

    return entries
  }
}

function applyEvent(active: Set<string>, event: ValidatorEvent): void {
  if (event.added) {
    active.add(event.validator)
  } else {
    active.delete(event.validator)
  }
}

function sortAddresses(addresses: string[]): string[] {
  return [...addresses].sort((a, b) => {
    const la = a.toLowerCase()
    const lb = b.toLowerCase()
    return la < lb ? -1 : la > lb ? 1 : 0
  })
}

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false
  }
  const setA = new Set(a)
  return b.every((x) => setA.has(x))
}

/**
 * Two separate block ranges can resolve to the same (inbox, sequencer set) -
 * e.g. when a validator is added and later removed again. The backend id is a
 * hash of exactly those identity fields, so such entries must be merged into
 * one to avoid duplicate configuration ids. The merged range may span blocks
 * where the set was different - that is harmless, matching also filters by
 * inbox and sequencers.
 */
function coalesceSameIdentity(entries: DaTrackingEntry[]): DaTrackingEntry[] {
  const byIdentity = new Map<string, DaTrackingEntry>()
  for (const entry of entries) {
    const key = `${entry.inbox}|${entry.sequencers.join(',')}`
    const existing = byIdentity.get(key)
    if (existing === undefined) {
      byIdentity.set(key, { ...entry })
      continue
    }
    existing.sinceBlock = Math.min(existing.sinceBlock, entry.sinceBlock)
    if (existing.untilBlock !== undefined) {
      existing.untilBlock =
        entry.untilBlock === undefined
          ? undefined
          : Math.max(existing.untilBlock, entry.untilBlock)
    }
  }
  return [...byIdentity.values()]
}
