import { Logger } from '@l2beat/backend-tools'
import { DISCORD_MAX_MESSAGE_LENGTH, type DiscordClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { WatchNotifier } from './WatchNotifier'

const NINE_AM_CET = UnixTime.fromDate(new Date('2026-11-25T06:00:00Z'))
const TEN_AM_CET = UnixTime.fromDate(new Date('2026-11-25T07:00:00Z'))

describe(WatchNotifier.name, () => {
  describe(WatchNotifier.prototype.handleUpdate.name, () => {
    it('sends a formatted markdown diff to Discord', async () => {
      const sendMessage = mockFn().resolvesTo('msg-1')
      const notifier = new WatchNotifier(
        mockObject<DiscordClient>({ sendMessage }),
        Logger.SILENT,
      )

      const result = await notifier.handleUpdate(
        'optimism',
        [
          {
            key: 'audits',
            changes: [
              { path: ['org/r:new.pdf'], after: { sha: 'abc', size: 123 } },
            ],
          },
        ],
        1_700_000_000,
      )

      expect(result).toEqual('sent')
      expect(sendMessage).toHaveBeenCalledTimes(1)
      expect(sendMessage).toHaveBeenNthCalledWith(
        1,
        [
          'Watch changes: ***optimism*** at timestamp 1700000000',
          '```diff',
          '    audits {',
          '+     org/r:new.pdf: {"sha":"abc","size":123}',
          '    }',
          '```',
        ].join('\n'),
      )
    })

    it('truncates long diffs to fit Discord message limit', async () => {
      const sendMessage = mockFn().resolvesTo('msg-1')
      const notifier = new WatchNotifier(
        mockObject<DiscordClient>({ sendMessage }),
        Logger.SILENT,
      )

      const changes = Array.from({ length: 100 }, (_, i) => ({
        path: [`org/repo:docs/audit-report-${i}.pdf`],
        after: { sha: 'a'.repeat(40), size: i * 100 },
      }))
      await notifier.handleUpdate(
        'optimism',
        [{ key: 'audits', changes }],
        1_700_000_000,
      )

      const sent = sendMessage.calls[0]?.args[0] as string
      expect(sent.length).toBeLessThanOrEqual(DISCORD_MAX_MESSAGE_LENGTH)
      expect(sent.endsWith('\n... (message too long)\n```')).toEqual(true)
    })

    it('returns failed when Discord rejects the request', async () => {
      const notifier = new WatchNotifier(
        mockObject<DiscordClient>({
          sendMessage: mockFn().rejectsWith(new Error('rate limited')),
        }),
        Logger.SILENT,
      )

      const result = await notifier.handleUpdate(
        'optimism',
        [{ key: 'v', changes: [{ path: [], before: 1, after: 2 }] }],
        1_700_000_000,
      )
      expect(result).toEqual('failed')
    })

    it('returns no-client when Discord is not configured', async () => {
      const notifier = new WatchNotifier(undefined, Logger.SILENT)
      const result = await notifier.handleUpdate(
        'optimism',
        [{ key: 'v', changes: [{ path: [], before: 1, after: 2 }] }],
        1_700_000_000,
      )
      expect(result).toEqual('no-client')
    })
  })

  describe(WatchNotifier.prototype.sendDailyReminder.name, () => {
    it('does nothing outside 9 AM CET or when nothing is pending or failed', async () => {
      const sendMessage = mockFn().resolvesTo('msg-1')
      const notifier = new WatchNotifier(
        mockObject<DiscordClient>({ sendMessage }),
        Logger.SILENT,
      )

      await notifier.sendDailyReminder(
        [{ name: 'alpha', pendingItems: 1, changedPaths: 0 }],
        TEN_AM_CET,
        [],
        [],
      )
      await notifier.sendDailyReminder([], NINE_AM_CET, ['muted'], [])
      expect(sendMessage).toHaveBeenCalledTimes(0)
    })

    it('sends a sorted table at 9 AM CET with failed and disabled watches in header', async () => {
      const sendMessage = mockFn().resolvesTo('msg-1')
      const notifier = new WatchNotifier(
        mockObject<DiscordClient>({ sendMessage }),
        Logger.SILENT,
      )

      await notifier.sendDailyReminder(
        [
          { name: 'zksync', pendingItems: 0, changedPaths: 2 },
          { name: 'optimism', pendingItems: 3, changedPaths: 1 },
          { name: 'arbitrum', pendingItems: 0, changedPaths: 2 },
        ],
        NINE_AM_CET,
        ['paused'],
        ['broken'],
      )

      expect(sendMessage).toHaveBeenCalledTimes(1)
      const msg = sendMessage.calls[0]?.args[0] as string
      expect(msg).toInclude('# Daily watch report @ 2026-11-25')
      expect(msg).toInclude(':warning: Disabled watches: `paused`')
      expect(msg).toInclude(':warning: Failed watches: `broken`')
      expect(msg.indexOf('optimism')).toBeLessThan(msg.indexOf('arbitrum'))
      expect(msg.indexOf('arbitrum')).toBeLessThan(msg.indexOf('zksync'))
    })
  })
})
