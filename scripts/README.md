# Scripts

## Coolify: check environment variables

[`scripts/coolify/check-env.ts`](coolify/check-env.ts) lists every application on your [Coolify](https://coolify.io/) instance (via the HTTP API) and checks whether each one defines a given environment variable **by key** (exact match). Output uses `project/environment/application` labels when project and environment metadata are available.

It is especially handy when you are changing, rotating, or cleaning up a variable and you are not sure which application still uses it—before you had to click through Coolify apps by hand; this script checks all of them in one run.

From the repository root:

```bash
pnpm coolify:check-env SOME_ENV_VAR
```

**Configuration**

- Loads [dotenv](https://github.com/motdotla/dotenv) from the **repo root** `.env` if present.
- **`COOLIFY_API_KEY`** (required): Coolify API token (Keys & Tokens → API tokens). Pass with `--api-key` or set in `.env` / the environment.
- **`COOLIFY_SERVER`** (optional): Coolify base URL. Defaults to `https://coolify.l2beat.com`; override with `--server` / `-s` or `COOLIFY_SERVER`.

Run `pnpm coolify:check-env --help` for full CLI options.
