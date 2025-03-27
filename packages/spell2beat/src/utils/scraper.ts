import { getEnv } from '@l2beat/backend-tools'
import { Scraper } from 'agent-twitter-client'

export async function getScraper() {
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
