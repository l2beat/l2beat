#!/usr/bin/env bash
set -e

# The whole point of this script is to run the commands below
# passing the same arguments to both (in this case e.g. "ethereum arbitrum")
yarn discover:raw "$@"
yarn update-diff-history "$@"
