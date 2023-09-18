#!/usr/bin/env bash
set -e

yarn discover:raw "$@"
yarn update-diff-history "$@"
