# @l2beat/dal

To set up a local Redis instance, run:
`docker run -d --name redis -p 6379:6379 redis:latest`

Then, add this to your `.env` file: `REDIS_URL=redis://localhost:6379`

You also need to set `DB_URL` to the database from which the DAL should read.