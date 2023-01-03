import { TweetV2PostTweetResult } from 'twitter-api-v2'

import { TwitterApiWrapper } from './TwitterApiWrapper'

export class TwitterClient {
  constructor(private readonly twitterApi: TwitterApiWrapper) {}

  async tweet(message: string): Promise<TweetV2PostTweetResult> {
    return this.twitterApi.tweet(message)
  }
}
