import { getEnv } from '@l2beat/backend-tools'

export interface Config {
  kibanaUrl: string
  kibanaApiKey: string
  elasticsearchUrl: string
  elasticsearchApiKey: string
  /** Required unless running with --dry-run. */
  discordWebhookUrl: string | undefined
  dashboardId: string
  /** AI CLI used for the investigation of red tiles. */
  agent: 'claude' | 'codex'
  /** Model passed to the selected AI CLI. */
  model: string
  /** Local time of day (HH:MM) for the daemon run; TZ controls the zone. */
  runAt: string
  port: number
}

export function getConfig(): Config {
  const env = getEnv()
  const { agent, model } = parseDailyCheckModel(
    env.string('DAILY_CHECK_MODEL', 'claude:opus'),
  )
  return {
    kibanaUrl: stripTrailingSlash(env.string('KIBANA_URL')),
    kibanaApiKey: env.string('KIBANA_API_KEY'),
    elasticsearchUrl: env.string('ELASTICSEARCH_URL'),
    elasticsearchApiKey: env.string('ELASTICSEARCH_API_KEY'),
    discordWebhookUrl: env.optionalString('DISCORD_WEBHOOK_URL'),
    dashboardId: env.string('DAILY_CHECK_DASHBOARD_ID'),
    agent,
    model,
    runAt: env.string('DAILY_CHECK_RUN_AT', '09:00'),
    port: env.integer('PORT', 3000),
  }
}

export function parseDailyCheckModel(
  value: string,
): Pick<Config, 'agent' | 'model'> {
  const separator = value.indexOf(':')
  if (separator <= 0 || separator === value.length - 1) {
    throw new Error(
      'DAILY_CHECK_MODEL must use the format "<agent>:<model>", for example "claude:opus" or "codex:gpt-5.6-sol"',
    )
  }

  const agent = value.slice(0, separator)
  const model = value.slice(separator + 1)
  if (agent !== 'claude' && agent !== 'codex') {
    throw new Error(
      `Unsupported DAILY_CHECK_MODEL agent "${agent}". Expected "claude" or "codex"`,
    )
  }

  return { agent, model }
}

function stripTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url
}
