import { Logger } from '@l2beat/backend-tools'
import type { DiscordClient } from '@l2beat/shared'
import { expect, mockObject } from 'earl'
import { InteropNotifier } from './InteropNotifier'

describe(InteropNotifier.name, () => {
  it('queues and sends a markdown diff message', async () => {
    const webhookClient = mockObject<DiscordClient>({
      sendMessageToWebhook: async () => '1',
    })
    const notifier = new InteropNotifier(webhookClient, Logger.SILENT)

    notifier.handleConfigChange('ccip', { version: 1 }, { version: 2 })
    await notifier._TEST_ONLY_waitTillEmpty()

    expect(webhookClient.sendMessageToWebhook).toHaveBeenCalledTimes(1)
    const message = webhookClient.sendMessageToWebhook.calls[0]
      ?.args[0] as string

    expect(message.includes('**ccip** config change')).toEqual(true)
    expect(message.includes('```diff')).toEqual(true)
    expect(message.includes('~ $.version')).toEqual(true)
    expect(message.includes('-   1')).toEqual(true)
    expect(message.includes('+   2')).toEqual(true)
  })

  it('does not send message when diff is empty after undefined normalization', async () => {
    const webhookClient = mockObject<DiscordClient>({
      sendMessageToWebhook: async () => '1',
    })
    const notifier = new InteropNotifier(webhookClient, Logger.SILENT)

    notifier.handleConfigChange(
      'ccip',
      { networks: [{ chain: 'a' }] },
      { networks: [{ chain: 'a', onRamp: undefined }] },
    )
    await notifier._TEST_ONLY_waitTillEmpty()

    expect(webhookClient.sendMessageToWebhook).toHaveBeenCalledTimes(0)
  })

  it('preserves message order in queue', async () => {
    const sent: string[] = []
    const webhookClient = mockObject<DiscordClient>({
      sendMessageToWebhook: async (message) => {
        sent.push(message)
        return `${sent.length}`
      },
    })
    const notifier = new InteropNotifier(webhookClient, Logger.SILENT)

    notifier.handleConfigChange('first', { value: 1 }, { value: 2 })
    notifier.handleConfigChange('second', { value: 10 }, { value: 20 })
    await notifier._TEST_ONLY_waitTillEmpty()

    expect(sent.length).toEqual(2)
    expect(sent[0]?.includes('**first** config change')).toEqual(true)
    expect(sent[1]?.includes('**second** config change')).toEqual(true)
  })
})
