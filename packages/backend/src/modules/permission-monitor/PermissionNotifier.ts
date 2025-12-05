import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import {
  type Channel,
  type DiscordClient,
} from '../../peripherals/discord/DiscordClient'

export class PermissionNotifier {
  constructor(
    private readonly db: Database,
    private readonly discordClient: DiscordClient | undefined,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  /**
   * Send notification about permission changes for a project
   */
  async notifyPermissionChanges(
    projectId: string,
    timestamp: UnixTime,
  ): Promise<void> {
    const changes = await this.db.updateDiff.getByProjectAndType(
      projectId,
      'permissionChange',
    )

    if (changes.length === 0) {
      return
    }

    const messages: string[] = []
    const allErrors: string[] = []

    messages.push(`🔒 **Permission Changes Detected: ${projectId}**`)
    messages.push(`Timestamp: ${UnixTime.toDate(timestamp).toISOString()}`)
    messages.push('')

    for (const change of changes) {
      const details = change.details as {
        functionName: string
        changes: {
          addedOwners: Array<{ address: string; name: string }>
          removedOwners: Array<{ address: string; name: string }>
        }
        resolutionErrors: string[]
      }

      messages.push(
        `**Contract:** \`${change.address}\` - Function: \`${details.functionName}\``,
      )

      if (details.changes.addedOwners.length > 0) {
        messages.push('  ✅ **Added owners:**')
        for (const owner of details.changes.addedOwners) {
          messages.push(`    - \`${owner.address}\` (${owner.name})`)
        }
      }

      if (details.changes.removedOwners.length > 0) {
        messages.push('  ❌ **Removed owners:**')
        for (const owner of details.changes.removedOwners) {
          messages.push(`    - \`${owner.address}\` (${owner.name})`)
        }
      }

      messages.push('')

      // Collect resolution errors
      if (details.resolutionErrors && details.resolutionErrors.length > 0) {
        allErrors.push(...details.resolutionErrors)
      }
    }

    // Add errors at the end if any
    if (allErrors.length > 0) {
      messages.push('⚠️ **Resolution Errors:**')
      for (const error of allErrors) {
        messages.push(`  - ${error}`)
      }
    }

    const message = messages.join('\n')
    await this.notify(message, 'INTERNAL')
    this.logger.info('Permission change notification sent', {
      projectId,
      changeCount: changes.length,
    })
  }

  private async notify(message: string, channelType: Channel): Promise<void> {
    if (!this.discordClient) {
      this.logger.info(
        'DiscordClient not setup, notification has not been sent. Did you provide correct .env variables?',
      )
      return
    }

    await this.discordClient.sendMessage(message, channelType)
  }
}
