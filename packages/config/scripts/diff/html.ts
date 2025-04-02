import type { Change } from 'diff'
import type { FieldDiff, ProjectDiff } from './diff'

export function diffsToHtml(props: {
  diffs: ProjectDiff[]
  commitBefore: string
  commitAfter: string
}) {
  return `<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>Diff</title>
  <style>
body {
  background-color:#222;
  color:white;
}
h1, h2, h3 {
  font-family: monospace;
}
pre {
  background-color: #111;
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
  </style>
</head>

<body>
  <h1>
    Diff between
    <span class="removed">${props.commitBefore.slice(0, 8)}</span> (main)
    and
    <span class="added">${props.commitAfter.slice(0, 8)}</span> (PR)
  </h1>
  <ul>${props.diffs.map(diffToHtml).join('')}</ul>
</body>

</html>`
}

function diffToHtml(diff: ProjectDiff) {
  return `<li>
  <h2>Project: ${diff.id} - <span class="${diff.type}">${diff.type}<span></h2>
  <ul>${diff.fields.map(fieldDiffToHtml).join('')}</ul>
</li>`
}

function fieldDiffToHtml(field: FieldDiff) {
  return `<li>
  <h3>${field.field}</h3>
  <pre><code>${field.diff.map(changeToHtml).join('')}</code></pre>
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
