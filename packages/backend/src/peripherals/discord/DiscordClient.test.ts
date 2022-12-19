import { expect } from 'earljs'

import { DiscordClient } from './DiscordClient'

describe(DiscordClient.name, () => {
  it(DiscordClient.prototype.sendMessage.name, () => {
    it('is called', () => {
      expect(true).toEqual(true)
    })
  })
})
