import type { Project } from '@l2beat/config'
import { expect, mockObject } from 'earl'
import { env } from '~/env'
import { hasDefiProjectPage } from './hasDefiProjectPage'

// Method: flip the two feature flags the way each environment sets them and
// ask about a DeFi project with and without an ossification history.
describe(hasDefiProjectPage.name, () => {
  const original = {
    defi: env.CLIENT_SIDE_DEFI_ENABLED,
    ossification: env.CLIENT_SIDE_OSSIFICATION_ENABLED,
  }

  afterEach(() => {
    env.CLIENT_SIDE_DEFI_ENABLED = original.defi
    env.CLIENT_SIDE_OSSIFICATION_ENABLED = original.ossification
  })

  const OSSIFIED = {
    ossificationHistory:
      mockObject<Project<'ossificationHistory'>['ossificationHistory']>(),
  }
  const NOT_OSSIFIED = {}

  it('gives every DeFi project a page while DeFi pages are enabled', () => {
    env.CLIENT_SIDE_DEFI_ENABLED = true
    env.CLIENT_SIDE_OSSIFICATION_ENABLED = false

    expect(hasDefiProjectPage(NOT_OSSIFIED)).toEqual(true)
  })

  it('gives an ossification-tracked project a standalone page, so the Ossification table can link to it', () => {
    env.CLIENT_SIDE_DEFI_ENABLED = false
    env.CLIENT_SIDE_OSSIFICATION_ENABLED = true

    expect(hasDefiProjectPage(OSSIFIED)).toEqual(true)
    expect(hasDefiProjectPage(NOT_OSSIFIED)).toEqual(false)
  })

  it('gives no page when neither DeFi nor Ossification is enabled', () => {
    env.CLIENT_SIDE_DEFI_ENABLED = false
    env.CLIENT_SIDE_OSSIFICATION_ENABLED = false

    expect(hasDefiProjectPage(OSSIFIED)).toEqual(false)
  })
})
