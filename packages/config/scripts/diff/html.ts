import type { Change } from 'diff'
import type { FieldDiff, ProjectDiff } from './diff'
import { readFileSync } from 'fs'

export function diffsToHtml(props: {
  diffs: ProjectDiff[]
  commitBefore: string
  commitAfter: string
}) {
  const alpineSource = readFileSync(
    require.resolve('alpinejs/dist/cdn.min.js'),
    'utf-8',
  )

  return `<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>Diff</title>
  <style>${getStyles()}</style>
</head>

<body>
  <script>${alpineSource}</script>
  <h1>
    Diff between
    <code class="removed">${props.commitBefore.slice(0, 8)}</code> (main)
    and
    <code class="added">${props.commitAfter.slice(0, 8)}</code> (PR)
  </h1>
  <ul>${props.diffs.map(diffToHtml).join('')}</ul>
</body>

</html>`
}

function diffToHtml(diff: ProjectDiff, _index: number, diffs: ProjectDiff[]) {
  const initialOpen = diffs.length === 1

  return `<li x-data="{ open: ${initialOpen} }">
  <h2>
    <button @click="open = !open" x-text="open ? 'Close' : 'Open'"></button>
    <span>${diff.id}</span>
    <span class="${diff.type}">${diff.type}<span>
  </h2>
  <ul class="field" x-show="open">${diff.fields.map(fieldDiffToHtml).join('')}</ul>
</li>`
}

function fieldDiffToHtml(
  field: FieldDiff,
  _index: number,
  fields: FieldDiff[],
) {
  const initialOpen = fields.length === 1

  return `<li x-data="{ open: ${initialOpen} }">
  <h3>
    <button @click="open = !open" x-text="open ? 'Close' : 'Open'"></button>
    <span>${field.field}</span>
  </h3>
  <pre x-show="open"><code>${field.diff.map(changeToHtml).join('')}</code></pre>
</li>`
}

function changeToHtml(change: Change) {
  let className = 'unmodified'
  if (change.added) {
    className = 'added'
  }
  if (change.removed) {
    className = 'removed'
  }
  return `<span class="${className}">${change.value}</span>`
}

function getStyles() {
  return `
:root {
  --font-mono: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
  --font-sans: system-ui, sans-serif;
}
body {
  background-color: #222;
  color: white;
  font-family: var(--font-sans);
}
.unmodified {
  color: #999;
}
.modified {
  color: yellow;
}
.added {
  background-color: #14261f;
  color: #7ee787;
}
.removed {
  background-color: #27181d;
  color: #f14236;
}
button {
  font-size: 12px;
  font-family: var(--font-sans);
  min-width: 60px;
  background-color: #444;
  font-family: inherit;
  color: white;
}
pre, code {
  font-family: var(--font-mono);
}
pre {
  background-color: #111;
  margin: 0;
  padding: 8px;
  font-weight: normal;
  font-size: 12px;
}
h1 {
  font-size: 24px;
  font-weight: normal;
  margin: 16px 0 24px 0;
}
h2, h3 {
  font-size: 14px;
  font-weight: normal;
  padding: 8px 0;
  margin: 0;
  position: sticky;
}
h2 {
  top: 0;
  background-color: #222;
}
h3 {
  top: 28px;
  background-color: #222;
}
ul {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}
.field {
  margin-left: 16px;
}
`
}
