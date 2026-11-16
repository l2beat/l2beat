#!/bin/sh
# Installs the repo's git hooks into this clone; `pnpm install` runs it. Each
# installed hook is a stub that runs the copy in scripts/git-hooks/ of the
# worktree you push from. A hook of your own under the same name, or a
# core.hooksPath you set, is left alone. Outside a git checkout (e.g. a
# Docker build, where `prepare` skips it) it does nothing.
git rev-parse --git-dir >/dev/null 2>&1 || exit 0
[ -n "$(git config core.hooksPath)" ] && exit 0
hooks=$(git rev-parse --path-format=absolute --git-common-dir)/hooks
marker='# Installed by scripts/git-hooks/install.sh'
mkdir -p "$hooks"
for hook in pre-push; do
  target="$hooks/$hook"
  if [ -e "$target" ] && ! grep -qF "$marker" "$target"; then
    echo "git-hooks: $target is your own, so scripts/git-hooks/$hook is not installed"
    continue
  fi
  cat > "$target" <<STUB
#!/bin/sh
$marker
hook="\$(git rev-parse --show-toplevel)/scripts/git-hooks/$hook"
[ -x "\$hook" ] || exit 0
exec "\$hook" "\$@"
STUB
  chmod +x "$target"
done
exit 0
