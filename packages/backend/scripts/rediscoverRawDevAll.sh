#!/usr/bin/env bash

set -e

chains=(
  "ethereum" 
  "arbitrum"
  "optimism"
  "polygonpos"
  "bsc"
#  "avalanche" #
#  "celo" #
  "linea"
  "base"
  "polygonzkevm"
#  "gnosis" #
#  "zksync2" #
#  "sepolia" #
  "scroll"
  "mantle"
  "metis"
#  "bobanetwork" #
#  "mode" #
)

for chain in "${chains[@]}"
do
  find "$(dirname "$0")/../discovery" -maxdepth 2 -mindepth 2 -type d  | grep -v 'discovery$' | grep -v "_testHarness" | grep -v "_templates" | grep "/$chain\$" | xargs -n 1 -- dirname | xargs -n 1 -- basename | xargs -n 1 -- yarn discover:raw $chain --dev
done