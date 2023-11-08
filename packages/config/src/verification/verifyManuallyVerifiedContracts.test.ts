import { expect } from 'earl'

import { getManuallyVerifiedContracts } from './manuallyVerifiedContracts'

describe('manually verified contracts', () => {
  describe('getManuallyVerifiedContracts()', () => {
    it('can load manually verified contracts', async () => {
      expect(await getManuallyVerifiedContracts()).toBeTruthy()
    })
  })
})
