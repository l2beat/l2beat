import { Logger } from '@l2beat/backend-tools'
import type { ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import type { DiscoveryDiff } from '@l2beat/discovery'
import {
  EthereumAddress,
  formatAsAsciiTable,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import {
  type DiscordClient,
  MAX_MESSAGE_LENGTH,
} from '../../peripherals/discord/DiscordClient'
import type { UpdateMessagesService } from './UpdateMessagesService'
import {
  type DailyReminderChainEntry,
  generateTemplatizedStatus,
  UpdateNotifier,
} from './UpdateNotifier'

const TIMESTAMP = UnixTime.now()

describe(UpdateNotifier.name, () => {
  const projectService = mockObject<ProjectService>({
    getProject: mockFn().resolvesTo(undefined),
  })

  describe(UpdateNotifier.prototype.handleUpdate.name, () => {
    it('sends notifications about the changes', async () => {
      const discordClient = mockObject<DiscordClient>({
        sendMessage: async () => {},
      })

      const updateNotifierRepository = mockObject<Database['updateNotifier']>({
        insert: async () => 0,
        findLatestId: async () => undefined,
        getNewerThan: async () => [],
      })
      updateNotifierRepository.findLatestId.resolvesToOnce(undefined)
      updateNotifierRepository.findLatestId.resolvesToOnce(0)

      const updateMessagesService = mockObject<UpdateMessagesService>({
        storeAndPrune: async () => {},
      })

      const updateNotifier = new UpdateNotifier(
        mockObject<Database>({
          updateNotifier: updateNotifierRepository,
        }),
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        projectService,
        [],
      )

      const project = 'project-a'
      const dependents: string[] = []
      const address = EthereumAddress.random()
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

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(2)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        [
          `Changes: ***project-a*** at timestamp ${TIMESTAMP}\`\`\`diff`,
          `    contract Contract (${address.toString()}) {`,
          '    +++ description: None',
          '      A:',
          '-        1',
          '+        2',
          '    }',
          '```',
        ].join('\n'),
        'INTERNAL',
      )
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        2,
        [
          '***project-a*** | detected changes```diff',
          `    contract Contract (${address.toString()}) {`,
          '    +++ description: None',
          '      A:',
          '-        1',
          '+        2',
          '    }',
          '```',
        ].join('\n'),
        'PUBLIC',
      )
      expect(updateNotifierRepository.insert).toHaveBeenCalledTimes(1)
      expect(updateNotifierRepository.insert).toHaveBeenCalledWith({
        projectId: project,
        diff: changes,
        timestamp: TIMESTAMP,
      })
    })

    it('sends notifications about the changes with meta', async () => {
      const discordClient = mockObject<DiscordClient>({
        sendMessage: async () => {},
      })

      const updateMessagesService = mockObject<UpdateMessagesService>({
        storeAndPrune: async () => {},
      })

      const updateNotifierRepository = mockObject<Database['updateNotifier']>({
        insert: async () => 0,
        findLatestId: async () => undefined,
        getNewerThan: async () => [],
      })
      updateNotifierRepository.findLatestId.resolvesToOnce(undefined)
      updateNotifierRepository.findLatestId.resolvesToOnce(0)

      const updateNotifier = new UpdateNotifier(
        mockObject<Database>({
          updateNotifier: updateNotifierRepository,
        }),
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        projectService,
        [],
      )

      const project = 'project-a'
      const dependents: string[] = []
      const address = EthereumAddress.random()
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

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(2)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        [
          `Changes: ***project-a*** at timestamp ${TIMESTAMP}\`\`\`diff`,
          `    contract Contract (${address.toString()}) {`,
          '    +++ description: None',
          '+++ description: This should never be equal to two',
          '+++ severity: LOW',
          '      A:',
          '-        1',
          '+        2',
          '    }',
          '```',
        ].join('\n'),
        'INTERNAL',
      )
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        2,
        [
          '***project-a*** | detected changes```diff',
          `    contract Contract (${address.toString()}) {`,
          '    +++ description: None',
          '+++ description: This should never be equal to two',
          '+++ severity: LOW',
          '      A:',
          '-        1',
          '+        2',
          '    }',
          '```',
        ].join('\n'),
        'PUBLIC',
      )
      expect(updateNotifierRepository.insert).toHaveBeenCalledTimes(1)
      expect(updateNotifierRepository.insert).toHaveBeenCalledWith({
        projectId: project,
        diff: changes,
        timestamp: TIMESTAMP,
      })
    })

    it('truncates and sends notifications about the changes', async () => {
      const discordClient = mockObject<DiscordClient>({
        sendMessage: async () => {},
      })

      const updateMessagesService = mockObject<UpdateMessagesService>({
        storeAndPrune: async () => {},
      })

      const updateNotifierRepository = mockObject<Database['updateNotifier']>({
        insert: async () => 0,
        findLatestId: async () => undefined,
        getNewerThan: async () => [],
      })
      updateNotifierRepository.findLatestId.resolvesToOnce(undefined)
      updateNotifierRepository.findLatestId.resolvesToOnce(0)

      const updateNotifier = new UpdateNotifier(
        mockObject<Database>({
          updateNotifier: updateNotifierRepository,
        }),
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        projectService,
        [],
      )

      const project = 'project-a'
      const dependents: string[] = []
      const address = EthereumAddress.random()
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
        `    contract Contract (${address.toString()}) {`,
        '    +++ description: None',
        '      A:',
        `-        ${'A'.repeat(1000)}`,
        `+        ${'B'.repeat(795)}... (message too long)`,
        '```',
      ].join('\n')

      const publicMessage = [
        '***project-a*** | detected changes```diff',
        `    contract Contract (${address.toString()}) {`,
        '    +++ description: None',
        '      A:',
        `-        ${'A'.repeat(1000)}`,
        `+        ${'B'.repeat(809)}... (message too long)`,
        '```',
      ].join('\n')

      expect(internalMessage.length).toBeLessThanOrEqual(MAX_MESSAGE_LENGTH)
      expect(publicMessage.length).toBeLessThanOrEqual(MAX_MESSAGE_LENGTH)
      expect(discordClient.sendMessage).toHaveBeenCalledTimes(2)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        internalMessage,
        'INTERNAL',
      )
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        2,
        publicMessage,
        'PUBLIC',
      )
      expect(updateNotifierRepository.insert).toHaveBeenCalledTimes(1)
      expect(updateNotifierRepository.insert).toHaveBeenCalledWith({
        projectId: project,
        diff: changes,
        timestamp: TIMESTAMP,
      })
    })

    it('sends errors only to internal channel', async () => {
      const discordClient = mockObject<DiscordClient>({
        sendMessage: async () => {},
      })

      const updateMessagesService = mockObject<UpdateMessagesService>({
        storeAndPrune: async () => {},
      })

      const updateNotifierRepository = mockObject<Database['updateNotifier']>({
        insert: async () => 0,
        findLatestId: async () => 0,
        getNewerThan: async () => [],
      })
      updateNotifierRepository.findLatestId.resolvesToOnce(undefined)

      const updateNotifier = new UpdateNotifier(
        mockObject<Database>({
          updateNotifier: updateNotifierRepository,
        }),
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        projectService,
        [],
      )

      const project = 'project-a'
      const dependents: string[] = []
      const address = EthereumAddress.random()
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
          `    contract Contract (${address.toString()}) {`,
          '    +++ description: None',
          '      errors:',
          '+        Execution reverted',
          '    }',
          '```',
        ].join('\n'),
        'INTERNAL',
      )
      expect(updateNotifierRepository.insert).toHaveBeenCalledTimes(1)
      expect(updateNotifierRepository.insert).toHaveBeenCalledWith({
        projectId: project,
        diff: changes,
        timestamp: TIMESTAMP,
      })
    })

    it('sends notification about tracked transactions being affected', async () => {
      const discordClient = mockObject<DiscordClient>({
        sendMessage: async () => {},
      })

      const updateNotifierRepository = mockObject<Database['updateNotifier']>({
        insert: async () => 0,
        findLatestId: async () => undefined,
        getNewerThan: async () => [],
      })
      updateNotifierRepository.findLatestId.resolvesToOnce(undefined)
      updateNotifierRepository.findLatestId.resolvesToOnce(0)

      const updateMessagesService = mockObject<UpdateMessagesService>({
        storeAndPrune: async () => {},
      })

      // Mock project with trackedTxsConfig
      const mockProject = {
        id: ProjectId('project-a'),
        trackedTxsConfig: [
          {
            params: {
              formula: 'functionCall',
              address: EthereumAddress(
                '0x1234567890123456789012345678901234567890',
              ),
              selector: '0x12345678',
            },
          },
        ],
      }
      const mockProjectService = mockObject<ProjectService>({
        getProject: mockFn().resolvesTo(mockProject),
      })

      const updateNotifier = new UpdateNotifier(
        mockObject<Database>({
          updateNotifier: updateNotifierRepository,
        }),
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        mockProjectService,
        [],
      )

      const project = 'project-a'
      const dependents: string[] = []
      const address = EthereumAddress(
        '0x1234567890123456789012345678901234567890',
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

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(2)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        [
          `Changes: ***project-a*** at timestamp ${TIMESTAMP}`,
          '*Tracked transactions might be affected.*```diff',
          `    contract Contract (${address.toString()}) {`,
          '    +++ description: None',
          '      A:',
          '-        1',
          '+        2',
          '    }',
          '```',
        ].join('\n'),
        'INTERNAL',
      )
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        2,
        [
          '***project-a*** | detected changes```diff',
          `    contract Contract (${address.toString()}) {`,
          '    +++ description: None',
          '      A:',
          '-        1',
          '+        2',
          '    }',
          '```',
        ].join('\n'),
        'PUBLIC',
      )
    })

    it('does not include tracked transactions message when contract is not in trackedTxsConfig', async () => {
      const discordClient = mockObject<DiscordClient>({
        sendMessage: async () => {},
      })

      const updateNotifierRepository = mockObject<Database['updateNotifier']>({
        insert: async () => 0,
        findLatestId: async () => undefined,
        getNewerThan: async () => [],
      })
      updateNotifierRepository.findLatestId.resolvesToOnce(undefined)
      updateNotifierRepository.findLatestId.resolvesToOnce(0)

      const updateMessagesService = mockObject<UpdateMessagesService>({
        storeAndPrune: async () => {},
      })

      // Mock project with trackedTxsConfig that has a different address
      const mockProject = {
        id: ProjectId('project-a'),
        trackedTxsConfig: [
          {
            params: {
              formula: 'functionCall',
              address: EthereumAddress(
                '0x9999999999999999999999999999999999999999',
              ),
              selector: '0x12345678',
            },
          },
        ],
      }
      const mockProjectService = mockObject<ProjectService>({
        getProject: mockFn().resolvesTo(mockProject),
      })

      const updateNotifier = new UpdateNotifier(
        mockObject<Database>({
          updateNotifier: updateNotifierRepository,
        }),
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        mockProjectService,
        [],
      )

      const project = 'project-a'
      const dependents: string[] = []
      const address = EthereumAddress(
        '0x1234567890123456789012345678901234567890',
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

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(2)
      // Verify message doesn't contain tracked transactions notification
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        [
          `Changes: ***project-a*** at timestamp ${TIMESTAMP}\`\`\`diff`,
          `    contract Contract (${address.toString()}) {`,
          '    +++ description: None',
          '      A:',
          '-        1',
          '+        2',
          '    }',
          '```',
        ].join('\n'),
        'INTERNAL',
      )
    })
  })

  describe(UpdateNotifier.prototype.sendDailyReminder.name, () => {
    it('sends daily reminder at 9am CET', async () => {
      const updateNotifierRepository = mockObject<Database['updateNotifier']>({
        insert: async () => 0,
      })

      const updateMessagesService = mockObject<UpdateMessagesService>({
        storeAndPrune: async () => {},
      })

      const discordClient = mockObject<DiscordClient>({
        sendMessage: async () => {},
      })

      const updateNotifier = new UpdateNotifier(
        mockObject<Database>({ updateNotifier: updateNotifierRepository }),
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        projectService,
        [],
      )

      const reminders = {
        ['project-a']: { severityCounts: { low: 1, high: 2, unknown: 4 } },
        ['project-b']: { severityCounts: { low: 0, high: 0, unknown: 12 } },
        ['project-c']: { severityCounts: { low: 0, high: 3, unknown: 0 } },
        ['project-d']: { severityCounts: { low: 0, high: 3, unknown: 4 } },
      }
      const timestamp = UnixTime.toStartOf(TIMESTAMP, 'day') + 6 * UnixTime.HOUR
      const headers = ['Project', 'High', 'Low', '???']
      const rows = [
        ['project-d', '3', '', '4'],
        ['project-c', '3', '', ''],
        ['project-a', '2', '1', '4'],
        ['project-b', '', '', '12'],
      ]
      const table = formatAsAsciiTable(headers, rows)
      const templatizationStatus = await generateTemplatizedStatus()

      await updateNotifier.sendDailyReminder(reminders, timestamp)

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        `# Daily bot report @ ${UnixTime.toYYYYMMDD(timestamp)}\n${templatizationStatus}\n:x: Detected changes with following severities :x:\n\`\`\`\n${table}\n\`\`\`\n`,
        'INTERNAL',
      )
    })

    it('truncates daily reminder', async () => {
      const randomReminder = (): DailyReminderChainEntry => ({
        severityCounts: { low: 0, high: 0, unknown: 0 },
      })

      const updateMessagesService = mockObject<UpdateMessagesService>({
        storeAndPrune: async () => {},
      })

      const updateNotifierRepository = mockObject<Database['updateNotifier']>({
        insert: async () => 0,
      })

      const discordClient = mockObject<DiscordClient>({
        sendMessage: async (msg: string) => {
          expect(msg.length <= MAX_MESSAGE_LENGTH)
        },
      })

      const updateNotifier = new UpdateNotifier(
        mockObject<Database>({ updateNotifier: updateNotifierRepository }),
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        projectService,
        [],
      )

      const reminders = {
        ['project-a']: randomReminder(),
        ['project-b']: randomReminder(),
        ['project-c']: randomReminder(),
      }
      const timestamp =
        UnixTime.toStartOf(UnixTime.now(), 'day') + 6 * UnixTime.HOUR

      await updateNotifier.sendDailyReminder(reminders, timestamp)

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
    })

    it('does not send daily reminder at other hour', async () => {
      const discordClient = mockObject<DiscordClient>({
        sendMessage: async () => {},
      })
      const updateNotifierRepository = mockObject<Database['updateNotifier']>({
        insert: async () => 0,
        findLatestId: async () => undefined,
      })
      const updateMessagesService = mockObject<UpdateMessagesService>({
        storeAndPrune: async () => {},
      })
      const updateNotifier = new UpdateNotifier(
        mockObject<Database>({ updateNotifier: updateNotifierRepository }),
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        projectService,
        [],
      )

      const reminders = {}
      const timestamp =
        UnixTime.toStartOf(UnixTime.now(), 'day') + 1 * UnixTime.HOUR

      await updateNotifier.sendDailyReminder(reminders, timestamp)

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(0)
    })

    it('includes disabled chains in daily reminder', async () => {
      const discordClient = mockObject<DiscordClient>({
        sendMessage: async () => {},
      })
      const updateNotifierRepository = mockObject<Database['updateNotifier']>({
        insert: async () => 0,
        findLatestId: async () => undefined,
      })
      const updateMessagesService = mockObject<UpdateMessagesService>({
        storeAndPrune: async () => {},
      })
      const disabledChains = ['optimism', 'arbitrum']
      const updateNotifier = new UpdateNotifier(
        mockObject<Database>({ updateNotifier: updateNotifierRepository }),
        discordClient,
        Logger.SILENT,
        updateMessagesService,
        projectService,
        disabledChains,
      )

      const reminders = {}
      const timestamp =
        UnixTime.toStartOf(UnixTime.now(), 'day') + 6 * UnixTime.HOUR

      await updateNotifier.sendDailyReminder(reminders, timestamp)

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      const message = discordClient.sendMessage.calls[0]?.args[0] as string
      expect(message).toInclude(
        ':warning: Disabled chains: `optimism`, `arbitrum`',
      )
    })
  })
})
