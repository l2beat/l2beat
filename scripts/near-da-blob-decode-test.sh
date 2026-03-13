#!/usr/bin/env bash
# NEAR DA blob decode verification for RSS3.
#
# Usage:
#   bash scripts/near-da-blob-decode-test.sh [RPC_URL]
#
# Default RPC:
#   https://rpc.mainnet.near.org

set -euo pipefail

RPC="${1:-https://rpc.mainnet.near.org}"
RECEIVER="vsl-da.near"
SIGNER="vsl-submitter.near"
METHOD="submit"

TX_HASHES=(
  "AhV75ZvmiFDmuSNXYTXzUnVTmNvrc5juF7PnXLskrxmd"
  "HjFyPUXcozKv53bMSe51fYc83HYeELCcFzjQJjLxXDMY"
  "YHupXSrz81LZTxmacsHQqgACSGcpToJxaEL5ze3XSNA"
)
EXPECTED_BLOCKS=(
  "186940409"
  "186939614"
  "186938792"
)
EXPECTED_SIZES=(
  "10402"
  "10819"
  "10401"
)
EXPECTED_SHARD="5"

if [ "${#TX_HASHES[@]}" -ne "${#EXPECTED_BLOCKS[@]}" ] || \
   [ "${#TX_HASHES[@]}" -ne "${#EXPECTED_SIZES[@]}" ]; then
  echo "ERROR: TX_HASHES, EXPECTED_BLOCKS, and EXPECTED_SIZES must have identical lengths." >&2
  exit 1
fi

require_cmd() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "ERROR: required command '$cmd' is not installed." >&2
    exit 1
  fi
}

for cmd in curl jq base64 wc awk date; do
  require_cmd "$cmd"
done

rpc_call() {
  local payload="$1"
  local response
  if ! response=$(curl -sS -L --max-time 30 "$RPC" \
    -H 'Content-Type: application/json' \
    --data "$payload"); then
    echo "ERROR: RPC request failed (network/DNS/rate limit)." >&2
    echo "RPC: $RPC" >&2
    echo "Payload: $payload" >&2
    exit 1
  fi

  if ! echo "$response" | jq -e . >/dev/null 2>&1; then
    echo "ERROR: RPC response is not valid JSON." >&2
    echo "$response" >&2
    exit 1
  fi

  local rpc_error
  rpc_error=$(echo "$response" | jq -r '.error.message // empty')
  if [ -n "$rpc_error" ]; then
    echo "ERROR: RPC returned error: $rpc_error" >&2
    echo "RPC: $RPC" >&2
    echo "Payload: $payload" >&2
    exit 1
  fi

  echo "$response"
}

decode_b64_stream() {
  if printf '' | base64 --decode >/dev/null 2>&1; then
    base64 --decode
  elif printf '' | base64 -d >/dev/null 2>&1; then
    base64 -d
  else
    base64 -D
  fi
}

b64_size() {
  local b64="$1"
  printf '%s' "$b64" | decode_b64_stream | wc -c | tr -d '[:space:]'
}

to_utc() {
  local ns="$1"
  local sec=$((ns / 1000000000))
  date -r "$sec" '+%Y-%m-%d %H:%M:%S UTC' 2>/dev/null || \
    date -u -d "@$sec" '+%Y-%m-%d %H:%M:%S UTC' 2>/dev/null || \
    echo "$sec"
}

FAILURES=0
pass() { echo "  ✓ $1"; }
fail() { echo "  ✗ $1"; FAILURES=$((FAILURES + 1)); }

echo "=== NEAR DA Blob Decode Verification ==="
echo "RPC: $RPC"
echo "Expected signer:   $SIGNER"
echo "Expected receiver: $RECEIVER"
echo "Expected method:   $METHOD"
echo ""

declare -a BLOCKS
declare -a TIMESTAMPS
declare -a TX_SIZES
declare -a CHUNK_SIZES
declare -a SHARDS

echo "--- Step 1: Resolve known tx hashes and verify metadata ---"
for tx in "${TX_HASHES[@]}"; do
  idx="${#BLOCKS[@]}"
  expected_block="${EXPECTED_BLOCKS[$idx]}"

  tx_data=$(rpc_call "{\"jsonrpc\":\"2.0\",\"id\":\"1\",\"method\":\"tx\",\"params\":[\"${tx}\",\"${SIGNER}\"]}")

  signer=$(echo "$tx_data" | jq -r '.result.transaction.signer_id')
  receiver=$(echo "$tx_data" | jq -r '.result.transaction.receiver_id')
  method=$(echo "$tx_data" | jq -r '.result.transaction.actions[0].FunctionCall.method_name')
  block_hash=$(echo "$tx_data" | jq -r '.result.transaction_outcome.block_hash')
  tx_hash_rpc=$(echo "$tx_data" | jq -r '.result.transaction.hash')

  block_data=$(rpc_call "{\"jsonrpc\":\"2.0\",\"id\":\"1\",\"method\":\"block\",\"params\":{\"block_id\":\"${block_hash}\"}}")
  block_height=$(echo "$block_data" | jq -r '.result.header.height')
  timestamp_ns=$(echo "$block_data" | jq -r '.result.header.timestamp_nanosec')

  echo "  tx=${tx:0:12}... block=${block_height} time=$(to_utc "$timestamp_ns")"

  [ "$tx_hash_rpc" = "$tx" ] && pass "tx hash matches RPC response" || fail "tx hash mismatch for $tx"
  [ "$signer" = "$SIGNER" ] && pass "signer=$signer" || fail "unexpected signer for $tx: $signer"
  [ "$receiver" = "$RECEIVER" ] && pass "receiver=$receiver" || fail "unexpected receiver for $tx: $receiver"
  [ "$method" = "$METHOD" ] && pass "method=$method" || fail "unexpected method for $tx: $method"
  [ "$block_height" = "$expected_block" ] && pass "block=${block_height}" || fail "unexpected block for $tx: $block_height (expected $expected_block)"

  BLOCKS+=("$block_height")
  TIMESTAMPS+=("$timestamp_ns")
done
echo ""

echo "--- Step 2: Blob size via tx endpoint (baseline) ---"
for tx in "${TX_HASHES[@]}"; do
  idx="${#TX_SIZES[@]}"
  expected_size="${EXPECTED_SIZES[$idx]}"

  tx_data=$(rpc_call "{\"jsonrpc\":\"2.0\",\"id\":\"1\",\"method\":\"tx\",\"params\":[\"${tx}\",\"${SIGNER}\"]}")
  args_b64=$(echo "$tx_data" | jq -r '.result.transaction.actions[0].FunctionCall.args')
  bytes=$(b64_size "$args_b64")
  TX_SIZES+=("$bytes")
  echo "  tx=${tx:0:12}... decoded_bytes=${bytes}"
  [ "$bytes" = "$expected_size" ] && pass "decoded_bytes=${bytes}" || fail "unexpected decoded bytes for $tx: $bytes (expected $expected_size)"
done
echo ""

echo "--- Step 3: Blob size via chunk endpoint (provider path) ---"
for i in "${!BLOCKS[@]}"; do
  tx="${TX_HASHES[$i]}"
  block="${BLOCKS[$i]}"
  tx_size="${TX_SIZES[$i]}"

  block_data=$(rpc_call "{\"jsonrpc\":\"2.0\",\"id\":\"1\",\"method\":\"block\",\"params\":{\"block_id\":${block}}}")
  non_empty=$(echo "$block_data" | jq '[.result.chunks[] | select(.gas_used > 0) | {shard_id, chunk_hash}]')
  chunk_hashes=$(echo "$non_empty" | jq -r '.[].chunk_hash')

  found=false
  for chunk_hash in $chunk_hashes; do
    shard_id=$(echo "$non_empty" | jq -r ".[] | select(.chunk_hash == \"${chunk_hash}\") | .shard_id")
    chunk_data=$(rpc_call "{\"jsonrpc\":\"2.0\",\"id\":\"1\",\"method\":\"chunk\",\"params\":{\"chunk_id\":\"${chunk_hash}\"}}")

    tx_obj=$(echo "$chunk_data" | jq -c ".result.transactions[] | select(.hash == \"${tx}\" and .receiver_id == \"${RECEIVER}\")")
    if [ -z "$tx_obj" ]; then
      continue
    fi

    method=$(echo "$tx_obj" | jq -r '.actions[] | select(has("FunctionCall")) | .FunctionCall.method_name' | head -n 1)
    args_b64=$(echo "$tx_obj" | jq -r '.actions[] | select(has("FunctionCall")) | .FunctionCall.args' | head -n 1)
    chunk_size=$(b64_size "$args_b64")

    SHARDS+=("$shard_id")
    CHUNK_SIZES+=("$chunk_size")

    echo "  tx=${tx:0:12}... block=${block} shard=${shard_id} chunk=${chunk_hash:0:12}... chunk_bytes=${chunk_size}"

    [ "$method" = "$METHOD" ] && pass "chunk method=$method" || fail "chunk method mismatch for $tx: $method"
    [ "$shard_id" = "$EXPECTED_SHARD" ] && pass "shard=${shard_id}" || fail "unexpected shard for $tx: $shard_id (expected $EXPECTED_SHARD)"
    [ "$chunk_size" = "$tx_size" ] && pass "chunk bytes == tx bytes (${chunk_size})" || fail "chunk bytes (${chunk_size}) != tx bytes (${tx_size})"

    found=true
    break
  done

  if [ "$found" = "false" ]; then
    fail "tx ${tx:0:12}... not found in non-empty chunks of block ${block}"
  fi
done
echo ""

echo "--- Step 4: Sample submission gaps (these 3 txs only) ---"
sorted_timestamps=()
while IFS= read -r ts; do
  sorted_timestamps+=("$ts")
done < <(printf '%s\n' "${TIMESTAMPS[@]}" | sort -n)
if [ "${#sorted_timestamps[@]}" -ge 2 ]; then
  total_gap=0
  gap_count=0
  for i in $(seq 1 $((${#sorted_timestamps[@]} - 1))); do
    prev="${sorted_timestamps[$((i - 1))]}"
    curr="${sorted_timestamps[$i]}"
    gap_sec=$(((curr - prev) / 1000000000))
    gap_min=$(awk -v s="$gap_sec" 'BEGIN { printf "%.2f", s / 60 }')
    echo "  gap_${i}: ${gap_sec}s (${gap_min} min)"
    total_gap=$((total_gap + gap_sec))
    gap_count=$((gap_count + 1))
  done
  avg_gap=$(awk -v sum="$total_gap" -v n="$gap_count" 'BEGIN { printf "%.2f", sum / n }')
  echo "  average_gap: ${avg_gap}s over ${gap_count} intervals (sample only)"
else
  echo "  Not enough timestamps to calculate gaps."
fi
echo ""

echo "--- Step 5: Protocol config checks (RPC-derived) ---"
proto=$(rpc_call '{"jsonrpc":"2.0","id":"1","method":"EXPERIMENTAL_protocol_config","params":{"finality":"final"}}')
gas_limit=$(echo "$proto" | jq -r '.result.gas_limit')
epoch_length=$(echo "$proto" | jq -r '.result.epoch_length')
max_tx_size=$(echo "$proto" | jq -r '.result.runtime_config.wasm_config.limit_config.max_transaction_size')
max_args=$(echo "$proto" | jq -r '.result.runtime_config.wasm_config.limit_config.max_arguments_length')
max_total_prepaid_gas=$(echo "$proto" | jq -r '.result.runtime_config.wasm_config.limit_config.max_total_prepaid_gas')
shard_count=$(echo "$proto" | jq -r '
  .result.shard_layout
  | if has("V2") then .V2.shard_ids
    elif has("V1") then .V1.shard_ids
    else [] end
  | length
')

echo "  shard_count=${shard_count}"
echo "  gas_limit_per_chunk=${gas_limit} (1e12 = 1 Tgas)"
echo "  max_transaction_size=${max_tx_size} bytes"
echo "  max_arguments_length=${max_args} bytes"
echo "  max_total_prepaid_gas_per_tx=${max_total_prepaid_gas}"
echo ""

echo "--- Step 6: Live block interval sample (finalized chain) ---"
sample_intervals=8
latest=$(rpc_call '{"jsonrpc":"2.0","id":"1","method":"block","params":{"finality":"final"}}' | jq -r '.result.header.height')
start=$((latest - sample_intervals))
echo "  latest_block=${latest} sample_start=${start} interval_count=${sample_intervals}"

prev_ts=""
min_ms=0
max_ms=0
sum_ms=0
count=0
h="$start"
while [ "$h" -le "$latest" ]; do
  ts=$(rpc_call "{\"jsonrpc\":\"2.0\",\"id\":\"1\",\"method\":\"block\",\"params\":{\"block_id\":${h}}}" | jq -r '.result.header.timestamp_nanosec')
  if [ -n "$prev_ts" ]; then
    diff_ms=$(((ts - prev_ts) / 1000000))
    echo "  block=${h} delta_ms=${diff_ms}"
    sum_ms=$((sum_ms + diff_ms))
    count=$((count + 1))
    if [ "$count" -eq 1 ] || [ "$diff_ms" -lt "$min_ms" ]; then min_ms="$diff_ms"; fi
    if [ "$diff_ms" -gt "$max_ms" ]; then max_ms="$diff_ms"; fi
  fi
  prev_ts="$ts"
  h=$((h + 1))
done

if [ "$count" -gt 0 ]; then
  avg_ms=$((sum_ms / count))
  echo "  interval_summary: avg_ms=${avg_ms} min_ms=${min_ms} max_ms=${max_ms} samples=${count}"
fi
echo ""

echo "--- Verification summary ---"
if [ "$FAILURES" -eq 0 ]; then
  echo "PASS: all explicit checks succeeded."
else
  echo "FAIL: ${FAILURES} check(s) failed."
  exit 1
fi
