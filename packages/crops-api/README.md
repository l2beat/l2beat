# @l2beat/crops-api

Static site generator for the CROPS API served from
[crops.l2beat.com](https://crops.l2beat.com). Every JSON file is generated from
`@l2beat/config` at build time and served as-is from Cloudflare Workers static
assets, so there is no server code and no runtime dependency.

## Local development

```sh
pnpm build:dependencies  # builds @l2beat/config and its sqlite database
pnpm generate            # writes the site to ./out
pnpm dev                 # generate + serve ./out with wrangler on localhost
```

## Deployment

`.github/workflows/deploy-crops-api.yml` deploys production on every push to
`main` that changes this package or anything it depends on (decided by Turbo,
not a path filter). Run it manually with the `environment` input to deploy
`staging` or `production`, and `force` to skip the change check.

| Environment | Worker              | Hostname                   | Wrangler command                   |
| ----------- | ------------------- | -------------------------- | ---------------------------------- |
| production  | `crops-api`         | `crops.l2beat.com`         | `wrangler deploy --env production` |
| staging     | `crops-api-staging` | `crops-staging.l2beat.com` | `wrangler deploy --env staging`    |

The hostnames are custom domains attached to the Workers once by hand, not
declared in `wrangler.jsonc`. Declaring them would make wrangler list the
zone's routes on every deploy, and the deploy token deliberately has no zone
rights. A custom domain survives every later deploy of the same Worker.

GitHub only offers manual dispatch for workflows that already exist on `main`.
Until then, deploy staging from a laptop with the two variables below exported.

### One-time human setup

Wrangler cannot create credentials or attach domains with the token below, so
a person has to do this once:

1. Create a custom API token with the single permission
   **Account / Workers Scripts / Edit**, restricted to the account that owns
   the `l2beat.com` zone. That is enough to upload the site. It cannot touch
   DNS, certificates, routes or other Workers products.
2. Copy the account id from the Workers & Pages overview page.
3. Add the GitHub repository secrets `CLOUDFLARE_API_TOKEN` and
   `CLOUDFLARE_ACCOUNT_ID`.
4. Deploy staging once so the Worker exists:
   `CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... pnpm exec wrangler deploy --env staging`.
5. In the dashboard open Workers & Pages → `crops-api-staging` → Settings →
   Domains & Routes → Add → Custom domain, enter `crops-staging.l2beat.com`.
   Cloudflare creates the proxied DNS record and issues the certificate
   itself; the first request may return 522 or 526 for a minute while the
   certificate is pending. The hostname must not already have a DNS record.
6. Run the verification below against staging.
7. After the first production deploy from `main`, repeat step 5 for the
   `crops-api` Worker with `crops.l2beat.com`.

### Verification after a deploy

```sh
HOST=https://crops-staging.l2beat.com
curl -si $HOST/v1/crops.json | head -20
curl -si $HOST/v1/project/uniswapv3.json | head -20
curl -si $HOST/v1/openapi.json | head -20
curl -si $HOST/ | head -20                     # Swagger UI
# any reviewed contract address is a hit
curl -si $HOST/v1/address/1/0x000000000022d473030f116ddee9f6b43ac78ba3.json | head -20
# a missing address is an empty 404
curl -si $HOST/v1/address/1/0x0000000000000000000000000000000000000000.json
```

Every response, including the 404, must carry `access-control-allow-origin: *`
and `cache-control: public, max-age=300` from `static/_headers`.
