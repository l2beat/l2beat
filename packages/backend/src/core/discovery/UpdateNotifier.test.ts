import { Logger } from '@l2beat/backend-tools'
import { DiscoveryDiff } from '@l2beat/discovery'
import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { UpdateNotifierRepository } from '../../peripherals/database/discovery/UpdateNotifierRepository'
import {
  DiscordClient,
  MAX_MESSAGE_LENGTH,
} from '../../peripherals/discord/DiscordClient'
import { UpdateNotifier } from './UpdateNotifier'

const BLOCK = 123

describe(UpdateNotifier.name, () => {
  describe(UpdateNotifier.prototype.handleUpdate.name, () => {
    it('sends notifications about the changes', async () => {
      const discordClient = mockObject<DiscordClient>({
        sendMessage: async () => {},
      })

      const updateNotifierRepository = mockObject<UpdateNotifierRepository>({
        add: async () => 0,
        findLatestId: async () => undefined,
        getNewerThan: async () => [],
      })
      updateNotifierRepository.findLatestId.resolvesToOnce(undefined)
      updateNotifierRepository.findLatestId.resolvesToOnce(0)

      const updateNotifier = new UpdateNotifier(
        updateNotifierRepository,
        discordClient,
        Logger.SILENT,
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

      await updateNotifier.handleUpdate(project, changes, {
        dependents,
        blockNumber: BLOCK,
        unknownContracts: [],
        chainId: ChainId.ETHEREUM,
      })

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(2)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        '> #0000 (block_number=123)\n\n***project-a*** | detected changes on chain: ***ethereum***```diff\nContract | ' +
          address.toString() +
          '\n\nA\n- 1\n+ 2\n\n```',
        'INTERNAL',
      )
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        2,
        '***project-a*** | detected changes on chain: ***ethereum***```diff\nContract | ' +
          address.toString() +
          '\n\nA\n- 1\n+ 2\n\n```',
        'PUBLIC',
      )
      expect(updateNotifierRepository.add).toHaveBeenCalledTimes(1)
      expect(updateNotifierRepository.add).toHaveBeenCalledWith({
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

      const updateNotifierRepository = mockObject<UpdateNotifierRepository>({
        add: async () => 0,
        findLatestId: async () => undefined,
        getNewerThan: async () => [],
      })
      updateNotifierRepository.findLatestId.resolvesToOnce(undefined)
      updateNotifierRepository.findLatestId.resolvesToOnce(0)

      const updateNotifier = new UpdateNotifier(
        updateNotifierRepository,
        discordClient,
        Logger.SILENT,
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

      await updateNotifier.handleUpdate(project, changes, {
        dependents,
        blockNumber: BLOCK,
        unknownContracts: [],
        chainId: ChainId.ETHEREUM,
      })

      const internalMsg =
        `> #0000 (block_number=${BLOCK})\n\n` +
        `***project-a*** | detected changes on chain: ***ethereum***\`\`\`diff\nContract | ${address.toString()}` +
        '\n\nWarning: Message has been truncated\nA\n' +
        `- ${'A'.repeat(1000)}\n` +
        `+ ${'B'.repeat(800)}...\n\`\`\``

      const publicMsg =
        `***project-a*** | detected changes on chain: ***ethereum***\`\`\`diff\nContract | ${address.toString()}` +
        '\n\nWarning: Message has been truncated\nA\n' +
        `- ${'A'.repeat(1000)}\n` +
        `+ ${'B'.repeat(828)}...\n\`\`\``

      expect(internalMsg.length).toBeLessThanOrEqual(MAX_MESSAGE_LENGTH)
      expect(publicMsg.length).toBeLessThanOrEqual(MAX_MESSAGE_LENGTH)
      expect(discordClient.sendMessage).toHaveBeenCalledTimes(2)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        internalMsg,
        'INTERNAL',
      )
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        2,
        publicMsg,
        'PUBLIC',
      )
      expect(updateNotifierRepository.add).toHaveBeenCalledTimes(1)
      expect(updateNotifierRepository.add).toHaveBeenCalledWith({
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

      const updateNotifierRepository = mockObject<UpdateNotifierRepository>({
        add: async () => 0,
        findLatestId: async () => 0,
        getNewerThan: async () => [],
      })
      updateNotifierRepository.findLatestId.resolvesToOnce(undefined)

      const updateNotifier = new UpdateNotifier(
        updateNotifierRepository,
        discordClient,
        Logger.SILENT,
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

      await updateNotifier.handleUpdate(project, changes, {
        dependents,
        blockNumber: BLOCK,
        unknownContracts: [],
        chainId: ChainId.ETHEREUM,
      })

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        '> #0000 (block_number=123)\n\n***project-a*** | detected changes on chain: ***ethereum***```diff\nContract | ' +
          address.toString() +
          '\n\nerrors\n+ Execution reverted\n\n```',
        'INTERNAL',
      )
      expect(updateNotifierRepository.add).toHaveBeenCalledTimes(1)
      expect(updateNotifierRepository.add).toHaveBeenCalledWith({
        projectName: project,
        diff: changes,
        blockNumber: BLOCK,
        chainId: ChainId.ETHEREUM,
      })
    })
  })

  describe(UpdateNotifier.prototype.sendDailyReminder.name, () => {
    it('sends daily reminder at 9am CET', async () => {
      const updateNotifierRepository = mockObject<UpdateNotifierRepository>({
        add: async () => 0,
      })

      const discordClient = mockObject<DiscordClient>({
        sendMessage: async () => {},
      })

      const updateNotifier = new UpdateNotifier(
        updateNotifierRepository,
        discordClient,
        Logger.SILENT,
      )

      const reminders = {
        ['project-a']: [ChainId.ETHEREUM, ChainId.ARBITRUM],
        ['project-b']: [ChainId.ETHEREUM, ChainId.OPTIMISM],
      }
      const timestamp = UnixTime.now().toStartOf('day').add(6, 'hours')

      await updateNotifier.sendDailyReminder(reminders, timestamp)

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        `# Daily bot report @ ${timestamp.toYYYYMMDD()}\n\n:x: Detected changes :x:\n\`\`\`\n- project-a (ethereum, arbitrum)\n- project-b (ethereum, optimism)\n\`\`\`\n`,
        'INTERNAL',
      )
    })

    it('does not send daily reminder at other hour', async () => {
      const discordClient = mockObject<DiscordClient>({
        sendMessage: async () => {},
      })
      const updateNotifierRepository = mockObject<UpdateNotifierRepository>({
        add: async () => 0,
        findLatestId: async () => undefined,
      })
      const updateNotifier = new UpdateNotifier(
        updateNotifierRepository,
        discordClient,
        Logger.SILENT,
      )

      const reminders = {
        ['project-a']: [ChainId.ETHEREUM],
        ['project-b']: [ChainId.ETHEREUM],
      }
      const timestamp = UnixTime.now().toStartOf('day').add(1, 'hours')

      await updateNotifier.sendDailyReminder(reminders, timestamp)

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(0)
    })
  })
})
