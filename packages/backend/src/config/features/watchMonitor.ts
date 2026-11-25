import type { Env } from '@l2beat/backend-tools'
import {
  getDiscoveryPaths,
  WATCH_TEMPLATES,
  WatchReader,
} from '@l2beat/discovery'
import type { WatchMonitorConfig } from '../Config'
import type { FeatureFlags } from '../FeatureFlags'

export function getWatchMonitorConfig(
  env: Env,
  flags: FeatureFlags,
  isLocal: boolean | undefined,
): WatchMonitorConfig {
  const paths = getDiscoveryPaths()
  const watchReader = new WatchReader(paths, WATCH_TEMPLATES)
  const disabledWatches = watchReader
    .readAllWatches()
    .map((watch) => watch.name)
    .filter((name) => !flags.isEnabled('watchMonitor', 'watch', name))

  return {
    paths,
    watchReader,
    runOnStart: isLocal
      ? env.boolean('WATCH_MONITOR_RUN_ON_START', true)
      : undefined,
    disabledWatches,
    githubToken: env.optionalString('GITHUB_TOKEN'),
    publicGithubToken: env.optionalString('WATCH_PUBLIC_GITHUB_TOKEN'),
    discordWebhookUrl: env.optionalString(
      'NOTIFICATIONS_WATCH_MONITOR_DISCORD_WEBHOOK_URL',
    ),
    workerPool: {
      workerCount: env.integer(['WATCH_MONITOR_WORKER_POOL_COUNT'], 3),
      timeoutPerTaskMs: env.integer(
        ['WATCH_MONITOR_WORKER_POOL_TIMEOUT_PER_TASK_MS'],
        2 * 60 * 1000,
      ),
      timeoutPerRunMs: env.integer(
        ['WATCH_MONITOR_WORKER_POOL_TIMEOUT_PER_RUN_MS'],
        30 * 60 * 1000,
      ),
    },
  }
}
