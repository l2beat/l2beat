import { Env } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { expect } from 'earl'
import { FeatureFlags } from '../FeatureFlags'
import { getPrivacyConfig } from './privacy'

const ps = new ProjectService()
const env = new Env({})

describe(getPrivacyConfig.name, () => {
  it('creates Starknet flow configs for STRK-20', async () => {
    const flags = new FeatureFlags('privacy,!privacy.*,privacy.strk20')

    const config = await getPrivacyConfig(ps, env, flags)

    expect(config === false).toEqual(false)
    if (config === false) return

    expect(config.flowConfigs).toEqual([])
    expect(
      config.starknetFlowConfigs.map((x) => [x.bucketId, x.direction]),
    ).toEqual([
      ['strk20-STRK', 'deposit'],
      ['strk20-STRK', 'withdrawal'],
      ['strk20-USDC', 'deposit'],
      ['strk20-USDC', 'withdrawal'],
      ['strk20-strkBTC', 'deposit'],
      ['strk20-strkBTC', 'withdrawal'],
      ['strk20-WBTC', 'deposit'],
      ['strk20-WBTC', 'withdrawal'],
      ['strk20-ETH', 'deposit'],
      ['strk20-ETH', 'withdrawal'],
    ])
  })

  describe('price is tracked no later than flows', () => {
    it('every privacy bucket starts at or after its token price', async () => {
      const projects = await ps.getProjects({ select: ['privacyInfo'] })
      for (const project of projects) {
        for (const token of project.privacyInfo.tokens) {
          const priceSince = token.token.sinceTimestamp
          if (!token.token.priceId || !priceSince) continue
          for (const bucket of token.buckets) {
            expect(priceSince <= bucket.sinceTimestamp).toEqual(true)
          }
        }
      }
    })
  })
})
