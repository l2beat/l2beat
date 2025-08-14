#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

name=l2beat_postgres

if [ ! "$(docker ps -q -f name=${name})" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=${name})" ]; then
        echo "${name} container exists. Restarting..."
        docker start ${name} >/dev/null

        sleep 5
        if [ "$(docker ps -aq -f status=exited -f name=${name})" ]; then
            echo "Couldn't restart ${name}"
            docker logs ${name} --since 10s
            exit 1
        else 
            echo "Restarted successfully"
        fi
    else
        echo "${name} container doesn't exist. Creating it and setting up databases."
        docker run -d --name=${name} -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:15
        
        echo "Waiting for db container..."
        sleep 5
        docker exec -it ${name} psql -U postgres -c 'CREATE DATABASE l2beat_local'
        docker exec -it ${name} psql -U postgres -c 'CREATE DATABASE l2beat_test'
    fi
else
    echo "${name} container already running."
fi
