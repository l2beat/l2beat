import { Env } from '@l2beat/backend-tools'
import { expect } from 'earl'
import { getDiscoveryCoingeckoConfig } from './config.discovery'

describe(getDiscoveryCoingeckoConfig.name, () => {
  it('falls back to the shared key and its url', () => {
    const env = new Env({
      COINGECKO_API_KEY: 'proxy-key',
      COINGECKO_API_URL: 'https://prices.example.com/api/v3',
    })

    expect(getDiscoveryCoingeckoConfig(env)).toEqual({
      coingeckoApiKey: 'proxy-key',
      coingeckoApiUrl: 'https://prices.example.com/api/v3',
    })
  })

  it('never sends a discovery key to the shared url', () => {
    const env = new Env({
      COINGECKO_API_KEY: 'proxy-key',
      COINGECKO_API_URL: 'https://prices.example.com/api/v3',
      COINGECKO_API_KEY_FOR_DISCOVERY: 'coingecko-key',
    })

    expect(getDiscoveryCoingeckoConfig(env)).toEqual({
      coingeckoApiKey: 'coingecko-key',
      coingeckoApiUrl: undefined,
    })
  })

  it('pairs a discovery key with the discovery url', () => {
    const env = new Env({
      COINGECKO_API_KEY_FOR_DISCOVERY: 'discovery-proxy-key',
      COINGECKO_API_URL_FOR_DISCOVERY: 'https://prices.example.com/api/v3',
    })

    expect(getDiscoveryCoingeckoConfig(env)).toEqual({
      coingeckoApiKey: 'discovery-proxy-key',
      coingeckoApiUrl: 'https://prices.example.com/api/v3',
    })
  })
})
