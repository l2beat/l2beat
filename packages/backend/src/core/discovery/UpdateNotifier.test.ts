import { DiscoveryDiff } from '@l2beat/discovery'
import { Logger } from '@l2beat/shared'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { UpdateNotifierRepository } from '../../peripherals/database/discovery/UpdateNotifierRepository'
import { DiscordClient } from '../../peripherals/discord/DiscordClient'
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
      })

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(2)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        '> #0000 (block_number=123)\n\n***project-a*** | detected changes```diff\nContract | ' +
          address.toString() +
          '\n\nA\n- 1\n+ 2\n\n```',
        'INTERNAL',
      )
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        2,
        '***project-a*** | detected changes```diff\nContract | ' +
          address.toString() +
          '\n\nA\n- 1\n+ 2\n\n```',
        'PUBLIC',
      )
      expect(updateNotifierRepository.add).toHaveBeenCalledTimes(1)
      expect(updateNotifierRepository.add).toHaveBeenCalledWith({
        projectName: project,
        diff: changes,
        blockNumber: BLOCK,
      })
    })

    it('sends errors only to internal channel', async () => {
      const discordClient = mockObject<DiscordClient>({
        sendMessage: async () => {},
      })

      const updateNotifierRepository = mockObject<UpdateNotifierRepository>({
        add: async () => 0,
        findLatestId: async () => 0,
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
      })

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        '> #0000 (block_number=123)\n\n***project-a*** | detected changes```diff\nContract | ' +
          address.toString() +
          '\n\nerrors\n+ Execution reverted\n\n```',
        'INTERNAL',
      )
      expect(updateNotifierRepository.add).toHaveBeenCalledTimes(1)
      expect(updateNotifierRepository.add).toHaveBeenCalledWith({
        projectName: project,
        diff: changes,
        blockNumber: BLOCK,
      })
    })
  })

  describe(UpdateNotifier.prototype.handleUnresolved.name, () => {
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

      const notUpdatedProjects = ['project-a', 'project-b']
      const timestamp = UnixTime.now().toStartOf('day').add(6, 'hours')

      await updateNotifier.handleUnresolved(notUpdatedProjects, timestamp)

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        '```Daily bot report @ ' +
          timestamp.toYYYYMMDD() +
          '```\n:x: project-a\n\n:x: project-b',
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

      const notUpdatedProjects = ['project-a', 'project-b']
      const timestamp = UnixTime.now().toStartOf('day').add(1, 'hours')

      await updateNotifier.handleUnresolved(notUpdatedProjects, timestamp)

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(0)
    })
  })
})
