import { SearchMode } from 'agent-twitter-client'
import { insertTweet } from './utils/db'
import { filterTweets } from './utils/filterTweets'
import { generateResponse } from './utils/generateResponse'
import { getScraper } from './utils/scraper'

async function checkTweets() {
  console.log(`[${new Date().toISOString()}] Checking for tweets...`)
  try {
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
  } catch (error) {
    console.error('Error checking tweets:', error)
  }
}

checkTweets()
setInterval(checkTweets, 3 * 60 * 1000)

console.log('Tweet monitoring service started. Running every 3 minutes.')
