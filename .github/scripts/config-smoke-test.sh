#!/usr/bin/env bash
# Pulls one Coolify app's environment into packages/backend/.env and runs the
# backend's config smoke test against it. Run from packages/backend with
# COOLIFY_SERVER, COOLIFY_API_KEY and COOLIFY_APP_ID set.
set -euo pipefail

if [[ -z "${COOLIFY_APP_ID:-}" ]]; then
  echo "::error::Missing COOLIFY_APP_ID"
  exit 1
fi

response="$(
  curl --fail-with-body --silent --show-error \
    --retry 3 \
    --retry-delay 5 \
    --retry-all-errors \
    --header "Authorization: Bearer $COOLIFY_API_KEY" \
    --header "Accept: application/json" \
    "$COOLIFY_SERVER/api/v1/applications/$COOLIFY_APP_ID/envs"
)"
echo "$response" | jq -r '.[]|(.key + "=" + .real_value)' > .env

pnpm test:config
