import type {
  ProjectDaTrackingConfig,
  SovereignProjectDaTrackingConfig,
} from '@l2beat/config'
import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'

/**
 * The project a blob transaction belongs to, if any. Told as of `blockNumber`;
 * without one, as of now
 */
export type Attribute = (
  to: string,
  from: string,
  blockNumber?: number,
) => string | undefined

/**
 * Tells whose a blob transaction is the way the backend does
 * (`matchEthereumProject`): by the inbox it is sent to and, where the inbox is
 * shared, by who sent it. Event topics, its third way, need receipts that a
 * block does not carry, so projects told apart only by events go unattributed.
 *
 * Addresses are compared lowercase.
 */
export function createAttribute(senders: BlobSender[]): Attribute {
  const sendersByInbox = Map.groupBy(senders, (sender) => sender.inbox)
  return (to, from, blockNumber) => {
    const candidates = (sendersByInbox.get(to) ?? []).filter((s) =>
      inForceAt(s, blockNumber),
    )
    // a sequencer named is a closer match than an inbox open to anyone
    const match =
      candidates.find((s) => s.sequencers.includes(from)) ??
      candidates.find((s) => s.sequencers.length === 0)
    return match?.projectId
  }
}

/**
 * A sender that has ended holds for the blocks up to `untilBlock`, one that
 * has not for every block from `sinceBlock` on, and for what is still to come
 */
function inForceAt(sender: BlobSender, blockNumber: number | undefined) {
  if (blockNumber === undefined) return sender.untilBlock === undefined
  return (
    sender.sinceBlock <= blockNumber &&
    (sender.untilBlock === undefined || blockNumber <= sender.untilBlock)
  )
}

/**
 * A blob transaction sent to `inbox` is the project's, provided it comes from
 * one of `sequencers`. Without sequencers the inbox alone says whose it is.
 * Projects change inboxes and sequencers: each pair holds for a span of
 * blocks, both ends included, as the backend's `DaIndexer` tracks it
 */
export interface BlobSender {
  projectId: string
  inbox: string
  sequencers: string[]
  sinceBlock: number
  untilBlock?: number
}

/**
 * The blob senders of every project posting to Ethereum, past ones included:
 * the rollups, and the sovereign chains Ethereum's own config tracks
 */
export async function getBlobSenders(): Promise<BlobSender[]> {
  const [projects, sovereign] = await Promise.all([
    ps.getProjects({
      select: ['daTrackingConfig'],
      whereNot: ['archivedAt'],
    }),
    getSovereignProjects(),
  ])
  return [...projects, ...sovereign].flatMap((p) =>
    toBlobSenders(p.id, p.daTrackingConfig),
  )
}

/** Chains posting to Ethereum that are not projects of their own, as the backend's DA indexer tracks them */
export async function getSovereignProjects() {
  const ethereum = await ps.getProject({
    id: ProjectId.ETHEREUM,
    select: ['daLayer'],
  })
  return (ethereum?.daLayer.sovereignProjectsTrackingConfig ?? []).map((p) => ({
    id: p.projectId,
    name: p.name,
    daTrackingConfig: p.daTrackingConfig,
  }))
}

/** The senders of a project's Ethereum blob transactions; an inbox and its sequencers for every span of blocks */
export function toBlobSenders(
  projectId: string,
  configs: SenderConfig[],
): BlobSender[] {
  return configs.flatMap((c) =>
    // Projects tracked by event alone have no inbox to tell them by
    c.type === 'ethereum' &&
    (!('daLayer' in c) || c.daLayer === ProjectId.ETHEREUM) &&
    c.inbox !== EthereumAddress.ZERO
      ? [
          {
            projectId,
            inbox: c.inbox.toLowerCase(),
            sequencers: (c.sequencers ?? []).map((s) => s.toLowerCase()),
            sinceBlock: c.sinceBlock,
            untilBlock: c.untilBlock,
          },
        ]
      : [],
  )
}

/** A project's DA tracking config; a sovereign chain's names no `daLayer`, Ethereum's being implied */
type SenderConfig =
  | ProjectDaTrackingConfig
  | SovereignProjectDaTrackingConfig['daTrackingConfig'][number]
