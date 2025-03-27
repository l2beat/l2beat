import { getEnv } from '@l2beat/backend-tools'
import { Scraper, SearchMode } from 'agent-twitter-client'
import { insertTweet } from './utils/db'
import { filterTweets } from './utils/filterTweets'
import { generateResponse } from './utils/generateResponse'

async function main() {
  const scraper = await getScraper()
  const tweets = await scraper.fetchSearchTweets(
    '"l2beat" OR "l2 beat"',
    20,
    SearchMode.Latest,
  )
  const filteredTweets = filterTweets(tweets.tweets)

  console.log(
    `Found ${filteredTweets.length} tweets with incorrect L2BEAT mentions`,
  )

  for (const tweet of filteredTweets) {
    const response = await generateResponse(tweet.text)
    await scraper.sendTweet(response, tweet.id)
    insertTweet(tweet.id)
  }
}

main()

async function getScraper() {
  const env = getEnv()
  const scraper = new Scraper()

  const cookies = [
    env.string('TWITTER_COOKIE_GUEST_ID'),
    env.string('TWITTER_COOKIE_CF_BM'),
    env.string('TWITTER_COOKIE_KDT'),
    env.string('TWITTER_COOKIE_TWID'),
    env.string('TWITTER_COOKIE_CT0'),
    env.string('TWITTER_COOKIE_AUTH_TOKEN'),
    env.string('TWITTER_COOKIE_ATT'),
  ]

  await scraper.setCookies(cookies)

  return scraper
}
