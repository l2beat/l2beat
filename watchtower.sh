#! /bin/bash

docker build -f Dockerfile.watchtower --platform linux/amd64 -t watchtower:latest .
docker tag watchtower:latest registry.digitalocean.com/l2beat/watchtower:latest
docker push registry.digitalocean.com/l2beat/watchtower:latest
