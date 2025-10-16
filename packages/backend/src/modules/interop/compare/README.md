# How to run compare locally?

1. Set new variable in .env (in backend folder)
- connect to staging/production database
- ⚠️ make sure credential is readonly
```
INTEROP_DB_URL
```
2. Run compare script from backend folder
```bash
pnpm interop:compare
```
- there is a possibility to specify comma-separated list of plugins
```bash
pnpm interop:compare across,stargate
```
3. The script will
- fetch data to compare from external providers
- run comparison between staging/production DB and external data
