import { getConfig } from '../config'

/**
 * This test is designated to run with target environment
 * loaded as a part of CI pipeline before deployment to make
 * sure we have all the necessary configuration in place.
 */
describe('Configuration Smoke Test', () => {
  it('should load configuration without throwing', async () => {
    // no expect on purpose - getConfig will throw with a meaningful error message
    await getConfig()
  })
})
