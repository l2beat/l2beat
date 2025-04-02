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
</head>

<body style="background-color:#222;color:white;">
  <h1>Diff between ${props.commitBefore.slice(0, 8)} (main) and ${props.commitAfter.slice(0, 8)} (PR)</h1>
  <ul>${props.diffs.map(diffToHtml).join('')}</ul>
</body>

</html>`
}

function diffToHtml(diff: ProjectDiff) {
  return `<li>
  <h2>Project: ${diff.id} - ${diff.type}</h2>
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
  let style = ' style="color:#999;"'
  if (change.added) {
    style = ' style="font-weight:bold;color:lime;"'
  }
  if (change.removed) {
    style = ' style="font-weight:bold;color:red;"'
  }
  return `<span${style}>${change.value}</span>`
}
