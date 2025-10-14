#!/usr/bin/env bash
set -eo pipefail

# ------- Config (override via env) -------
NAME="${NAME:-local-redis}"
PORT="${PORT:-6379}"
# When using Podman, IMAGE needs to be overwrited like `IMAGE=docker://docker.io/library/redis:7.2-alpine`
IMAGE="${IMAGE:-redis:7.2-alpine}"
ROOT="${ROOT:-$(pwd)/.redis}"
TLS_DIR="$ROOT/tls"
DATA_DIR="$ROOT/data"
CONF="$ROOT/redis.conf"
# If this gets updated, then ${ROOT}/redis.conf needs to be updated too
REDIS_PASSWORD="password"

action="${1:-help}"

info()  { echo "[info] $*" >&2; }
warn()  { echo "[warn] $*" >&2; }
die()   { echo "[fatal] $*" >&2; exit 1; }

need() {
  command -v "$1" >/dev/null 2>&1 || die "Missing dependency: $1"
}

ensure_dirs() {
  mkdir -p "$DATA_DIR"
}

# Generate a local CA and a server cert
ensure_certs() {
  [[ -f "$TLS_DIR/ca.crt" && -f "$TLS_DIR/server.crt" && -f "$TLS_DIR/server.key" ]] && return 0

  info "Generating self-signed CA and server certificate..."
  openssl genrsa -out "$TLS_DIR/ca.key" 4096 >/dev/null 2>&1
  openssl req -x509 -new -nodes -key "$TLS_DIR/ca.key" -sha256 -days 3650 \
    -subj "/CN=local-redis-CA" -out "$TLS_DIR/ca.crt" >/dev/null 2>&1

  openssl genrsa -out "$TLS_DIR/server.key" 2048 >/dev/null 2>&1
  openssl req -new -key "$TLS_DIR/server.key" -out "$TLS_DIR/server.csr" -config "$TLS_DIR/server.cnf" >/dev/null 2>&1
  openssl x509 -req -in "$TLS_DIR/server.csr" -CA "$TLS_DIR/ca.crt" -CAkey "$TLS_DIR/ca.key" -CAcreateserial \
    -out "$TLS_DIR/server.crt" -days 3650 -sha256 -extensions v3_req -extfile "$TLS_DIR/server.cnf" >/dev/null 2>&1

  chmod 600 "$TLS_DIR/*"
}

# Init needs to be called only if certificates need to be regenerated
# We store pregenerated certificates in repo so everyone doesn't need to generate certs by himself
init() {
  need openssl
  ensure_dirs
  ensure_certs
}

start() {
  need docker
  ensure_dirs

  docker pull "$IMAGE" >/dev/null

  if docker ps -a --format '{{.Names}}' | grep -q "^${NAME}\$"; then
    warn "Container '$NAME' already exists. Run '$0 restart' to restart"
    return 0
  fi

  info "Starting Redis ($IMAGE) as '$NAME' on port $PORT..."
  # Oddly we can't just run redis-server directly, because it will complain on certificate parmissions
  # Thus we're running sh -> exec workaround
  docker run -d --name "$NAME" --restart unless-stopped \
    -p "${PORT}:6379" \
    -v "$DATA_DIR":/data \
    -v "$TLS_DIR":/tls:ro \
    -v "$CONF":/usr/local/etc/redis/redis.conf:ro \
    "$IMAGE" \
    sh -c "exec redis-server /usr/local/etc/redis/redis.conf"

  echo
  echo "REDIS_URL=rediss://:${REDIS_PASSWORD}@localhost:${PORT}"
  echo "CA cert (for clients that verify TLS): $TLS_DIR/ca.crt"
  echo
  echo "Test from host (requires redis-cli with TLS), for example:"
  echo "  redis-cli -p ${PORT} --tls --cacert \"$TLS_DIR/ca.crt\" -a \"${REDIS_PASSWORD}\" PING"
  echo "  redis-cli -p ${PORT} --tls --insecure  -a \"${REDIS_PASSWORD}\" -h localhost PING"
  echo
  echo "Redis-cli can be installed your package manager, eg. 'brew install redis' or 'sudo apt install redis-tools'"
}

stop() {
  docker rm -f "$NAME" >/dev/null 2>&1 && info "Stopped '$NAME'." || warn "'$NAME' not running."
}

restart() {
  stop
  start
}

logs() { docker logs -f "$NAME"; }

case "$action" in
  init)    init ;;
  start)   start ;;
  stop)    stop ;;
  restart) restart ;;
  logs)    logs ;;
  help|--help|*)
    echo "Usage: $0 {init|start|stop|restart|status|logs}"
    echo 
    echo Env overrides:
    echo NAME=$NAME
    echo PORT=$PORT
    echo IMAGE=$IMAGE
    echo ROOT=$ROOT
    echo REDIS_PASSWORD=$REDIS_PASSWORD
  ;;
esac
