import { expect, mockFn, mockObject } from 'earl'

import { TwitterApiWrapper } from './TwitterApiWrapper'
import { TwitterClient } from './TwitterClient'

describe(TwitterClient.name, () => {
  describe(TwitterClient.prototype.tweet.name, () => {
    it('uses wrapper for tweet', async () => {
      const twitterApiWrapper = mockObject<TwitterApiWrapper>({
        tweet: mockFn().returns({}),
      })

      const twitterClient = new TwitterClient(twitterApiWrapper)
      await twitterClient.tweet('test')

      expect(twitterApiWrapper.tweet).toHaveBeenOnlyCalledWith('test')
    })
  })
})
