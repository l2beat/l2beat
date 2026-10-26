import { expect } from 'earl'
import { redactUrl, redactUrls } from './redactUrls'

describe(redactUrls.name, () => {
  it('redacts a key in the path of a url inside a sentence', () => {
    expect(
      redactUrls(
        'request to https://degen-mainnet.g.alchemy.com/v2/AbCdEf0123456789AbCdEf0123456789 failed, reason: getaddrinfo ENOTFOUND degen-mainnet.g.alchemy.com',
      ),
    ).toEqual(
      'request to https://degen-mainnet.g.alchemy.com/v2/REDACTED failed, reason: getaddrinfo ENOTFOUND degen-mainnet.g.alchemy.com',
    )
  })

  it('redacts every url in a quoted attribute', () => {
    expect(
      redactUrls(
        'bad response (url="https://rpc.example.com/ethereum/prod:abc123", fallback="wss://user:pass@ws.example.com/")',
      ),
    ).toEqual(
      'bad response (url="https://rpc.example.com/ethereum/prod:REDACTED", fallback="wss://REDACTED:REDACTED@ws.example.com/")',
    )
  })

  it('keeps punctuation that ends the sentence out of the url', () => {
    expect(
      redactUrls(
        'Tried https://api.example.com/v1/AbCdEf0123456789AbCdEf0123456789.',
      ),
    ).toEqual('Tried https://api.example.com/v1/REDACTED.')
  })

  it('keeps the closing bracket of an IPv6 host', () => {
    expect(redactUrls('Failed: https://user:pass@[2001:db8::1].')).toEqual(
      'Failed: https://REDACTED:REDACTED@[2001:db8::1]/.',
    )
  })

  it('handles a url wrapped in brackets', () => {
    expect(redactUrls('[https://user:pass@rpc.example.com]')).toEqual(
      '[https://REDACTED:REDACTED@rpc.example.com/]',
    )
  })

  it('returns text without urls unchanged', () => {
    const text = 'Connect Timeout Error (attempted address: rpc.l2beat.com:443)'
    expect(redactUrls(text)).toEqual(text)
  })
})

describe(redactUrl.name, () => {
  it('redacts sensitive query param values', () => {
    expect(redactUrl('https://api.starkex.com/v1/blocks?key=secret')).toEqual(
      'https://api.starkex.com/v1/blocks?key=REDACTED',
    )
  })

  it('preserves non-sensitive query params', () => {
    expect(redactUrl('https://api/feed?from=1&to=2&apiKey=secret')).toEqual(
      'https://api/feed?from=1&to=2&apiKey=REDACTED',
    )
  })

  it('redacts key-like path segments (e.g. RPC provider keys)', () => {
    expect(
      redactUrl(
        'https://eth-mainnet.g.alchemy.com/v2/AbCdEf0123456789AbCdEf0123456789',
      ),
    ).toEqual('https://eth-mainnet.g.alchemy.com/v2/REDACTED')
  })

  it('redacts shorter provider keys', () => {
    expect(
      redactUrl(
        'https://edgechain-mainnet.g.alchemy.com/v2/AbCdEf0123456789XyZ01',
      ),
    ).toEqual('https://edgechain-mainnet.g.alchemy.com/v2/REDACTED')
  })

  it('redacts params whose name contains a sensitive word', () => {
    expect(
      redactUrl(
        'https://pro-api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=1&to=2&x_cg_pro_api_key=CG-abc',
      ),
    ).toEqual(
      'https://pro-api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=1&to=2&x_cg_pro_api_key=REDACTED',
    )
  })

  it('redacts the part after a colon in path segments', () => {
    expect(
      redactUrl('https://rpc.example.com/ethereum/service:abc123/extra'),
    ).toEqual('https://rpc.example.com/ethereum/service:REDACTED/extra')
  })

  it('redacts userinfo credentials', () => {
    expect(redactUrl('https://user:secret@rpc.example.com/')).toEqual(
      'https://REDACTED:REDACTED@rpc.example.com/',
    )
  })

  it('preserves 0x-prefixed identifiers and normal path segments', () => {
    const url =
      'https://api/api/v2/transactions/0x1234567890abcdef1234567890abcdef'
    expect(redactUrl(url)).toEqual(url)
  })

  it('returns the input unchanged when it is not a valid url', () => {
    expect(redactUrl('not a url')).toEqual('not a url')
  })
})
