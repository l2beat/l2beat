import { expect } from 'earl'
import { kqlToDsl } from './kql'

describe('kqlToDsl', () => {
  it('converts a field phrase match', () => {
    expect(kqlToDsl('message.keyword : "Request processed"')).toEqual({
      match_phrase: { 'message.keyword': 'Request processed' },
    })
  })

  it('converts or-combined bare phrases (RPC walker failures tile)', () => {
    expect(
      kqlToDsl(
        'msg:"Walker exited unexpectedly" or "Error inserting logs" or "Error resolving reorg"',
      ),
    ).toEqual({
      bool: {
        should: [
          { match_phrase: { msg: 'Walker exited unexpectedly' } },
          {
            multi_match: {
              type: 'phrase',
              query: 'Error inserting logs',
              lenient: true,
            },
          },
          {
            multi_match: {
              type: 'phrase',
              query: 'Error resolving reorg',
              lenient: true,
            },
          },
        ],
        minimum_should_match: 1,
      },
    })
  })

  it('converts wildcards and uppercase AND (activity tile)', () => {
    expect(
      kqlToDsl(
        'service.name.keyword :BlockActivityIndexer* AND message.keyword : "Metrics"',
      ),
    ).toEqual({
      bool: {
        filter: [
          {
            query_string: {
              fields: ['service.name.keyword'],
              query: 'BlockActivityIndexer*',
              analyze_wildcard: true,
            },
          },
          { match_phrase: { 'message.keyword': 'Metrics' } },
        ],
      },
    })
  })

  it('converts parentheses and multi-line queries (interop tile)', () => {
    expect(
      kqlToDsl(
        'service.name.keyword: "InteropPromotionService"\nand (message: "Interop snapshot blocked from promotion"\n  or message: "Promotion shadow: snapshot would be blocked")',
      ),
    ).toEqual({
      bool: {
        filter: [
          {
            match_phrase: {
              'service.name.keyword': 'InteropPromotionService',
            },
          },
          {
            bool: {
              should: [
                {
                  match_phrase: {
                    message: 'Interop snapshot blocked from promotion',
                  },
                },
                {
                  match_phrase: {
                    message: 'Promotion shadow: snapshot would be blocked',
                  },
                },
              ],
              minimum_should_match: 1,
            },
          },
        ],
      },
    })
  })

  it('converts exists queries', () => {
    expect(kqlToDsl('"@timestamp": *')).toEqual({
      exists: { field: '@timestamp' },
    })
  })

  it('converts unquoted values to match', () => {
    expect(kqlToDsl('labels.feature.keyword :"liveness"')).toEqual({
      match_phrase: { 'labels.feature.keyword': 'liveness' },
    })
    expect(kqlToDsl('chain: ethereum')).toEqual({
      match: { chain: 'ethereum' },
    })
  })

  it('converts range operators (HTTP 5xx tile)', () => {
    expect(
      kqlToDsl(
        'message.keyword : "Request processed" and parameters.status >= 500',
      ),
    ).toEqual({
      bool: {
        filter: [
          { match_phrase: { 'message.keyword': 'Request processed' } },
          { range: { 'parameters.status': { gte: 500 } } },
        ],
      },
    })
    expect(kqlToDsl('duration < 100')).toEqual({
      range: { duration: { lt: 100 } },
    })
  })

  it('throws on unsupported syntax instead of guessing', () => {
    expect(() => kqlToDsl('message: "unterminated')).toThrow()
    expect(() => kqlToDsl('field: (a or b)')).toThrow()
  })
})
