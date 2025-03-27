import type { Tweet } from 'agent-twitter-client'
import { getTweetsInDb } from './db'

export function filterTweets(tweets: Tweet[]) {
  const tweetsInDb = getTweetsInDb(tweets.map((tweet) => tweet.id))

  return tweets.filter((tweet) => {
    if (tweetsInDb.includes(tweet.id)) return false

    let processedText = tweet.text

    processedText = processedText.replace(
      /https?:\/\/(?:www\.)?l2beat\.com\S*/gi,
      '',
    )
    processedText = processedText.replace(/@\s*l2\s*beat\b/gi, '')

    const l2beatRegex = /l2\s*beat/gi
    const matches = processedText.match(l2beatRegex)

    if (!matches) return false

    return matches.some((match) => match !== 'L2BEAT')
  })
}
