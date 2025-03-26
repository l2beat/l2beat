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
  src/ssr/entry.client.tsx \
  --bundle \
  --watch=forever \
  --outfile=static/index.js &
pids+=($!)

tailwindcss \
  -i src/styles/globals.css \
  -o ./static/index.css \
  --watch < /dev/tty &
pids+=($!)

tsx --watch src/index.ts &
pids+=($!)

echo "All processes started. Press Ctrl+C to exit."
echo "PIDs: ${pids[*]}"

# Wait for all processes to complete (or be killed by the trap)
wait