import type { LiveActivitySecondRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { seededRandom } from '~/utils/seededRandom'
import type { HeartbeatSource } from './getHeartbeat'

/** Seconds, from Arbitrum's to Ethereum's */
const BLOCK_TIMES = [0.25, 1, 1, 2, 2, 2, 2, 5, 12] as const
/** Transactions per second span about this many powers of ten */
const TPS_DECADES = 2.5
/** Of the chains, the share whose blocks come minutes late, as through a lagging RPC */
const LATE_ONE_IN = 10
const LATE_BY = 150
/** Gas of a simple transaction, and of a block on top */
const GAS_PER_TX = 90_000
const GAS_PER_BLOCK = 40_000

interface MockChain {
  projectId: ProjectId
  blockTime: number
  /** Of the chain's first block, in seconds */
  phase: number
  tps: number
  lag: number
}

/**
 * Seconds follow the real clock, but what each holds follows from the chain
 * and the second alone, so every run sees the same blocks without a database
 */
export function createMockHeartbeatSource(
  projectIds: Promise<string[]>,
  now = () => UnixTime.now(),
): HeartbeatSource {
  const chains = projectIds.then((ids) => ids.map(mockChain))
  return {
    async getSecondsSince(since) {
      const rows: LiveActivitySecondRecord[] = []
      const last = now()
      for (let second = since + 1; second <= last; second++) {
        for (const chain of await chains) {
          if (second > last - chain.lag) continue
          const row = mockSecond(chain, second)
          if (row) rows.push(row)
        }
      }
      return rows
    },
  }
}

function mockChain(projectId: string): MockChain {
  const random = seededRandom(hashOf(projectId))
  const blockTime =
    BLOCK_TIMES[Math.floor(random() * BLOCK_TIMES.length)] ?? BLOCK_TIMES[0]
  return {
    projectId: ProjectId(projectId),
    blockTime,
    phase: Math.floor(random() * Math.max(blockTime, 1)),
    tps: 10 ** (random() * TPS_DECADES - 0.5),
    lag: Math.floor(random() * LATE_ONE_IN) === 0 ? LATE_BY : 12,
  }
}

function mockSecond(
  chain: MockChain,
  second: UnixTime,
): LiveActivitySecondRecord | undefined {
  const blockTime = Math.max(chain.blockTime, 1)
  if ((second - chain.phase) % blockTime !== 0) return undefined
  const random = seededRandom(hashOf(chain.projectId) ^ second)
  // a slow swell, so the traces and the ranking move
  const swell = 1 + 0.4 * Math.sin((2 * Math.PI * second) / 47 + chain.phase)
  const count = Math.round(chain.tps * blockTime * swell * (0.5 + random()))
  const blocks = Math.round(1 / Math.min(chain.blockTime, 1))
  return {
    projectId: chain.projectId,
    timestamp: second,
    blocks,
    count,
    uopsCount: Math.round(count * (1 + random() * 0.2)),
    gasUsed: count * GAS_PER_TX + blocks * GAS_PER_BLOCK,
  }
}

/** FNV-1a */
function hashOf(text: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash = Math.imul(hash ^ text.charCodeAt(i), 0x01000193)
  }
  return hash >>> 0
}
