import type { Tweet } from 'agent-twitter-client'
import { getTweetsInDb } from './db'

export function filterTweets(tweets: Tweet[]) {
  const tweetsInDb = getTweetsInDb(
    tweets.map((tweet) => tweet.id).filter((tweet) => tweet !== undefined),
  )

  return tweets.filter((tweet) => {
    if (!tweet.id || !tweet.text) return false
    if (tweetsInDb.includes(tweet.id) || tweet.username === 'SPELL2BEAT')
      return false

    let processedText = tweet.text

    processedText = processedText.replace(
      /https?:\/\/(?:www\.)?l2beat\.com\S*/gi,
      '',
    )
    processedText = processedText.replace(/@\s*l2\s*beat(?:gov)?\b/gi, '')

    const l2beatRegex = /l2\s*beat/gi
    const matches = processedText.match(l2beatRegex)

    if (!matches) return false

    return matches.some((match) => match !== 'L2BEAT')
  })
}
