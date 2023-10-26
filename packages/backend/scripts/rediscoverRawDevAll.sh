#!/usr/bin/env bash

set -e
find "$(dirname "$0")/../discovery" -maxdepth 1 -type d  | grep -v 'discovery$' | grep -v "_testHarness" | xargs -n 1 -- basename | xargs -n 1 -- yarn discover:raw ethereum --dev