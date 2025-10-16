# TVL restore script

> ⚠️ **Running script will result in wiping local DB**: Be very careful here!


## How to use

0. If you do not have `psql`, `pg_dump` and `pg_restore`, please install either `postgres` or `libpq`. Remember to add it to `PATH`

1. Change directory to `database\scripts\db-restore` (This exact path is need for Prisma to work)
2. Create .env & set variables
> ⚠️ **Use readonly credential for remote**: Be very careful here!
```
DEV_LOCAL_DB_URL=postgresql://postgres:password@localhost:5432/l2beat_local
DEV_REMOTE_DB_URL_READ_ONLY=
```
3. Run the script
```
./db-restore.sh <FEATURE>
```
