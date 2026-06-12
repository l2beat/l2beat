#!/usr/bin/env bash
set -euo pipefail

BACKOFFICE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ROOT_DIR="$(cd "$BACKOFFICE_DIR/../.." && pwd)"
NO_BACKEND_LOGS=false

backend_pid=""
backoffice_pid=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-backend-logs)
      NO_BACKEND_LOGS=true
      shift
      ;;
    *)
      echo "Unknown argument: $1" >&2
      echo "Usage: $0 [--no-backend-logs]" >&2
      exit 1
      ;;
  esac
done

stop_process() {
  local pid="$1"

  if [[ -z "$pid" ]]; then
    return
  fi

  if kill -0 "$pid" 2>/dev/null; then
    pkill -TERM -P "$pid" 2>/dev/null || true
    kill -TERM "$pid" 2>/dev/null || true
  fi
}

cleanup() {
  local exit_code="${1:-0}"
  trap - INT TERM

  stop_process "$backend_pid"
  stop_process "$backoffice_pid"

  if [[ -n "$backend_pid" ]]; then
    wait "$backend_pid" 2>/dev/null || true
  fi

  if [[ -n "$backoffice_pid" ]]; then
    wait "$backoffice_pid" 2>/dev/null || true
  fi

  exit "$exit_code"
}

trap 'cleanup 130' INT TERM

if [[ "$NO_BACKEND_LOGS" == "true" ]]; then
  pnpm -C "$ROOT_DIR/packages/backend" dev >/dev/null 2>&1 &
else
  pnpm -C "$ROOT_DIR/packages/backend" dev &
fi
backend_pid=$!

pnpm -C "$BACKOFFICE_DIR" dev &
backoffice_pid=$!

echo "Started backend (PID $backend_pid) and backoffice (PID $backoffice_pid)."
if [[ "$NO_BACKEND_LOGS" == "true" ]]; then
  echo "Backend logs disabled."
fi
echo "Press Ctrl+C to stop both."

while true; do
  if ! kill -0 "$backend_pid" 2>/dev/null; then
    set +e
    wait "$backend_pid"
    backend_exit_code=$?
    set -e
    echo "Backend exited with code $backend_exit_code"
    cleanup "$backend_exit_code"
  fi

  if ! kill -0 "$backoffice_pid" 2>/dev/null; then
    set +e
    wait "$backoffice_pid"
    backoffice_exit_code=$?
    set -e
    echo "Backoffice exited with code $backoffice_exit_code"
    cleanup "$backoffice_exit_code"
  fi

  sleep 1
done
