git checkout main 
git pull 
git switch - 
git checkout main -- src/tokens/generated.json 
yarn tokens

#!/bin/bash

# Define the file you want to check
FILE="src/tokens/generated.json"

# Check for differences in the specified file between the current branch and the origin/main branch
# Check for differences in the specified file between the current branch and the origin/main branch
if git diff --quiet origin/main -- "$FILE"; then
  # No differences in the specified file, print green tick
  echo "✔ Tokens added using a script."
  exit 0
else
  # Differences found in the specified file, print red cross
  echo "✘ Manual override detected, please re-run yarn tokens."
  exit 1
fi
