#!/bin/bash

set -e

tsc -p tsconfig.build.json

STATIC_SRC="src/static"
STATIC_DEST="build/src"

mkdir -p "$STATIC_DEST"
cp -R "$STATIC_SRC/" "$STATIC_DEST/"
