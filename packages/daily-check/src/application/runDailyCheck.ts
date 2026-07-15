import { Logger } from '@l2beat/backend-tools'
import { ClaudeCodeClient } from '../clients/ClaudeCodeClient'
import { DiscordClient } from '../clients/DiscordClient'
import { ElasticSearchClient } from '../clients/ElasticSearchClient'
import { KibanaClient } from '../clients/KibanaClient'
import type { Config } from '../config'
import { loadControlPlane } from '../dashboard/loadControlPlane'
import type { SkippedTile } from '../dashboard/types'
import { evaluateTile } from '../evaluation/evaluateTile'
import type { TileResult } from '../evaluation/types'
import { investigate } from '../investigation/investigate'
import { formatSummary } from '../reporting/formatSummary'

const logger = Logger.INFO.for('DailyCheck')

export async function runDailyCheck(
  config: Config,
  dryRun: boolean,
): Promise<void> {
  const kibana = new KibanaClient(config.kibanaUrl, config.kibanaApiKey)
  const es = new ElasticSearchClient(
    config.elasticsearchUrl,
    config.elasticsearchApiKey,
  )
  const discord = config.discordWebhookUrl
    ? new DiscordClient(config.discordWebhookUrl)
    : undefined
  const send = async (content: string): Promise<void> => {
    if (dryRun || !discord) {
      console.log(`\n${content}\n`)
      return
    }
    await discord.sendMessage(content)
  }

  logger.info('Loading dashboard', { id: config.dashboardId })
  const controlPlane = await loadControlPlane(kibana, config.dashboardId)

  const results: TileResult[] = []
  const skipped: SkippedTile[] = [...controlPlane.skipped]
  for (const tile of controlPlane.tiles) {
    try {
      results.push(await evaluateTile(es, tile))
    } catch (error) {
      skipped.push({
        title: tile.title,
        section: tile.section,
        reason: error instanceof Error ? error.message : String(error),
      })
    }
  }

  const red = results.filter((result) => result.status === 'red')
  logger.info('Checks evaluated', {
    tiles: results.length,
    red: red.length,
    amber: results.filter((result) => result.status === 'amber').length,
    skipped: skipped.length,
  })

  await send(
    formatSummary(
      controlPlane.title,
      controlPlane.timeFrom,
      controlPlane.timeTo,
      controlPlane.controls,
      results,
      skipped,
    ),
  )

  if (red.length === 0) {
    return
  }

  logger.info('Investigating red tiles', { count: red.length })
  try {
    const claude = new ClaudeCodeClient(config.model)
    const report = await investigate(claude, red, controlPlane.controls)
    await send(`🔍 **Investigation**\n${report}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    logger.error('Investigation failed', { error })
    await send(`🔍 AI investigation failed: ${message}`)
  }
}
