#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

name=l2beat_postgres
image=postgres:18

assert_postgres_version() {
    local server_version_num
    if ! server_version_num=$(docker exec "${name}" psql -U postgres -tAc 'SHOW server_version_num' 2>/dev/null); then
        echo "${name} is not accepting connections yet, skipping the PostgreSQL 18 check."
        return 0
    fi
    if [[ "${server_version_num}" != 18* ]]; then
        echo "${name} runs PostgreSQL ${server_version_num}, but this checkout requires PostgreSQL 18."
        echo "Major versions cannot reuse data directories. Migrate or remove the old container, then rerun this script."
        exit 1
    fi
}

if [ ! "$(docker ps -q -f "name=${name}")" ]; then
    if [ "$(docker ps -aq -f status=exited -f "name=${name}")" ]; then
        echo "${name} container exists. Restarting..."
        docker start "${name}" >/dev/null

        sleep 5
        if [ "$(docker ps -aq -f status=exited -f "name=${name}")" ]; then
            echo "Couldn't restart ${name}"
            docker logs "${name}" --since 10s
            exit 1
        else
            assert_postgres_version
            echo "Restarted successfully"
        fi
    else
        echo "${name} container doesn't exist. Creating it and setting up databases."
        docker run -d --name="${name}" -p 5432:5432 -e POSTGRES_PASSWORD=password "${image}"

        echo "Waiting for db container..."
        sleep 5
        assert_postgres_version
        docker exec -it "${name}" psql -U postgres -c 'CREATE DATABASE l2beat_local'
        docker exec -it "${name}" psql -U postgres -c 'CREATE DATABASE l2beat_test'
    fi
else
    assert_postgres_version
    echo "${name} container already running."
fi
