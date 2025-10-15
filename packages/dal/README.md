# @l2beat/dal

To set up a local Redis instance, run:
`./redis.sh` in `backend/scripts` directory

It will start a Redis instance and print the `REDIS_URL` to the console.

Add it to your `.env` file.

You also need to set `DB_URL` to the database from which the DAL should read.