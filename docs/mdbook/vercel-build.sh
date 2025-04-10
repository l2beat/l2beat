#!/bin/sh
set -e
curl https://sh.rustup.rs -sSf | sh -s -- -y
source $HOME/.cargo/env
cargo install mdbook
mdbook build
