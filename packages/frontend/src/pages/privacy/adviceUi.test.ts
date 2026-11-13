import { expect } from 'earl'
import { formatWait } from './adviceUi'

describe('adviceUi', () => {
  describe(formatWait.name, () => {
    it('shows days and hours, and drops what is zero', () => {
      expect(formatWait(15 * 1440 + 11 * 60 + 59)).toEqual('15 days 11 hours')
      expect(formatWait(1440 + 60)).toEqual('1 day 1 hour')
      expect(formatWait(2 * 1440)).toEqual('2 days')
      expect(formatWait(7 * 60)).toEqual('7 hours')
      expect(formatWait(59)).toEqual('59 minutes')
      expect(formatWait(1)).toEqual('1 minute')
      expect(formatWait(0)).toEqual('0 minutes')
    })
  })
})
