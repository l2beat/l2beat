import type { InMemoryCache } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { env } from '~/env'
import type { Manifest } from '~/utils/Manifest'
import { createDefiRouter } from './DefiRouter'

// The flags production runs: DeFi off and Ossification on. Ossification
// links to DeFi project pages, which the project router serves.
describe(`${createDefiRouter.name} with only Ossification enabled`, () => {
  const original = {
    defi: env.CLIENT_SIDE_DEFI_ENABLED,
    ossification: env.CLIENT_SIDE_OSSIFICATION_ENABLED,
  }

  before(() => {
    env.CLIENT_SIDE_DEFI_ENABLED = false
    env.CLIENT_SIDE_OSSIFICATION_ENABLED = true
  })

  after(() => {
    env.CLIENT_SIDE_DEFI_ENABLED = original.defi
    env.CLIENT_SIDE_OSSIFICATION_ENABLED = original.ossification
  })

  it('serves nothing of the DeFi section', () => {
    const router = createDefiRouter(
      mockObject<Manifest>({}),
      async () => '<html />',
      mockObject<InMemoryCache>({}),
    )

    expect(router).toEqual(null)
  })
})
