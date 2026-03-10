import type { Logger } from '@l2beat/backend-tools'
import { DISCORD_MAX_MESSAGE_LENGTH } from '@l2beat/shared'
import { Retries } from '@l2beat/shared-pure'
import { TaskQueue } from '../../../../tools/queue/TaskQueue'
import type { DiscordWebhookClient } from '../../../anomalies/clients/DiscordWebhookClient'
import {
  diffInteropConfig,
  type InteropConfigDiff,
  interopConfigDiffToMarkdown,
  removeMutedInteropConfigDiffEntries,
} from '../config/InteropConfigDiff'

const MAX_ENTRIES_IN_MESSAGE = 200

export class InteropNotifier {
  private readonly messageQueue: TaskQueue<string>

  constructor(
    private readonly client: DiscordWebhookClient,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
    this.messageQueue = new TaskQueue(
      async (message) => {
        await this.send(message)
      },
      this.logger.for('messageQueue'),
      {
        workers: 1,
        shouldRetry: Retries.exponentialBackOff({
          stepMs: 1000,
          maxAttempts: 5,
          maxDistanceMs: 60_000,
          notifyAfterAttempts: 3,
        }),
        shouldStopAfterFailedRetries: false,
        metricsId: InteropNotifier.name,
      },
    )
  }

  handleConfigChange(key: string, previous: unknown, current: unknown): void {
    const diff = diffInteropConfig(key, previous, current)
    const filteredDiff = removeMutedInteropConfigDiffEntries(diff)

    if (filteredDiff.entries.length === 0) {
      return
    }

    this.notifyConfigDiff(filteredDiff)
  }

  private notifyConfigDiff(diff: InteropConfigDiff): void {
    const header = `⚙️ **${diff.key}** config change - (\`${diff.entries.length}\` diff entries)`
    const markdown = interopConfigDiffToMarkdown(diff, MAX_ENTRIES_IN_MESSAGE)
    const message = `${header}\n\n${markdown}`

    this.messageQueue.addToBack(message)
  }

  private async send(message: string): Promise<void> {
    const truncated = this.truncate(message)
    await this.client.sendMessage(truncated)
    this.logger.debug('Notification sent', { message: truncated })
  }

  private truncate(input: string): string {
    if (input.length <= DISCORD_MAX_MESSAGE_LENGTH) {
      return input
    }
    const suffix = '\n...(truncated)'
    return input.slice(0, DISCORD_MAX_MESSAGE_LENGTH - suffix.length) + suffix
  }

  /**
   * WARNING: this method should be used only in tests
   */
  _TEST_ONLY_waitTillEmpty(): Promise<void> {
    return this.messageQueue.waitTillEmpty()
  }
}
