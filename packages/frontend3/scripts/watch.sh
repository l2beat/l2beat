#!/bin/bash
trap "kill 0" SIGINT

node --watch -r esbuild-register server/index.ts &
esbuild --watch=forever --bundle --outfile=client/static/main.js client/scripts/main.ts &
tailwindcss --watch=always -i ./client/styles/main.css -o ./client/static/main.css &

wait