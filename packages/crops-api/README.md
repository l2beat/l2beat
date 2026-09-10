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

| Environment | Hostname                   | Wrangler command                |
| ----------- | -------------------------- | ------------------------------- |
| production  | `crops.l2beat.com`         | `wrangler deploy --env production` |
| staging     | `crops-staging.l2beat.com` | `wrangler deploy --env staging`    |

Both are `custom_domain` routes in `wrangler.jsonc`, so Cloudflare creates the
DNS records itself on first deploy as long as the `l2beat.com` zone is in the
same account.

GitHub only offers manual dispatch for workflows that already exist on `main`.
The first staging deploy from a feature branch therefore needs the workflow
file merged first; after that any branch can be dispatched.

### One-time human setup

Wrangler cannot create credentials, so a person has to do this once:

1. Make sure the `l2beat.com` zone is in the Cloudflare account that will own
   the Worker, and that neither `crops` nor `crops-staging` has a DNS record
   yet (Cloudflare refuses to create a custom domain over an existing CNAME).
2. Create a custom API token with two permissions:
   **Account / Workers Scripts / Edit** restricted to that one account, and
   **Zone / Workers Routes / Read** restricted to the `l2beat.com` zone.
   The first uploads the site and attaches the custom domains through the
   account-level Workers domains API, which creates the DNS record and the
   certificate itself. The second is only for wrangler's pre-deploy check that
   the hostname is not already routed to another Worker; without it the deploy
   fails with `Authentication error [code: 10000]` on `/zones/.../workers/routes`
   after the upload. No DNS or SSL rights are needed.
3. Copy the account id from the Workers overview page.
4. Add the GitHub repository secrets `CLOUDFLARE_API_TOKEN` and
   `CLOUDFLARE_ACCOUNT_ID`.
5. Dispatch the workflow with `environment: staging` and run the verification
   below. Then merge, or dispatch with `production`.

### Verification after a deploy

```sh
HOST=https://crops-staging.l2beat.com
curl -si $HOST/v1/crops.json | head -20
curl -si $HOST/v1/project/uniswapv3.json | head -20
curl -si $HOST/v1/addresses.json | head -20
curl -si $HOST/v1/openapi.json | head -20
curl -si $HOST/ | head -20                     # Swagger UI
# pick any chainId/address pair from addresses.json for a hit
curl -si $HOST/v1/address/1/0x000000000022d473030f116ddee9f6b43ac78ba3.json | head -20
# a missing address is an empty 404
curl -si $HOST/v1/address/1/0x0000000000000000000000000000000000000000.json
```

Every response, including the 404, must carry `access-control-allow-origin: *`
and `cache-control: public, max-age=300` from `static/_headers`.
