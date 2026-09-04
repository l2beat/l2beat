#!/usr/bin/env bash
# Runs the Python storage-writers analyzer (l2analyze) and this spike's pipeline over flattened
# sources and diffs the two storage-writers tables.
#
#   ./corpus.sh <flat-root> <out-dir> <relative-entrypoint>...
set -u
ROOT=$1
OUT=$2
shift 2
mkdir -p "$OUT"
printf "%-52s %9s %9s %6s %8s  %-28s %s\n" entrypoint analyzer pipeline rows KiB "compile+extract+souffle" verdict
for ep in "$@"; do
  slug=$(echo "$ep" | tr '/:' '__')
  t0=$(date +%s%N)
  l2analyze run storage-writers "$ROOT" --entrypoint "$ep" > "$OUT/$slug.analyzer.md" 2> "$OUT/$slug.analyzer.err"
  t1=$(date +%s%N)
  pnpm exec tsx src/main.ts pipeline "$ROOT/$ep" --unit "$ep" --out "$OUT/$slug" > "$OUT/$slug.pipeline.log" 2>&1
  t2=$(date +%s%N)
  rows=$(cat "$OUT/$slug"/facts/*.facts 2>/dev/null | wc -l)
  kib=$(du -sk "$OUT/$slug/facts" 2>/dev/null | cut -f1)
  inner=$(grep -o 'compile [0-9]* ms + extract [0-9]* ms + souffle [0-9]* ms' "$OUT/$slug.pipeline.log" | sed 's/ ms//g; s/compile //; s/ + extract / + /; s/ + souffle / + /')
  if [ -f "$OUT/$slug/report.md" ]; then
    verdict=$(pnpm exec tsx src/compare.ts "$OUT/$slug.analyzer.md" "$OUT/$slug/report.md" 2>&1 | tail -1)
  else
    verdict="PIPELINE FAILED: $(grep -m1 -E 'Error|error|UNHANDLED|exit' "$OUT/$slug.pipeline.log" | cut -c1-80)"
  fi
  printf "%-52s %7d ms %7d ms %6s %8s  %-28s %s\n" "$ep" $(( (t1-t0)/1000000 )) $(( (t2-t1)/1000000 )) "$rows" "${kib:-0}" "${inner:-?}" "$verdict"
done
