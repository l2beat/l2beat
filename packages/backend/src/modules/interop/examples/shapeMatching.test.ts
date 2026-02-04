import { expect } from 'earl'
import { shapeMatches } from './shapeMatching'

describe('shapeMatches', () => {
  describe('primitives', () => {
    it('matches equal strings', () => {
      expect(shapeMatches('hello', 'hello')).toEqual(true)
    })

    it('does not match different strings', () => {
      expect(shapeMatches('hello', 'world')).toEqual(false)
    })

    it('matches equal numbers', () => {
      expect(shapeMatches(42, 42)).toEqual(true)
    })

    it('does not match different numbers', () => {
      expect(shapeMatches(42, 43)).toEqual(false)
    })

    it('matches equal booleans', () => {
      expect(shapeMatches(true, true)).toEqual(true)
      expect(shapeMatches(false, false)).toEqual(true)
    })

    it('does not match different booleans', () => {
      expect(shapeMatches(true, false)).toEqual(false)
    })

    it('matches null', () => {
      expect(shapeMatches(null, null)).toEqual(true)
    })

    it('matches undefined', () => {
      expect(shapeMatches(undefined, undefined)).toEqual(true)
    })

    it('does not match null vs undefined', () => {
      expect(shapeMatches(null, undefined)).toEqual(false)
      expect(shapeMatches(undefined, null)).toEqual(false)
    })
  })

  describe('bigint', () => {
    it('matches equal bigints', () => {
      expect(shapeMatches(BigInt(123), BigInt(123))).toEqual(true)
    })

    it('does not match different bigints', () => {
      expect(shapeMatches(BigInt(123), BigInt(456))).toEqual(false)
    })

    it('matches bigint with string representation', () => {
      expect(shapeMatches(BigInt(123), '123')).toEqual(true)
    })

    it('does not match bigint with different string', () => {
      expect(shapeMatches(BigInt(123), '456')).toEqual(false)
    })

    it('handles large bigint values', () => {
      const large = BigInt('1000000000000000000') // 1 ETH in wei
      expect(shapeMatches(large, '1000000000000000000')).toEqual(true)
    })
  })

  describe('shallow objects', () => {
    it('matches when expected is subset of actual', () => {
      const actual = { a: 1, b: 2, c: 3 }
      const expected = { a: 1 }
      expect(shapeMatches(actual, expected)).toEqual(true)
    })

    it('matches when all properties match', () => {
      const actual = { a: 1, b: 2 }
      const expected = { a: 1, b: 2 }
      expect(shapeMatches(actual, expected)).toEqual(true)
    })

    it('does not match when expected has key not in actual', () => {
      const actual = { a: 1 }
      const expected = { b: 2 }
      expect(shapeMatches(actual, expected)).toEqual(false)
    })

    it('does not match when values differ', () => {
      const actual = { a: 1 }
      const expected = { a: 2 }
      expect(shapeMatches(actual, expected)).toEqual(false)
    })

    it('allows additional keys in actual', () => {
      const actual = { a: 1, b: 2, c: 3, d: 4 }
      const expected = { a: 1, c: 3 }
      expect(shapeMatches(actual, expected)).toEqual(true)
    })
  })

  describe('nested objects', () => {
    it('matches nested properties', () => {
      const actual = {
        type: 'ccip.Message',
        src: { ctx: { chain: 'ethereum', txHash: '0x123' } },
      }
      const expected = {
        src: { ctx: { chain: 'ethereum' } },
      }
      expect(shapeMatches(actual, expected)).toEqual(true)
    })

    it('matches deeply nested properties', () => {
      const actual = {
        a: { b: { c: { d: { e: 42 } } } },
      }
      const expected = {
        a: { b: { c: { d: { e: 42 } } } },
      }
      expect(shapeMatches(actual, expected)).toEqual(true)
    })

    it('allows extra properties in nested objects', () => {
      const actual = {
        type: 'transfer',
        src: { chain: 'ethereum', amount: 100 },
        dst: { chain: 'base', amount: 100 },
      }
      const expected = {
        src: { chain: 'ethereum' },
      }
      expect(shapeMatches(actual, expected)).toEqual(true)
    })

    it('does not match when nested value differs', () => {
      const actual = {
        src: { ctx: { chain: 'ethereum' } },
      }
      const expected = {
        src: { ctx: { chain: 'base' } },
      }
      expect(shapeMatches(actual, expected)).toEqual(false)
    })

    it('does not match when nested key is missing', () => {
      const actual = {
        src: { ctx: { chain: 'ethereum' } },
      }
      const expected = {
        src: { ctx: { nonexistent: 'value' } },
      }
      expect(shapeMatches(actual, expected)).toEqual(false)
    })
  })

  describe('real-world examples', () => {
    describe('InteropEvent matching', () => {
      const event = {
        type: 'ccip.CCIPSendRequested',
        plugin: 'ccip',
        eventId: 'evt-abc123',
        direction: 'outgoing' as const,
        ctx: {
          chain: 'arbitrum',
          logIndex: 5,
          timestamp: 1234567890,
          txHash: '0xabc...',
        },
        args: {
          sender: '0x123...',
          receiver: '0x456...',
        },
      }

      it('matches by type only', () => {
        expect(shapeMatches(event, { type: 'ccip.CCIPSendRequested' })).toEqual(
          true,
        )
      })

      it('matches by chain', () => {
        expect(
          shapeMatches(event, {
            type: 'ccip.CCIPSendRequested',
            ctx: { chain: 'arbitrum' },
          }),
        ).toEqual(true)
      })

      it('matches by direction', () => {
        expect(
          shapeMatches(event, {
            type: 'ccip.CCIPSendRequested',
            direction: 'outgoing',
          }),
        ).toEqual(true)
      })

      it('matches by plugin', () => {
        expect(
          shapeMatches(event, {
            type: 'ccip.CCIPSendRequested',
            plugin: 'ccip',
          }),
        ).toEqual(true)
      })

      it('matches nested args', () => {
        expect(
          shapeMatches(event, {
            args: { sender: '0x123...' },
          }),
        ).toEqual(true)
      })

      it('does not match wrong chain', () => {
        expect(
          shapeMatches(event, {
            ctx: { chain: 'ethereum' },
          }),
        ).toEqual(false)
      })
    })

    describe('InteropMessage matching', () => {
      const message = {
        type: 'opstack.L1ToL2Message',
        plugin: 'opstack',
        app: 'opstack-standardbridge',
        src: {
          type: 'opstack.SentMessage',
          ctx: { chain: 'ethereum', txHash: '0x111' },
        },
        dst: {
          type: 'opstack.RelayedMessage',
          ctx: { chain: 'base', txHash: '0x222' },
        },
      }

      it('matches by type and app', () => {
        expect(
          shapeMatches(message, {
            type: 'opstack.L1ToL2Message',
            app: 'opstack-standardbridge',
          }),
        ).toEqual(true)
      })

      it('matches source chain', () => {
        expect(
          shapeMatches(message, {
            src: { ctx: { chain: 'ethereum' } },
          }),
        ).toEqual(true)
      })

      it('matches destination chain', () => {
        expect(
          shapeMatches(message, {
            dst: { ctx: { chain: 'base' } },
          }),
        ).toEqual(true)
      })

      it('matches both chains', () => {
        expect(
          shapeMatches(message, {
            src: { ctx: { chain: 'ethereum' } },
            dst: { ctx: { chain: 'base' } },
          }),
        ).toEqual(true)
      })

      it('does not match wrong destination', () => {
        expect(
          shapeMatches(message, {
            dst: { ctx: { chain: 'arbitrum' } },
          }),
        ).toEqual(false)
      })
    })

    describe('InteropTransfer matching', () => {
      const transfer = {
        type: 'ccip.Transfer',
        plugin: 'ccip',
        src: {
          event: {
            type: 'ccip.TokensSent',
            ctx: { chain: 'arbitrum', txHash: '0xaaa' },
          },
          tokenAddress: '0xtoken1',
          tokenAmount: BigInt('1000000'), // 1 USDC (6 decimals)
          wasBurned: true,
        },
        dst: {
          event: {
            type: 'ccip.TokensReceived',
            ctx: { chain: 'ethereum', txHash: '0xbbb' },
          },
          tokenAddress: '0xtoken2',
          tokenAmount: BigInt('1000000'),
          wasMinted: true,
        },
      }

      it('matches source chain', () => {
        expect(
          shapeMatches(transfer, {
            src: { event: { ctx: { chain: 'arbitrum' } } },
          }),
        ).toEqual(true)
      })

      it('matches destination chain', () => {
        expect(
          shapeMatches(transfer, {
            dst: { event: { ctx: { chain: 'ethereum' } } },
          }),
        ).toEqual(true)
      })

      it('matches token address', () => {
        expect(
          shapeMatches(transfer, {
            src: { tokenAddress: '0xtoken1' },
          }),
        ).toEqual(true)
      })

      it('matches amount as bigint', () => {
        expect(
          shapeMatches(transfer, {
            src: { tokenAmount: BigInt('1000000') },
          }),
        ).toEqual(true)
      })

      it('matches amount as string', () => {
        expect(
          shapeMatches(transfer, {
            src: { tokenAmount: '1000000' },
          }),
        ).toEqual(true)
      })

      it('matches burn flag', () => {
        expect(
          shapeMatches(transfer, {
            src: { wasBurned: true },
          }),
        ).toEqual(true)
      })

      it('matches mint flag', () => {
        expect(
          shapeMatches(transfer, {
            dst: { wasMinted: true },
          }),
        ).toEqual(true)
      })

      it('matches complex combination', () => {
        expect(
          shapeMatches(transfer, {
            type: 'ccip.Transfer',
            src: {
              event: { ctx: { chain: 'arbitrum' } },
              tokenAmount: '1000000',
              wasBurned: true,
            },
            dst: {
              event: { ctx: { chain: 'ethereum' } },
              wasMinted: true,
            },
          }),
        ).toEqual(true)
      })

      it('does not match wrong amount', () => {
        expect(
          shapeMatches(transfer, {
            src: { tokenAmount: '2000000' },
          }),
        ).toEqual(false)
      })

      it('does not match wrong flag', () => {
        expect(
          shapeMatches(transfer, {
            src: { wasBurned: false },
          }),
        ).toEqual(false)
      })
    })
  })

  describe('edge cases', () => {
    it('handles empty objects', () => {
      expect(shapeMatches({}, {})).toEqual(true)
      expect(shapeMatches({ a: 1 }, {})).toEqual(true)
      expect(shapeMatches({}, { a: 1 })).toEqual(false)
    })

    it('handles arrays (treats as objects)', () => {
      expect(shapeMatches([1, 2, 3], [1, 2, 3])).toEqual(true)
      expect(shapeMatches([1, 2, 3], [1])).toEqual(true) // partial match on indices
    })

    it('does not match primitive against object', () => {
      expect(shapeMatches(42, { value: 42 })).toEqual(false)
      expect(shapeMatches('string', { value: 'string' })).toEqual(false)
    })

    it('does not match object against primitive', () => {
      expect(shapeMatches({ value: 42 }, 42)).toEqual(false)
    })

    it('handles mixed types in nested structures', () => {
      const actual = {
        string: 'value',
        number: 42,
        boolean: true,
        null: null,
        nested: {
          bigint: BigInt(999),
          array: [1, 2, 3],
        },
      }

      expect(
        shapeMatches(actual, {
          string: 'value',
          nested: { bigint: '999' },
        }),
      ).toEqual(true)
    })
  })
})
