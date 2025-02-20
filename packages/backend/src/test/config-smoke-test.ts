import { expect } from 'earl'
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

  it('should throw if configuration missing env variable', async () => {
    expect(process.env.COINGECKO_API_KEY).not.toEqual(undefined)
    process.env.COINGECKO_API_KEY = undefined
    // no expect on purpose - getConfig will throw with a meaningful error message
    await expect(getConfig).toBeRejectedWith(
      'Error: Missing environment variable: COINGECKO_API_KEY',
    )
  })
})
