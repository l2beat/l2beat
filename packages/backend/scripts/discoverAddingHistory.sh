#!/usr/bin/env bash
set -e

yarn discover:raw "$@"
yarn diff-report "$@"
