import { ProjectService } from '@l2beat/config'
import { expect } from 'earl'
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
})
