#!/usr/bin/env bash
set -e

# The whole point of this script is to run the commands below
# passing the same arguments to both (in this case e.g. "ethereum arbitrum")
if [ "$1" == "all" ]; then
  chains=`find discovery/$2 -maxdepth 1 -mindepth 1 | xargs -n 1 -- basename`
  shift # remove "all" from the arguments

  for chain in $chains
  do
    pnpm discover:raw $chain "$@"
    pnpm update-diff-history $chain "$@"
  done
else
  pnpm discover:raw "$@"
  pnpm update-diff-history "$@"
fi
