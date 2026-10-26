import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getSyncStatus } from './tokenEntryHelpers'

describe(getSyncStatus.name, () => {
  const hour = UnixTime.toStartOf(UnixTime.now(), 'hour')

  it('flags a value older than the hour as missing, even for a late token', () => {
    expect(getSyncStatus(hour - UnixTime.HOUR, hour, true)).toEqual(
      expect.regex(/^No token data since /),
    )
  })

  it('flags a late token whose value is from the hour', () => {
    expect(getSyncStatus(hour, hour, true)).toEqual(
      expect.regex(/^This token is still syncing/),
    )
  })

  it('flags nothing for a token on time', () => {
    expect(getSyncStatus(hour, hour, false)).toEqual(undefined)
  })
})
