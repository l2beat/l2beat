import { Env } from '@l2beat/backend-tools'
import type { ProjectService } from '@l2beat/config'
import { expect, mockObject } from 'earl'
import { FeatureFlags } from '../FeatureFlags'
import { getInteropFeatureConfig } from './interop'

const projectService = mockObject<ProjectService>()
const baseEnv = {
  TOKEN_BACKEND_TRPC_URL: 'https://token-db.example.com',
}

describe(getInteropFeatureConfig.name, () => {
  it('enables matching without enabling Relay', async () => {
    const config = await getInteropFeatureConfig(
      projectService,
      new Env(baseEnv),
      new FeatureFlags('interop,!interop.*,interop.matching'),
      [],
      [],
    )

    if (!config) throw new Error('Interop config not created')
    expect(config.matching).toEqual(true)
    expect(config.relay).toEqual(false)
  })

  it('enables Relay without enabling matching', async () => {
    const config = await getInteropFeatureConfig(
      projectService,
      new Env({ ...baseEnv, INTEROP_RELAY_API_KEY: 'api-key' }),
      new FeatureFlags('interop,!interop.*,interop.relay'),
      [],
      [],
    )

    if (!config || !config.relay) throw new Error('Relay config not created')
    expect(config.matching).toEqual(false)
    expect(config.relay.apiKey).toEqual('api-key')
  })

  it('requires an API key only when Relay is enabled', async () => {
    await expect(
      getInteropFeatureConfig(
        projectService,
        new Env(baseEnv),
        new FeatureFlags('interop,!interop.*,interop.relay'),
        [],
        [],
      ),
    ).toBeRejectedWith('Missing environment variable: INTEROP_RELAY_API_KEY')
  })
})
