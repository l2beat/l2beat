import { Env } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { expect } from 'earl'
import { FeatureFlags } from '../FeatureFlags'
import { getPrivacyConfig } from './privacy'

const ps = new ProjectService()
const env = new Env({})

describe(getPrivacyConfig.name, () => {
  it('returns false if enabled privacy projects have no tracked buckets', async () => {
    const flags = new FeatureFlags('privacy,!privacy.*,privacy.strk20')

    const config = await getPrivacyConfig(ps, env, flags)

    expect(config).toEqual(false)
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
