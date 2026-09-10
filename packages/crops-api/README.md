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
not a path filter). Run it manually from any branch with the `environment`
input to deploy `staging` or `production`, and `force` to skip the change check.

| Environment | Hostname                  | Wrangler command       |
| ----------- | ------------------------- | ---------------------- |
| production  | `crops.l2beat.com`        | `wrangler deploy`      |
| staging     | `crops-staging.l2beat.com` | `wrangler deploy --env staging` |

Both are `custom_domain` routes in `wrangler.jsonc`, so Cloudflare creates the
DNS records itself on first deploy as long as the `l2beat.com` zone is in the
same account.

### One-time human setup

Wrangler cannot create credentials, so a person has to do this once:

1. Make sure the `l2beat.com` zone is in the Cloudflare account that will own
   the Worker, and that neither `crops` nor `crops-staging` already has a DNS
   record (Cloudflare refuses to create a custom domain over an existing one).
2. Create an API token from the **Edit Cloudflare Workers** template. It grants
   Workers Scripts edit, Workers Routes edit and the zone DNS edit needed for
   custom domains. Scope it to the `l2beat.com` zone.
3. Copy the account id from the Workers overview page.
4. Add the GitHub repository secrets `CLOUDFLARE_API_TOKEN` and
   `CLOUDFLARE_ACCOUNT_ID`.
5. Dispatch the workflow with `environment: staging` and check the URLs in the
   verification list below. Then merge, or dispatch with `production`.

### Verification after a deploy

```sh
HOST=https://crops-staging.l2beat.com
curl -si $HOST/v1/crops.json | head -20
curl -si $HOST/v1/addresses.json | head -20
curl -si $HOST/v1/openapi.json | head -20
curl -si $HOST/ | head -20                     # Swagger UI
curl -si $HOST/v1/address/1/0x0000000000000000000000000000000000000000.json  # empty 404
```

Every response, including the 404, must carry `access-control-allow-origin: *`
and `cache-control: public, max-age=300` from `static/_headers`.
