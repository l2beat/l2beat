# TVL restore script

## How to use

1. Change directory to `backend\scripts\tvl-restore`
1. Set environmental variables
```
export DEV_LOCAL_DB_URL = url
```
> ⚠️ **Use readonly credential**: Be very careful here!
```
export DEV_REMOTE_DB_URL_READ_ONLY = url
```
2. Give permissions for the script to run
```
chmod 755 tvl-restore.sh
```
3. Make sure you have created `l2beat-local` database
4. Run the script
```
yarn tvl-restore
```