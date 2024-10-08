import { LogFormatterPretty, Logger } from '@l2beat/backend-tools'
import { createDatabase } from '@l2beat/database'
import { env } from './env.js'
import { setupCanonicalQueues } from './queues/canonical.js'
import { setupDeploymentQueues } from './queues/deployment.js'
import { setupIndependentQueues } from './queues/independent.js'
import { setupOnChainMetadataQueues } from './queues/on-chain.js'
import { connection } from './redis/redis.js'
import { getNetworksConfig } from './utils/get-networks-config.js'
import { startQueueDashboard } from './utils/queue/dashboard.js'
import { eventRouter } from './utils/queue/router/index.js'
import { byTokenChainId } from './utils/queue/router/routing-key-rules.js'
import { setupQueue } from './utils/queue/setup-queue.js'
import { setupTokenMetaAggregatorQueue } from './queues/token-meta-aggregator.js'

const db = createDatabase({
  connectionString: env.DATABASE_URL,
})

const logger = new Logger({
  transports: [
    {
      formatter: new LogFormatterPretty(),
      transport: console,
    },
  ],
})

const networksConfig = await getNetworksConfig({
  db,
  logger,
})

const router = eventRouter({
  connection,
  logger,
})

const queue = setupQueue({ connection })

const deps = {
  db,
  logger,
  connection,
  networksConfig,
}

const canonical = await setupCanonicalQueues(deps)
const deployment = await setupDeploymentQueues(deps)
const independent = await setupIndependentQueues(deps)
const onChainMetadata = await setupOnChainMetadataQueues(deps)
const tokenMetaAggregator = await setupTokenMetaAggregatorQueue(deps)

// When token deployment is updated, route the event to the canonical processors since these are dependent on the deployment data
const deploymentToCanonicalRoutingWorker = router.routingKey({
  from: deployment.update.inbox,
  to: [
    // Ditch the rest
    {
      queue: canonical.arbitrum.collector.queue,
      routingKey: 42161,
    },
    {
      queue: canonical.optimism.collector.queue,
      routingKey: 10,
    },
    {
      queue: canonical.zkSync.collector.queue,
      routingKey: 324,
    },
    // Also notify about new canonical token deployments
    {
      queue: [
        canonical.arbitrum.collector.queue,
        canonical.optimism.collector.queue,
        canonical.zkSync.collector.queue,
      ],
      routingKey: 1,
    },
  ],
  extractRoutingKey: byTokenChainId({ db }),
})

// Input signal, might be removed
const refreshInbox = queue({
  name: 'Refresh.Inbox',
})

const independentSources = Object.values(independent.sources).flat()

// Input signal, might be removed
const refreshBroadcastWorker = router.broadcast({
  from: refreshInbox,
  to: independentSources.map((q) => q.queue),
})

// Broadcast the token update events to the dependent sources to dependant sources
const independentBroadcastWorker = router.broadcast({
  from: independent.inbox,
  to: [
    deployment.routing.inbox,
    onChainMetadata.routing.inbox,
    tokenMetaAggregator.inbox,
  ],
})

// #region BullBoard

const dashboardLogger = logger.for('QueueDashboard')

if (env.QUEUE_DASHBOARD_PORT) {
  const allQueues = [
    refreshInbox,

    // Independent
    independent.inbox,
    independentSources.map((q) => q.queue),

    // Deployment
    deployment.routing.inbox,
    deployment.update.inbox,
    deployment.buses.map((b) => b.queue),

    // TokenMetaAggregator
    tokenMetaAggregator.inbox,

    // Canonical
    canonical.arbitrum.collector.queue,
    canonical.arbitrum.processor.queue,
    canonical.optimism.collector.queue,
    canonical.optimism.processor.queue,
    canonical.zkSync.collector.queue,
    canonical.zkSync.processor.queue,

    // Onchain
    onChainMetadata.routing.inbox,
    onChainMetadata.buses.map((b) => b.collector.queue),
    onChainMetadata.buses.map((b) => b.processor.queue),
  ].flat()

  await startQueueDashboard({
    port: env.QUEUE_DASHBOARD_PORT,
    logger: dashboardLogger,
    queues: allQueues,
    signalQueue: refreshInbox,
  })
} else {
  dashboardLogger.warn('Queue dashboard is disabled')
}
// #endregion BullBoard

// Start all the workers
await Promise.all([
  refreshBroadcastWorker.run(),
  independentBroadcastWorker.run(),
  deploymentToCanonicalRoutingWorker.run(),

  independent.start(),
  canonical.start(),
  deployment.start(),
  onChainMetadata.start(),
])
