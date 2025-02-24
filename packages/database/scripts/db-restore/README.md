# TVL restore script

> ⚠️ **Running script will result in wiping local DB**: Be very careful here!


## How to use

1. Change directory to `database\scripts\tvl-restore`
2. Create .env & set variables
> ⚠️ **Use readonly credential for remote**: Be very careful here!
```
DEV_LOCAL_DB_URL=postgresql://postgres:password@localhost:5432/l2beat_local
PRISMA_DB_URL=postgresql://postgres:password@localhost:5432/l2beat_local
DEV_REMOTE_DB_URL_READ_ONLY=
```
3. Run the script
```
./tvl-restore.sh <FEATURE>
```
