#!/bin/sh
set -e
curl https://sh.rustup.rs -sSf | sh -s -- -y
export PATH="$HOME/.cargo/bin:$PATH"
cargo install mdbook@0.5.0
mdbook build
