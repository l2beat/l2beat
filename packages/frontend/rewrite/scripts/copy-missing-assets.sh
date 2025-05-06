#!/bin/bash

# Copy files from public to rewrite/static if they don't exist in destination
cp -rn ./public/icons ./rewrite/static/
cp -rn ./public/images ./rewrite/static/
cp -rn ./public/meta-images/governance ./rewrite/static/meta-images/

echo "Copied missing assets from public to rewrite/static"
