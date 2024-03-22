
git checkout main 
git pull 
git switch - 
git checkout main -- src/tokens/generated.json 
yarn tokens

# Check for differences between the current branch and the origin/main branch
if git diff --quiet origin/main; then
  # No differences
  echo "No differences with the main branch."
  exit 0
else
  # Differences found
  echo "Differences found with the main branch."
  exit 1
fi