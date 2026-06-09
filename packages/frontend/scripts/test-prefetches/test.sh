#!/bin/bash

# Exit on error
set -e

# Function to cleanup background processes
cleanup() {
  echo "Cleaning up..."
  kill $server_pid 2>/dev/null || true
}

trap cleanup EXIT

pnpm build

# Start server in background (mock mode -> deterministic prefetched data)
LOG_LEVEL=ERROR pnpm start:mock &
server_pid=$!

sleep 4

node -r esbuild-register scripts/test-prefetches/index.ts
