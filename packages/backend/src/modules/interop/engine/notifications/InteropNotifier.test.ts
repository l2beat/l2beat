import { Logger } from '@l2beat/backend-tools'
import type { DiscordClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { InteropNotifier } from './InteropNotifier'

describe(InteropNotifier.name, () => {
  it('queues and sends a markdown diff message', async () => {
    const webhookClient = mockObject<DiscordClient>({
      sendMessage: async () => '1',
    })
    const notifier = new InteropNotifier(webhookClient, Logger.SILENT)

    notifier.handleConfigChange('ccip', { version: 1 }, { version: 2 })
    await notifier._TEST_ONLY_waitTillEmpty()

    expect(webhookClient.sendMessage).toHaveBeenCalledTimes(1)
    const message = webhookClient.sendMessage.calls[0]?.args[0] as string

    expect(message.includes('**ccip** config change')).toEqual(true)
    expect(message.includes('```diff')).toEqual(true)
    expect(message.includes('~ $.version')).toEqual(true)
    expect(message.includes('-   1')).toEqual(true)
    expect(message.includes('+   2')).toEqual(true)
  })

  it('does not send message when diff is empty after undefined normalization', async () => {
    const webhookClient = mockObject<DiscordClient>({
      sendMessage: async () => '1',
    })
    const notifier = new InteropNotifier(webhookClient, Logger.SILENT)

    notifier.handleConfigChange(
      'ccip',
      { networks: [{ chain: 'a' }] },
      { networks: [{ chain: 'a', onRamp: undefined }] },
    )
    await notifier._TEST_ONLY_waitTillEmpty()

    expect(webhookClient.sendMessage).toHaveBeenCalledTimes(0)
  })

  it('preserves message order in queue', async () => {
    const sent: string[] = []
    const webhookClient = mockObject<DiscordClient>({
      sendMessage: async (message) => {
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

  it('queues and sends suspicious aggregate notifications', async () => {
    const webhookClient = mockObject<DiscordClient>({
      sendMessage: async () => '1',
    })
    const notifier = new InteropNotifier(webhookClient, Logger.SILENT)

    notifier.notifySuspiciousAggregates(UnixTime(2_000_000), {
      checkedGroups: 3,
      suspiciousGroups: [
        {
          id: 'stargate',
          bridgeType: 'nonMinting',
          srcChain: 'ethereum',
          dstChain: 'arbitrum',
          reasons: [
            'Transfer count spiked (+1900%, 1,000 → 20,000)',
            'Source volume spiked (+2900%, $2M → $60M)',
          ],
          evaluation: {
            signals: [
              {
                metric: 'count',
                kind: 'ratioSpike',
                severity: 'severe',
                baseline: 1_000,
                current: 20_000,
                changePercent: 1_900,
              },
              {
                metric: 'srcVolume',
                kind: 'ratioSpike',
                severity: 'severe',
                baseline: 2_000_000,
                current: 60_000_000,
                changePercent: 2_900,
              },
            ],
            sideMismatch: null,
          },
        },
      ],
    })
    await notifier._TEST_ONLY_waitTillEmpty()

    expect(webhookClient.sendMessage).toHaveBeenCalledTimes(1)
    const message = webhookClient.sendMessage.calls[0]?.args[0] as string

    expect(message.includes('Interop aggregate analysis flagged')).toEqual(true)
    expect(message.includes('stargate')).toEqual(true)
    expect(
      message.includes('nonMinting transfers on the ethereum -> arbitrum path'),
    ).toEqual(true)
    expect(message.includes('Transfer count spiked')).toEqual(true)
  })

  it('queues and sends suspicious transfer notifications', async () => {
    const webhookClient = mockObject<DiscordClient>({
      sendMessage: async () => '1',
    })
    const notifier = new InteropNotifier(webhookClient, Logger.SILENT)

    notifier.notifySuspiciousTransfers(UnixTime(2_000_000), [
      {
        plugin: 'stargate',
        type: 'deposit',
        transferId: 'msg-1',
        timestamp: UnixTime(1_999_990),
        srcChain: 'ethereum',
        srcTxHash:
          '0x1111111111111111111111111111111111111111111111111111111111111111',
        srcTokenAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        srcSymbol: 'USDC',
        srcValueUsd: 600,
        dstChain: 'arbitrum',
        dstTxHash:
          '0x2222222222222222222222222222222222222222222222222222222222222222',
        dstTokenAddress: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        dstSymbol: 'USDC.e',
        dstValueUsd: 100,
        dominantSide: 'src',
        valueDifferencePercent: 83.3333,
        valueRatio: 6,
      },
    ])
    await notifier._TEST_ONLY_waitTillEmpty()

    expect(webhookClient.sendMessage).toHaveBeenCalledTimes(1)
    const message = webhookClient.sendMessage.calls[0]?.args[0] as string

    expect(message.includes('Interop financials flagged')).toEqual(true)
    expect(
      message.includes(
        '`msg-1` `stargate` `deposit` `USDC on ethereum -> USDC.e on arbitrum`',
      ),
    ).toEqual(true)
    expect(message.includes('$600.00 vs $100.00')).toEqual(true)
    expect(message.includes('6.00x src/dst')).toEqual(true)
  })

  it('queues and sends skipped valuation notifications', async () => {
    const webhookClient = mockObject<DiscordClient>({
      sendMessage: async () => '1',
    })
    const notifier = new InteropNotifier(webhookClient, Logger.SILENT)

    notifier.notifySkippedTransferValuations(UnixTime(2_000_000), [
      {
        plugin: 'stargate',
        type: 'deposit',
        transferId: 'msg-1',
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        side: 'src',
        symbol: 'MEGA',
        coingeckoId: 'mega-token',
        priceUsd: 1_500_000,
        amount: 1,
        valueUsd: undefined,
        reason: 'priceAboveThreshold',
        thresholdUsd: 1_000_000,
      },
      {
        plugin: 'stargate',
        type: 'deposit',
        transferId: 'msg-2',
        srcChain: 'ethereum',
        dstChain: 'arbitrum',
        side: 'dst',
        symbol: 'WHALE',
        coingeckoId: 'whale-token',
        priceUsd: 20_000,
        amount: 100_000,
        valueUsd: 2_000_000_000,
        reason: 'valueAboveThreshold',
        thresholdUsd: 1_000_000_000,
      },
    ])
    await notifier._TEST_ONLY_waitTillEmpty()

    expect(webhookClient.sendMessage).toHaveBeenCalledTimes(1)
    const message = webhookClient.sendMessage.calls[0]?.args[0] as string

    expect(message.includes('Interop financials skipped')).toEqual(true)
    expect(
      message.includes('price $1,500,000.00 is above $1,000,000.00'),
    ).toEqual(true)
    expect(
      message.includes(
        'skipped value $2,000,000,000.00 above $1,000,000,000.00',
      ),
    ).toEqual(true)
  })
})
