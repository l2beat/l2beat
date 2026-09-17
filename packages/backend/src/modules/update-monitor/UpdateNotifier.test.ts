import { Logger } from '@l2beat/backend-tools'
import type { ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import type { DiscoveryDiff } from '@l2beat/discovery'
import { DISCORD_MAX_MESSAGE_LENGTH, type DiscordClient } from '@l2beat/shared'
import {
  ChainSpecificAddress,
  formatAsAsciiTable,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type { UpdateMessagesService } from './UpdateMessagesService'
import {
  type DailyReminderChainEntry,
  generateTemplatizedStatus,
  UpdateNotifier,
} from './UpdateNotifier'

const TIMESTAMP = UnixTime.now()

describe(UpdateNotifier.name, () => {
  const projectService = {
    getProject: vi.fn().mockResolvedValue(undefined),
  } as unknown as ProjectService

  describe(UpdateNotifier.prototype.handleUpdate.name, () => {
    it('sends notifications about the changes', async () => {
      const discordClient = {
        sendMessage: vi.fn(async () => 'message-id'),
      } as unknown as DiscordClient

      const updateNotifierRepository = {
        insert: vi.fn(async () => 0),
        findLatestId: vi.fn(async () => undefined),
        getNewerThan: vi.fn(async () => []),
      } as unknown as Database['updateNotifier']
      vi.mocked(updateNotifierRepository.findLatestId).mockResolvedValueOnce(
        undefined,
      )
      vi.mocked(updateNotifierRepository.findLatestId).mockResolvedValueOnce(0)

      const updateMessagesService = {
        storeAndPrune: vi.fn(async () => {}),
      } as unknown as UpdateMessagesService

      const updateNotifier = new UpdateNotifier(
        {
          updateNotifier: updateNotifierRepository,
        } as unknown as Database,
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        projectService,
      )

      const project = 'project-a'
      const dependents: string[] = []
      const address = ChainSpecificAddress.random()
      const changes: DiscoveryDiff[] = [
        {
          name: 'Contract',
          address,
          addressType: 'Contract',
          diff: [{ key: 'A', before: '1', after: '2' }],
        },
      ]

      await updateNotifier.handleUpdate(
        project,
        changes,
        dependents,
        [],
        TIMESTAMP,
      )

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        [
          `Changes: ***project-a*** at timestamp ${TIMESTAMP}\`\`\`diff`,
          `    contract Contract (${address.toString()}) [N/A] {`,
          '    +++ description: None',
          '      A:',
          '-        1',
          '+        2',
          '    }',
          '```',
        ].join('\n'),
      )
      expect(updateNotifierRepository.insert).toHaveBeenCalledTimes(1)
      expect(updateNotifierRepository.insert).toHaveBeenCalledWith({
        projectId: project,
        diff: changes,
        timestamp: TIMESTAMP,
      })
    })

    it('sends notifications about the changes with meta', async () => {
      const discordClient = {
        sendMessage: vi.fn(async () => 'message-id'),
      } as unknown as DiscordClient

      const updateMessagesService = {
        storeAndPrune: vi.fn(async () => {}),
      } as unknown as UpdateMessagesService

      const updateNotifierRepository = {
        insert: vi.fn(async () => 0),
        findLatestId: vi.fn(async () => undefined),
        getNewerThan: vi.fn(async () => []),
      } as unknown as Database['updateNotifier']
      vi.mocked(updateNotifierRepository.findLatestId).mockResolvedValueOnce(
        undefined,
      )
      vi.mocked(updateNotifierRepository.findLatestId).mockResolvedValueOnce(0)

      const updateNotifier = new UpdateNotifier(
        {
          updateNotifier: updateNotifierRepository,
        } as unknown as Database,
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        projectService,
      )

      const project = 'project-a'
      const dependents: string[] = []
      const address = ChainSpecificAddress.random()
      const changes: DiscoveryDiff[] = [
        {
          name: 'Contract',
          address,
          addressType: 'Contract',
          diff: [
            {
              key: 'A',
              before: '1',
              after: '2',
              severity: 'LOW',
              description: 'This should never be equal to two',
            },
          ],
        },
      ]

      await updateNotifier.handleUpdate(
        project,
        changes,
        dependents,
        [],
        TIMESTAMP,
      )

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        [
          `Changes: ***project-a*** at timestamp ${TIMESTAMP}\`\`\`diff`,
          `    contract Contract (${address.toString()}) [N/A] {`,
          '    +++ description: None',
          '+++ description: This should never be equal to two',
          '+++ severity: LOW',
          '      A:',
          '-        1',
          '+        2',
          '    }',
          '```',
        ].join('\n'),
      )
      expect(updateNotifierRepository.insert).toHaveBeenCalledTimes(1)
      expect(updateNotifierRepository.insert).toHaveBeenCalledWith({
        projectId: project,
        diff: changes,
        timestamp: TIMESTAMP,
      })
    })

    it('truncates and sends notifications about the changes', async () => {
      const discordClient = {
        sendMessage: vi.fn(async () => 'message-id'),
      } as unknown as DiscordClient

      const updateMessagesService = {
        storeAndPrune: vi.fn(async () => {}),
      } as unknown as UpdateMessagesService

      const updateNotifierRepository = {
        insert: vi.fn(async () => 0),
        findLatestId: vi.fn(async () => undefined),
        getNewerThan: vi.fn(async () => []),
      } as unknown as Database['updateNotifier']
      vi.mocked(updateNotifierRepository.findLatestId).mockResolvedValueOnce(
        undefined,
      )
      vi.mocked(updateNotifierRepository.findLatestId).mockResolvedValueOnce(0)

      const updateNotifier = new UpdateNotifier(
        {
          updateNotifier: updateNotifierRepository,
        } as unknown as Database,
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        projectService,
      )

      const project = 'project-a'
      const dependents: string[] = []
      const address = ChainSpecificAddress.random()
      const changes: DiscoveryDiff[] = [
        {
          name: 'Contract',
          address,
          addressType: 'Contract',
          diff: [
            { key: 'A', before: 'A'.repeat(1000), after: 'B'.repeat(1000) },
          ],
        },
      ]

      await updateNotifier.handleUpdate(
        project,
        changes,
        dependents,
        [],
        TIMESTAMP,
      )

      const internalMessage = [
        `Changes: ***project-a*** at timestamp ${TIMESTAMP}\`\`\`diff`,
        `    contract Contract (${address.toString()}) [N/A] {`,
        '    +++ description: None',
        '      A:',
        `-        ${'A'.repeat(1000)}`,
        `+        ${'B'.repeat(785)}... (message too long)`,
        '```',
      ].join('\n')

      expect(internalMessage.length).toBeLessThanOrEqual(
        DISCORD_MAX_MESSAGE_LENGTH,
      )
      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        internalMessage,
      )
      expect(updateNotifierRepository.insert).toHaveBeenCalledTimes(1)
      expect(updateNotifierRepository.insert).toHaveBeenCalledWith({
        projectId: project,
        diff: changes,
        timestamp: TIMESTAMP,
      })
    })

    it('sends errors only to internal channel', async () => {
      const discordClient = {
        sendMessage: vi.fn(async () => 'message-id'),
      } as unknown as DiscordClient

      const updateMessagesService = {
        storeAndPrune: vi.fn(async () => {}),
      } as unknown as UpdateMessagesService

      const updateNotifierRepository = {
        insert: vi.fn(async () => 0),
        findLatestId: vi.fn(async () => 0),
        getNewerThan: vi.fn(async () => []),
      } as unknown as Database['updateNotifier']
      vi.mocked(updateNotifierRepository.findLatestId).mockResolvedValueOnce(
        undefined,
      )

      const updateNotifier = new UpdateNotifier(
        {
          updateNotifier: updateNotifierRepository,
        } as unknown as Database,
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        projectService,
      )

      const project = 'project-a'
      const dependents: string[] = []
      const address = ChainSpecificAddress.random()
      const changes: DiscoveryDiff[] = [
        {
          name: 'Contract',
          address,
          addressType: 'Contract',
          diff: [{ key: 'errors', after: 'Execution reverted' }],
        },
      ]

      await updateNotifier.handleUpdate(
        project,
        changes,
        dependents,
        [],
        TIMESTAMP,
      )

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        [
          `Changes: ***project-a*** at timestamp ${TIMESTAMP}\`\`\`diff`,
          `    contract Contract (${address.toString()}) [N/A] {`,
          '    +++ description: None',
          '      errors:',
          '+        Execution reverted',
          '    }',
          '```',
        ].join('\n'),
      )
      expect(updateNotifierRepository.insert).toHaveBeenCalledTimes(1)
      expect(updateNotifierRepository.insert).toHaveBeenCalledWith({
        projectId: project,
        diff: changes,
        timestamp: TIMESTAMP,
      })
    })

    it('sends notification about tracked transactions being affected', async () => {
      const discordClient = {
        sendMessage: vi.fn(async () => 'message-id'),
      } as unknown as DiscordClient

      const updateNotifierRepository = {
        insert: vi.fn(async () => 0),
        findLatestId: vi.fn(async () => undefined),
        getNewerThan: vi.fn(async () => []),
      } as unknown as Database['updateNotifier']
      vi.mocked(updateNotifierRepository.findLatestId).mockResolvedValueOnce(
        undefined,
      )
      vi.mocked(updateNotifierRepository.findLatestId).mockResolvedValueOnce(0)

      const updateMessagesService = {
        storeAndPrune: vi.fn(async () => {}),
      } as unknown as UpdateMessagesService

      // Mock project with trackedTxsConfig
      const mockProject = {
        id: ProjectId('project-a'),
        trackedTxsConfig: [
          {
            params: {
              formula: 'functionCall',
              address: ChainSpecificAddress(
                'eth:0x1234567890123456789012345678901234567890',
              ),
              selector: '0x12345678',
            },
          },
        ],
      }
      const mockProjectService = {
        getProject: vi.fn().mockResolvedValue(mockProject),
      } as unknown as ProjectService

      const updateNotifier = new UpdateNotifier(
        {
          updateNotifier: updateNotifierRepository,
        } as unknown as Database,
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        mockProjectService,
      )

      const project = 'project-a'
      const dependents: string[] = []
      const address = ChainSpecificAddress(
        'eth:0x1234567890123456789012345678901234567890',
      ) // Same address as in trackedTxsConfig
      const changes: DiscoveryDiff[] = [
        {
          name: 'Contract',
          address,
          addressType: 'Contract',
          diff: [{ key: 'A', before: '1', after: '2' }],
        },
      ]

      await updateNotifier.handleUpdate(
        project,
        changes,
        dependents,
        [],
        TIMESTAMP,
      )

      expect(mockProjectService.getProject).toHaveBeenCalledWith({
        id: ProjectId('project-a'),
        select: ['trackedTxsConfig'],
      })

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        [
          `Changes: ***project-a*** at timestamp ${TIMESTAMP}`,
          '*Tracked transactions might be affected.*```diff',
          `    contract Contract (${address.toString()}) [N/A] {`,
          '    +++ description: None',
          '      A:',
          '-        1',
          '+        2',
          '    }',
          '```',
        ].join('\n'),
      )
    })

    it('does not include tracked transactions message when contract is not in trackedTxsConfig', async () => {
      const discordClient = {
        sendMessage: vi.fn(async () => 'message-id'),
      } as unknown as DiscordClient

      const updateNotifierRepository = {
        insert: vi.fn(async () => 0),
        findLatestId: vi.fn(async () => undefined),
        getNewerThan: vi.fn(async () => []),
      } as unknown as Database['updateNotifier']
      vi.mocked(updateNotifierRepository.findLatestId).mockResolvedValueOnce(
        undefined,
      )
      vi.mocked(updateNotifierRepository.findLatestId).mockResolvedValueOnce(0)

      const updateMessagesService = {
        storeAndPrune: vi.fn(async () => {}),
      } as unknown as UpdateMessagesService

      // Mock project with trackedTxsConfig that has a different address
      const mockProject = {
        id: ProjectId('project-a'),
        trackedTxsConfig: [
          {
            params: {
              formula: 'functionCall',
              address: ChainSpecificAddress(
                'eth:0x9999999999999999999999999999999999999999',
              ),
              selector: '0x12345678',
            },
          },
        ],
      }
      const mockProjectService = {
        getProject: vi.fn().mockResolvedValue(mockProject),
      } as unknown as ProjectService

      const updateNotifier = new UpdateNotifier(
        {
          updateNotifier: updateNotifierRepository,
        } as unknown as Database,
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        mockProjectService,
      )

      const project = 'project-a'
      const dependents: string[] = []
      const address = ChainSpecificAddress(
        'eth:0x1234567890123456789012345678901234567890',
      ) // Different from trackedTxsConfig
      const changes: DiscoveryDiff[] = [
        {
          name: 'Contract',
          address,
          addressType: 'Contract',
          diff: [{ key: 'A', before: '1', after: '2' }],
        },
      ]

      await updateNotifier.handleUpdate(
        project,
        changes,
        dependents,
        [],
        TIMESTAMP,
      )

      expect(mockProjectService.getProject).toHaveBeenCalledWith({
        id: ProjectId('project-a'),
        select: ['trackedTxsConfig'],
      })

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      // Verify message doesn't contain tracked transactions notification
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        [
          `Changes: ***project-a*** at timestamp ${TIMESTAMP}\`\`\`diff`,
          `    contract Contract (${address.toString()}) [N/A] {`,
          '    +++ description: None',
          '      A:',
          '-        1',
          '+        2',
          '    }',
          '```',
        ].join('\n'),
      )
    })
  })

  describe(UpdateNotifier.prototype.sendDailyReminder.name, () => {
    it('sends daily reminder at 9am CET', async () => {
      const updateNotifierRepository = {
        insert: vi.fn(async () => 0),
      } as unknown as Database['updateNotifier']

      const updateMessagesService = {
        storeAndPrune: vi.fn(async () => {}),
      } as unknown as UpdateMessagesService

      const discordClient = {
        sendMessage: vi.fn(async () => 'message-id'),
      } as unknown as DiscordClient

      const updateNotifier = new UpdateNotifier(
        { updateNotifier: updateNotifierRepository } as unknown as Database,
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        projectService,
      )

      const reminders = {
        ['project-a']: {
          severityCounts: { low: 1, medium: 0, high: 2, unknown: 4 },
        },
        ['project-b']: {
          severityCounts: { low: 0, medium: 0, high: 0, unknown: 12 },
        },
        ['project-c']: {
          severityCounts: { low: 0, medium: 0, high: 3, unknown: 0 },
        },
        ['project-d']: {
          severityCounts: { low: 0, medium: 0, high: 3, unknown: 4 },
        },
      }
      const timestamp = UnixTime.toStartOf(TIMESTAMP, 'day') + 6 * UnixTime.HOUR
      const headers = ['Project', 'High', 'Mid', 'Low', '???']
      const rows = [
        ['project-d', '3', '', '', '4'],
        ['project-c', '3', '', '', ''],
        ['project-a', '2', '', '1', '4'],
        ['project-b', '', '', '', '12'],
      ]
      const table = formatAsAsciiTable(headers, rows)
      const templatizationStatus = await generateTemplatizedStatus()

      await updateNotifier.sendDailyReminder(
        reminders,
        timestamp,
        ['project-aaa'],
        ['project-bbb'],
      )

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        `# Daily bot report @ ${UnixTime.toYYYYMMDD(timestamp)}\n:warning: Disabled projects: \`project-aaa\`\n:warning: Failed projects: \`project-bbb\`\n${templatizationStatus}\n:x: Detected changes with following severities :x:\n\`\`\`\n${table}\n\`\`\`\n`,
      )
    })

    it('truncates daily reminder', async () => {
      const randomReminder = (): DailyReminderChainEntry => ({
        severityCounts: { low: 0, medium: 0, high: 0, unknown: 0 },
      })

      const updateMessagesService = {
        storeAndPrune: vi.fn(async () => {}),
      } as unknown as UpdateMessagesService

      const updateNotifierRepository = {
        insert: vi.fn(async () => 0),
      } as unknown as Database['updateNotifier']

      const discordClient = {
        sendMessage: vi.fn(async (msg: string) => {
          expect(msg.length <= DISCORD_MAX_MESSAGE_LENGTH)
          return 'message-id'
        }),
      } as unknown as DiscordClient

      const updateNotifier = new UpdateNotifier(
        { updateNotifier: updateNotifierRepository } as unknown as Database,
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        projectService,
      )

      const reminders = {
        ['project-a']: randomReminder(),
        ['project-b']: randomReminder(),
        ['project-c']: randomReminder(),
      }
      const timestamp =
        UnixTime.toStartOf(UnixTime.now(), 'day') + 6 * UnixTime.HOUR

      await updateNotifier.sendDailyReminder(
        reminders,
        timestamp,
        ['project-aaa'],
        ['project-bbb'],
      )

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
    })

    it('does not send daily reminder at other hour', async () => {
      const discordClient = {
        sendMessage: vi.fn(async () => 'message-id'),
      } as unknown as DiscordClient
      const updateNotifierRepository = {
        insert: vi.fn(async () => 0),
        findLatestId: vi.fn(async () => undefined),
      } as unknown as Database['updateNotifier']
      const updateMessagesService = {
        storeAndPrune: vi.fn(async () => {}),
      } as unknown as UpdateMessagesService
      const updateNotifier = new UpdateNotifier(
        { updateNotifier: updateNotifierRepository } as unknown as Database,
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        projectService,
      )

      const reminders = {}
      const timestamp =
        UnixTime.toStartOf(UnixTime.now(), 'day') + 1 * UnixTime.HOUR

      await updateNotifier.sendDailyReminder(
        reminders,
        timestamp,
        ['project-aaa'],
        ['project-bbb'],
      )

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(0)
    })

    it('includes disabled projects and failed projects in daily reminder', async () => {
      const discordClient = {
        sendMessage: vi.fn(async () => 'message-id'),
      } as unknown as DiscordClient
      const updateNotifierRepository = {
        insert: vi.fn(async () => 0),
        findLatestId: vi.fn(async () => undefined),
      } as unknown as Database['updateNotifier']
      const updateMessagesService = {
        storeAndPrune: vi.fn(async () => {}),
      } as unknown as UpdateMessagesService
      const updateNotifier = new UpdateNotifier(
        { updateNotifier: updateNotifierRepository } as unknown as Database,
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        projectService,
      )

      const reminders = {}
      const timestamp =
        UnixTime.toStartOf(UnixTime.now(), 'day') + 6 * UnixTime.HOUR

      await updateNotifier.sendDailyReminder(
        reminders,
        timestamp,
        ['project-aaa'],
        ['project-bbb'],
      )

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      const message = vi.mocked(discordClient.sendMessage).mock
        .calls[0][0] as string
      expect(message).toContain(':warning: Disabled projects: `project-aaa`')
      expect(message).toContain(':warning: Failed projects: `project-bbb`')
    })
  })
})
