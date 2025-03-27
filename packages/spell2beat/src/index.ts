import { getEnv } from '@l2beat/backend-tools'
import { Scraper, SearchMode } from 'agent-twitter-client'
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
  }
}

main()

async function getScraper() {
  const env = getEnv()
  const scraper = new Scraper()
  await scraper.login(
    env.string('TWITTER_USERNAME'),
    env.string('TWITTER_PASSWORD'),
  )
  return scraper
}
