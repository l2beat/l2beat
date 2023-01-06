import { mock } from '@l2beat/common'
import { expect, mockFn } from 'earljs'

import { TwitterApiWrapper } from './TwitterApiWrapper'
import { TwitterClient } from './TwitterClient'

describe(TwitterClient.name, () => {
  describe(TwitterClient.prototype.tweet.name, () => {
    it('uses wrapper for tweet', async () => {
      const twitterApiWrapper = mock<TwitterApiWrapper>({
        tweet: mockFn().returns({}),
      })

      const twitterClient = new TwitterClient(twitterApiWrapper)
      await twitterClient.tweet('test')

      expect(twitterApiWrapper.tweet).toHaveBeenCalledExactlyWith([['test']])
    })
  })
})
