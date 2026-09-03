import { Env } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { FeatureFlags } from '../FeatureFlags'
import { getPrivacyConfig } from './privacy'

const ps = new ProjectService()

describe(getPrivacyConfig.name, () => {
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

  it('clamps anonymity set backfills to PRIVACY_MIN_TIMESTAMP', async () => {
    const minTimestamp = UnixTime(2_000_000_000)
    const config = await getPrivacyConfig(
      ps,
      new Env({ PRIVACY_MIN_TIMESTAMP: minTimestamp.toString() }),
      new FeatureFlags('privacy'),
    )

    if (config === false) throw new Error('Privacy config should be enabled')
    expect(config.anonymitySetConfigs.length).toBeGreaterThan(0)
    for (const anonymitySetConfig of config.anonymitySetConfigs) {
      expect(anonymitySetConfig.sinceTimestamp).toEqual(minTimestamp)
    }
  })
})
