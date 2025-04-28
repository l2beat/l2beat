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
  pkill -P $ 2>/dev/null || true
  # Exit the script
  exit 0
}

trap cleanup SIGINT SIGTERM

# Start processes and capture their PIDs
esbuild \
  rewrite/src/ssr/client.tsx \
  --bundle \
  --watch=forever \
  --tsconfig=rewrite/tsconfig.json \
  --outfile=rewrite/static/index.js &
pids+=($!)

tailwindcss \
  -i rewrite/src/styles/globals.css \
  -o ./rewrite/static/index.css \
  --watch < /dev/tty &
pids+=($!)

tsx \
  --tsconfig ./rewrite/tsconfig.json \
  --watch rewrite/src/index.ts &
pids+=($!)

echo "All processes started. Press Ctrl+C to exit."
echo "PIDs: ${pids[*]}"

# Wait for all processes to complete (or be killed by the trap)
wait