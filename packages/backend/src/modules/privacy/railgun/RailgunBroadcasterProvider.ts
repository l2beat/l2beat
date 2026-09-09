import type { Logger } from '@l2beat/backend-tools'
import { setTimeout as sleep } from 'timers/promises'
import { isEligibleFeeAd, parseRailgunFeeAd } from './parseRailgunFeeMessage'

// Railgun's own Waku fleet, which has migrated clusters before. If
// broadcasters go silent, check constants.ts in
// https://github.com/Railgun-Community/waku-broadcaster-client
const RAILGUN_WAKU_NETWORK = {
  clusterId: 5,
  shard: 1,
  bootstrapPeers: [
    '/dns4/relay-a.rootedinprivacy.com/tcp/8000/wss/p2p/16Uiu2HAmFbD2ZvAFi2j9jjDo6g4HFbQAhfjDfnTTrbyRGQRmtG7x',
    '/dns4/relay-b.rootedinprivacy.com/tcp/8000/wss/p2p/16Uiu2HAmPtEAoPPok7VLrpNNC6t92ZQFqLndHvkdx6Fk3CxA4MaG',
    '/dns4/client-edge.rootedinprivacy.com/tcp/8000/wss/p2p/16Uiu2HAmQdCGG5qREQCq96kucmpUVupmvLwrTRjMazPAaMTNP97A',
  ],
}

const CONNECT_TIMEOUT_MS = 120_000

function railgunFeesContentTopic(chainId: number): string {
  // 0 is the Railgun EVM chain type, the only one in use.
  return `/railgun/v2/0-${chainId}-fees/json`
}

export interface RailgunObservationResult {
  uniqueRelayers: number
  messagesReceived: number
  messagesParsed: number
  messagesAccepted: number
}

export interface RailgunObserveOptions {
  chainIds: number[]
  durationMs: number
}

// `@waku/sdk` is ESM - only, so it is loaded dynamically from this CJS build.
export class RailgunBroadcasterProvider {
  constructor(private readonly logger: Logger) {
    this.logger = logger.for(this)
  }

  async observe(
    options: RailgunObserveOptions,
  ): Promise<Map<number, RailgunObservationResult>> {
    const chainIds = Array.from(new Set(options.chainIds))
    const { durationMs } = options
    if (chainIds.length === 0) return new Map()

    // js-waku is ESM-only, hence the dynamic import from this CJS build
    const { createLightNode, createDecoder, utils, Protocols } = await import(
      '@waku/sdk'
    )

    const networkConfig = { clusterId: RAILGUN_WAKU_NETWORK.clusterId }

    this.logger.info('Connecting to the Railgun Waku network', {
      chainIds,
      durationMs,
    })

    const node = await createLightNode({
      networkConfig,
      defaultBootstrap: false,
      bootstrapPeers: RAILGUN_WAKU_NETWORK.bootstrapPeers,
      discovery: { dns: false, peerExchange: true, peerCache: false },
    })

    try {
      await node.waitForPeers([Protocols.Filter], CONNECT_TIMEOUT_MS)

      const routingInfo = utils.StaticShardingRoutingInfo.fromShard(
        RAILGUN_WAKU_NETWORK.shard,
        networkConfig,
      )
      const observations = new Map(
        chainIds.map((chainId) => [
          chainId,
          {
            seen: new Set<string>(),
            messagesReceived: 0,
            messagesParsed: 0,
            messagesAccepted: 0,
          },
        ]),
      )

      await Promise.all(
        chainIds.map(async (chainId) => {
          const observation = observations.get(chainId)
          if (!observation) throw new Error('Missing observation state')

          const decoder = createDecoder(
            railgunFeesContentTopic(chainId),
            routingInfo,
          )
          const subscribed = await node.filter.subscribe(decoder, (message) => {
            observation.messagesReceived++
            const ad = parseRailgunFeeAd(message.payload)
            if (!ad) return

            observation.messagesParsed++
            if (!isEligibleFeeAd(ad, Date.now())) return

            observation.messagesAccepted++
            observation.seen.add(ad.railgunAddress.toLowerCase())
          })
          if (!subscribed) {
            throw new Error(
              `Failed to subscribe to the Railgun fees topic for chainId ${chainId}`,
            )
          }
        }),
      )

      await sleep(durationMs)

      const result = new Map<number, RailgunObservationResult>()
      for (const [chainId, observation] of observations) {
        const chainResult = {
          uniqueRelayers: observation.seen.size,
          messagesReceived: observation.messagesReceived,
          messagesParsed: observation.messagesParsed,
          messagesAccepted: observation.messagesAccepted,
        }
        result.set(chainId, chainResult)
        this.logger.info('Finished Railgun broadcaster observation', {
          chainId,
          ...chainResult,
        })
      }
      return result
    } finally {
      await node.stop().catch((error) => {
        this.logger.error('Failed to stop the Waku node', error)
      })
    }
  }
}
