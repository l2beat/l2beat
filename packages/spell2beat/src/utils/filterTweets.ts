import type { Tweet } from 'agent-twitter-client'

export function filterTweets(tweets: Tweet[]) {
  return tweets.filter((tweet) => {
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
