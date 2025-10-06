# How to run compare locally?

1. install headless browser for scraping
```ts
pnpm exec playwright install chromium
```
2. Set new variable in .env (in backend folder)
- connect to staging/production database
- ⚠️ make sure credential is readonly
```
INTEROP_DB_URL
```
3. Run compare script from backend folder
```bash
pnpm bridges:compare
```
- there is a possibility to specify comma-separated list of plugins
```bash
pnpm bridges:compare across,stargate
```
4. The script will
- fetch data to compare from external providers
- run comparison between staging/production DB and external data
