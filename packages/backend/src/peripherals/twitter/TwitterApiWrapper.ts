/*
To tweet you need to:
- have Twitter Developer Account
- create Project on your Developer Account
- have an account (Bot) from which you want to tweet
- give access to the Project from your Bot account

The process is described here:
https://developer.twitter.com/en/docs/tutorials/how-to-create-a-twitter-bot-with-twitter-api-v2
*/

import { TweetV2PostTweetResult, TwitterApi } from 'twitter-api-v2'

// OAuth 1.0a
export interface TwitterAuth {
  // Consumer Key
  appKey: string
  // Consumer Secret
  appSecret: string
  // Access Token
  accessToken: string
  // Token Secret
  accessSecret: string
}

export class TwitterApiWrapper {
  private readonly twitterApi: TwitterApi

  constructor(params: TwitterAuth) {
    this.twitterApi = new TwitterApi(params)
  }

  async tweet(message: string): Promise<TweetV2PostTweetResult> {
    return this.twitterApi.v2.tweet(message)
  }
}
