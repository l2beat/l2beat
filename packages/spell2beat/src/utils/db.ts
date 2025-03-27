const Database = require('better-sqlite3')

export function getDb() {
  const db = new Database('replied.db')
  db.exec(`
      CREATE TABLE IF NOT EXISTS replied_tweets (
        tweet_id TEXT PRIMARY KEY,
        replied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
  return db
}

export function insertTweet(tweetId: string) {
  const db = getDb()
  db.prepare('INSERT INTO replied_tweets (tweet_id) VALUES (?)').run(tweetId)
}

export function getTweetsInDb(tweetIds: string[]): string[] {
  const db = getDb()
  const placeholders = tweetIds.map(() => '?').join(',')
  const query = `SELECT tweet_id FROM replied_tweets WHERE tweet_id IN (${placeholders})`

  const rows = db.prepare(query).all(tweetIds)
  return rows.map((row: { tweet_id: string }) => row.tweet_id)
}
