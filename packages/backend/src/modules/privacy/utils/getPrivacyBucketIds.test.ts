import { expect } from 'earl'
import { getPrivacyBucketIds } from './getPrivacyBucketIds'

describe(getPrivacyBucketIds.name, () => {
  it('lists each bucket once, sorted', () => {
    expect(
      getPrivacyBucketIds([
        { bucketId: 'b' },
        { bucketId: 'a' },
        { bucketId: 'b' },
      ]),
    ).toEqual(['a', 'b'])
  })
})
