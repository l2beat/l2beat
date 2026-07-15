import { getEnv } from '@l2beat/backend-tools'

export interface Config {
  kibanaUrl: string
  kibanaApiKey: string
  elasticsearchUrl: string
  elasticsearchApiKey: string
  /** Required unless running with --dry-run. */
  discordWebhookUrl: string | undefined
  dashboardId: string
  /** Model passed to `claude -p` for the AI investigation of red tiles. */
  model: string
  /** Local time of day (HH:MM) for the daemon run; TZ controls the zone. */
  runAt: string
  port: number
}

export function getConfig(): Config {
  const env = getEnv()
  return {
    kibanaUrl: stripTrailingSlash(env.string('KIBANA_URL')),
    kibanaApiKey: env.string('KIBANA_API_KEY'),
    elasticsearchUrl: env.string('ELASTICSEARCH_URL'),
    elasticsearchApiKey: env.string('ELASTICSEARCH_API_KEY'),
    discordWebhookUrl: env.optionalString('DISCORD_WEBHOOK_URL'),
    dashboardId: env.string('DAILY_CHECK_DASHBOARD_ID'),
    model: env.string('DAILY_CHECK_MODEL', 'opus'),
    runAt: env.string('DAILY_CHECK_RUN_AT', '09:00'),
    port: env.integer('PORT', 3000),
  }
}

function stripTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url
}
