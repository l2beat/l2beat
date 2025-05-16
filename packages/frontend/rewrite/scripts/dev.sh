#!/bin/bash

# Exit on error
set -e

export PATH="$(pwd)/node_modules/.bin:$PATH"
export PATH="$(pwd)/../../node_modules/.bin:$PATH"

# Store PIDs for cleanup
pids=()

# Trap SIGINT (Ctrl+C) and SIGTERM
cleanup() {
  echo "Shutting down processes..."
  # Kill all child processes in the process group
  echo "Killing processes with PIDs: ${pids[*]}"
  for pid in "${pids[@]}"; do
    # Kill the process and all its children
    pkill -P $pid 2>/dev/null || true
    kill -9 $pid 2>/dev/null || true
  done
  # Make sure all processes in the current process group are terminated
  pkill -P $$ 2>/dev/null || true
  # Exit the script
  exit 0
}

trap cleanup SIGINT SIGTERM

rm -rf rewrite/dist

# Start processes and capture their PIDs
esbuild \
  rewrite/src/ssr/client-entry.tsx \
  --bundle \
  --watch=forever \
  --tsconfig=rewrite/tsconfig.json \
  --outfile=rewrite/static/index.js < /dev/tty &
pids+=($!)

tailwindcss \
  -i rewrite/src/styles/globals.css \
  -o ./rewrite/static/index.css \
  --watch < /dev/tty &
pids+=($!)

esbuild \
  rewrite/src/index.ts \
  --bundle \
  --platform=node \
  --packages=external \
  --tsconfig=rewrite/tsconfig.json \
  --jsx=automatic \
  --watch=forever \
  --outfile=rewrite/dist/server/index.js < /dev/tty &
pids+=($!)

while [ ! -f rewrite/dist/server/index.js ]; do
  sleep 0.1
done

NEXT_PUBLIC_REWRITE=true node --watch rewrite/dist/server/index.js
pids+=($!)

echo "All processes started. Press Ctrl+C to exit."
echo "PIDs: ${pids[*]}"

# Wait for all processes to complete (or be killed by the trap)
wait