import { Env } from '@l2beat/backend-tools'
import { expect } from 'earl'
import { getDiscoveryCoingeckoApiUrl } from './config.discovery'

describe(getDiscoveryCoingeckoApiUrl.name, () => {
  it('uses the shared url with the shared key', () => {
    const env = new Env({
      COINGECKO_API_KEY: 'proxy-key',
      COINGECKO_API_URL: 'https://prices.example.com/api/v3',
    })

    expect(getDiscoveryCoingeckoApiUrl(env)).toEqual(
      'https://prices.example.com/api/v3',
    )
  })

  it('never sends a discovery key to the shared url', () => {
    const env = new Env({
      COINGECKO_API_KEY: 'proxy-key',
      COINGECKO_API_URL: 'https://prices.example.com/api/v3',
      COINGECKO_API_KEY_FOR_DISCOVERY: 'coingecko-key',
    })

    expect(getDiscoveryCoingeckoApiUrl(env)).toEqual(undefined)
  })

  it('pairs a discovery key with the discovery url', () => {
    const env = new Env({
      COINGECKO_API_KEY_FOR_DISCOVERY: 'discovery-proxy-key',
      COINGECKO_API_URL_FOR_DISCOVERY: 'https://prices.example.com/api/v3',
    })

    expect(getDiscoveryCoingeckoApiUrl(env)).toEqual(
      'https://prices.example.com/api/v3',
    )
  })
})
