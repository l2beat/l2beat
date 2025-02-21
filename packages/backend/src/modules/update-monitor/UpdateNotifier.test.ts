import { Logger } from '@l2beat/backend-tools'
import type { DiscoveryDiff } from '@l2beat/discovery'
import {
  ChainConverter,
  ChainId,
  EthereumAddress,
  UnixTime,
  formatAsAsciiTable,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import type { Database } from '@l2beat/database'
import {
  type DiscordClient,
  MAX_MESSAGE_LENGTH,
} from '../../peripherals/discord/DiscordClient'
import type { UpdateMessagesService } from './UpdateMessagesService'
import {
  type DailyReminderChainEntry,
  UpdateNotifier,
  generateTemplatizedStatus,
} from './UpdateNotifier'

const BLOCK = 123

describe(UpdateNotifier.name, () => {
  const chainConverter = new ChainConverter([
    { name: 'ethereum', chainId: ChainId.ETHEREUM },
    { name: 'arbitrum', chainId: ChainId.ARBITRUM },
  ])

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
        chainConverter,
        Logger.SILENT,
        updateMessagesService,
      )

      const project = 'project-a'
      const dependents: string[] = []
      const address = EthereumAddress.random()
      const changes: DiscoveryDiff[] = [
        {
          name: 'Contract',
          address,
          diff: [{ key: 'A', before: '1', after: '2' }],
        },
      ]

      await updateNotifier.handleUpdate(
        project,
        changes,
        BLOCK,
        ChainId.ETHEREUM,
        dependents,
        [],
        UnixTime.now(),
      )

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(2)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        [
          '> #0000 (block_number=123)',
          '',
          '***project-a*** | detected changes on chain: ***ethereum***```diff',
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
          '***project-a*** | detected changes on chain: ***ethereum***```diff',
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
        projectName: project,
        diff: changes,
        blockNumber: BLOCK,
        chainId: ChainId.ETHEREUM,
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
        chainConverter,
        Logger.SILENT,
        updateMessagesService,
      )

      const project = 'project-a'
      const dependents: string[] = []
      const address = EthereumAddress.random()
      const changes: DiscoveryDiff[] = [
        {
          name: 'Contract',
          address,
          diff: [
            {
              key: 'A',
              before: '1',
              after: '2',
              severity: 'MEDIUM',
              description: 'This should never be equal to two',
            },
          ],
        },
      ]

      await updateNotifier.handleUpdate(
        project,
        changes,
        BLOCK,
        ChainId.ETHEREUM,
        dependents,
        [],
        UnixTime.now(),
      )

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(2)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        [
          '> #0000 (block_number=123)',
          '',
          '***project-a*** | detected changes on chain: ***ethereum***```diff',
          `    contract Contract (${address.toString()}) {`,
          '    +++ description: None',
          '+++ description: This should never be equal to two',
          '+++ severity: MEDIUM',
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
          '***project-a*** | detected changes on chain: ***ethereum***```diff',
          `    contract Contract (${address.toString()}) {`,
          '    +++ description: None',
          '+++ description: This should never be equal to two',
          '+++ severity: MEDIUM',
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
        projectName: project,
        diff: changes,
        blockNumber: BLOCK,
        chainId: ChainId.ETHEREUM,
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
        chainConverter,
        Logger.SILENT,
        updateMessagesService,
      )

      const project = 'project-a'
      const dependents: string[] = []
      const address = EthereumAddress.random()
      const changes: DiscoveryDiff[] = [
        {
          name: 'Contract',
          address,
          diff: [
            { key: 'A', before: 'A'.repeat(1000), after: 'B'.repeat(1000) },
          ],
        },
      ]

      await updateNotifier.handleUpdate(
        project,
        changes,
        BLOCK,
        ChainId.ETHEREUM,
        dependents,
        [],
        UnixTime.now(),
      )

      const internalMessage = [
        '> #0000 (block_number=123)',
        '',
        '***project-a*** | detected changes on chain: ***ethereum***```diff',
        `    contract Contract (${address.toString()}) {`,
        '    +++ description: None',
        '      A:',
        `-        ${'A'.repeat(1000)}`,
        `+        ${'B'.repeat(756)}... (message too long)`,
        '```',
      ].join('\n')

      const publicMessage = [
        '***project-a*** | detected changes on chain: ***ethereum***```diff',
        `    contract Contract (${address.toString()}) {`,
        '    +++ description: None',
        '      A:',
        `-        ${'A'.repeat(1000)}`,
        `+        ${'B'.repeat(784)}... (message too long)`,
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
        projectName: project,
        diff: changes,
        blockNumber: BLOCK,
        chainId: ChainId.ETHEREUM,
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
        chainConverter,
        Logger.SILENT,
        updateMessagesService,
      )

      const project = 'project-a'
      const dependents: string[] = []
      const address = EthereumAddress.random()
      const changes: DiscoveryDiff[] = [
        {
          name: 'Contract',
          address,
          diff: [{ key: 'errors', after: 'Execution reverted' }],
        },
      ]

      await updateNotifier.handleUpdate(
        project,
        changes,
        BLOCK,
        ChainId.ETHEREUM,
        dependents,
        [],
        UnixTime.now(),
      )

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        [
          '> #0000 (block_number=123)',
          '',
          '***project-a*** | detected changes on chain: ***ethereum***```diff',
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
        projectName: project,
        diff: changes,
        blockNumber: BLOCK,
        chainId: ChainId.ETHEREUM,
      })
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
        chainConverter,
        Logger.SILENT,
        updateMessagesService,
      )

      const reminders = {
        ['project-a']: [
          {
            chainName: 'ethereum',
            severityCounts: {
              low: 1,
              medium: 0,
              high: 2,
              unknown: 4,
            },
          },
          {
            chainName: 'arbitrum',
            severityCounts: {
              low: 0,
              medium: 0,
              high: 0,
              unknown: 12,
            },
          },
        ],
        ['project-b']: [
          {
            chainName: 'ethereum',
            severityCounts: {
              low: 0,
              medium: 2,
              high: 3,
              unknown: 0,
            },
          },
          {
            chainName: 'optimism',
            severityCounts: {
              low: 0,
              medium: 0,
              high: 3,
              unknown: 4,
            },
          },
        ],
      }
      const timestamp = UnixTime.now().toStartOf('day').add(6, 'hours')
      const headers = ['Project', 'Chain', 'High', 'Mid', 'Low', '???']
      const rows = [
        ['project-b', 'ethereum', '3', '2', '', ''],
        ['project-b', 'optimism', '3', '', '', '4'],
        ['project-a', 'ethereum', '2', '', '1', '4'],
        ['project-a', 'arbitrum', '', '', '', '12'],
      ]
      const table = formatAsAsciiTable(headers, rows)
      const templatizationStatus = generateTemplatizedStatus()

      await updateNotifier.sendDailyReminder(reminders, timestamp)

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        `# Daily bot report @ ${timestamp.toYYYYMMDD()}\n${templatizationStatus}\n:x: Detected changes with following severities :x:\n\`\`\`\n${table}\n\`\`\`\n`,
        'INTERNAL',
      )
    })

    it('truncates daily reminder', async () => {
      const randomReminder = (chain: string): DailyReminderChainEntry => ({
        chainName: chain,
        severityCounts: {
          low: 0,
          medium: 0,
          high: 0,
          unknown: 0,
        },
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
        chainConverter,
        Logger.SILENT,
        updateMessagesService,
      )

      const reminders = {
        ['project-a']: [
          randomReminder('ethereum'),
          randomReminder('arbitrum'),
          randomReminder('steelchain'),
          randomReminder('aluminiumchain'),
          randomReminder('copperchain'),
          randomReminder('chainwhip'),
        ],
        ['project-b']: [
          randomReminder('ethereum'),
          randomReminder('optimism'),
          randomReminder(
            'verylongchainnametobumpupthebytecountthatgoesforeverandeverandomgcanyoumakeitalittlesmallerpleaseeeee',
          ),
        ],
        ['project-c']: [
          randomReminder('steelchain'),
          randomReminder('aluminiumchain'),
          randomReminder('copperchain'),
          randomReminder('chainwhip'),
        ],
      }
      const timestamp = UnixTime.now().toStartOf('day').add(6, 'hours')

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
        chainConverter,
        Logger.SILENT,
        updateMessagesService,
      )

      const reminders = {}
      const timestamp = UnixTime.now().toStartOf('day').add(1, 'hours')

      await updateNotifier.sendDailyReminder(reminders, timestamp)

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(0)
    })
  })
})
