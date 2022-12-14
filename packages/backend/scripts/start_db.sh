#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

name=l2beat_postgres

if [ ! "$(docker ps -q -f name=${name})" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=${name})" ]; then
        echo "${name} container exists. Restarting..."
        docker start l2beat_postgres >/dev/null
    else
        echo "${name} container doesn't exist. Creating it and setting up databases."
        docker run -d --name=l2beat_postgres -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:14
        
        echo "Waiting for db container..."
        sleep 5
        docker exec -it l2beat_postgres psql -U postgres -c 'CREATE DATABASE l2beat_local'
        docker exec -it l2beat_postgres psql -U postgres -c 'CREATE DATABASE l2beat_test'
    fi
else
    echo "${name} container already running."
fi

