#!/usr/bin/env bash

set -e
find "$(dirname "$0")/../discovery" -maxdepth 2 -mindepth 2 -type d  | grep -v 'discovery$' | grep -v "_testHarness" | grep -v "_templates" | grep "ethereum" | xargs -n 1 -- dirname | xargs -n 1 -- basename | xargs -n 1 -- yarn discover:raw ethereum --dev
