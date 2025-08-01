#!/bin/bash

# Exit on error
set -e

pnpm build

pnpm start:mock | grep ERROR & SERVER_PID=$!
sleep 3 
node -r esbuild-register scripts/test-all-pages/index.ts 

kill $SERVER_PID