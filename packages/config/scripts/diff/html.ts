import { readFileSync } from 'fs'
import type { FieldDiff, LineChange, ProjectDiff } from './diff'

export function diffsToHtml(props: {
  diffs: ProjectDiff[]
  commitBefore: string
  commitAfter: string
}) {
  const hashBefore = props.commitBefore.slice(0, 8)
  const hashAfter = props.commitAfter.slice(0, 8)
  const linkBefore = `https://github.com/l2beat/l2beat/tree/${props.commitBefore}`
  const linkAfter = `https://github.com/l2beat/l2beat/tree/${props.commitAfter}`

  const alpineSource = readFileSync(
    require.resolve('alpinejs/dist/cdn.min.js'),
    'utf-8',
  )

  return `<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>Diff @${hashAfter}</title>
  <style>${getStyles()}</style>
</head>

<body>
  <script>${alpineSource}</script>
  <h1>
    Diff between
    <a href="${linkBefore}"><code class="removed">${hashBefore}</code></a> (main)
    and
    <a href="${linkAfter}"><code class="added">${hashAfter}</code></a> (PR)
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
    ${diff.type === 'removed' ? `<code class="removed">[REMOVED]</code>` : ''}
    ${diff.type === 'added' ? `<code class="added">[ADDED]</code>` : ''}
    <span>${diff.id}</span>
    <code><span class="added">+${diff.added}</span> <span class="removed">-${diff.removed}</span></code>
    <input type="checkbox" id="${diff.id}" name="${diff.id}" style="margin-left: 12px;">
    <label for="${diff.id}">Viewed</label>
  </h2>
  <ul class="field" x-show="open">${diff.fields.map((field) => fieldDiffToHtml(diff.id, field, diff.fields)).join('')}</ul>
</li>`
}

function fieldDiffToHtml(
  diffId: string,
  field: FieldDiff,
  fields: FieldDiff[],
) {
  const initialOpen = fields.length === 1
  const hasFull = field.diff.some((x) => x.type === 'full')

  const expandButton = `<button x-show="open" @click="expand = !expand" x-text="expand ? 'Hide full' : 'Show full'"></button>`

  return `<li x-data="{ open: ${initialOpen}, expand: false }">
  <h3>
    <button @click="open = !open" x-text="open ? 'Close' : 'Open'"></button>
    ${hasFull ? expandButton : ''}
    <span>${field.field}</span>
    <code><span class="added">+${field.added}</span> <span class="removed">-${field.removed}</span></code>
    <input type="checkbox" id="${diffId}-${field.field}" name="${diffId}-${field.field}" style="margin-left: 12px;">
    <label for="${diffId}-${field.field}">Viewed</label>
  </h3>
  <pre x-show="open" class="lines" :class="expand && 'expand'"><code>${field.diff.map(lineToHtml).join('')}</code></pre>
</li>`
}

function lineToHtml(line: LineChange, i: number, lines: LineChange[]) {
  const separator = i === lines.length - 1 ? '' : '\n'
  let className = line.type
  if (line.type === 'full' && lines[i - 1]?.type !== line.type) {
    className += ' indicator'
  }
  return `<span class="line ${className}">${line.value}${separator}</span>`
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
.lines:not(.expand) .full {
  display: none;
}
.lines:not(.expand) .full.indicator {
  display: block;
  font-size: 0;
  background: repeating-linear-gradient(
    135deg,
    #111,
    #111 8px,
    #555 8px,
    #555 16px
  );
}
.lines {
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
  line-height: 14px;
  max-width: 100%;
  overflow: auto;
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
input[type="checkbox"] {
  margin: 0;
}
.field {
  margin-left: 16px;
}  
`
}
