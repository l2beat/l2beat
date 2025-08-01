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

# Start server in background
pnpm start:mock &
server_pid=$!

sleep 2

node -r esbuild-register scripts/test-all-pages/index.ts
