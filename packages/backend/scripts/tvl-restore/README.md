# TVL restore script

## How to use

1. Change directory to `backend\scripts\tvl-restore`
2. Create .env & set variables
> ⚠️ **Use readonly credential**: Be very careful here!
```
DEV_LOCAL_DB_URL=url
DEV_REMOTE_DB_URL_READ_ONLY=url
```
3. Make sure you have created `l2beat-local` database
4. Run the script
```
./tvl-restore.sh
```